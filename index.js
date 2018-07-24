'use strict';

// Imports dependencies and set up http server

const
	request = require('request'),
	fs = require('fs'),
	https = require('https'),	
	express = require('express'),
	bodyParser = require('body-parser'),
	app = express().use(bodyParser.json()), // creates express http server 
	conf = require('./config.js');

let options = {
	key: fs.readFileSync('/etc/letsencrypt/live/sojansons.com/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/sojansons.com/fullchain.pem')
};

// Sets server port and logs message on success
https.createServer(options, app).listen(process.env.PORT || 5000, () => console.log('webhook is listening'));

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    
    let entries = body.entry[0].messaging;
    // Iterates over each entry - there may be multiple if batched
    entries.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0

      let sender = entry.sender.id;
      if(entry.message && entry.message.text) {
      	let msg_text = entry.message.text;
      	console.log('usuario: ' + sender + ' envió el mensaje "' + msg_text +'"');
      	messageHandler(sender, msg_text, true);
      }
      

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN || conf.VERIFY_TOKEN;
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

function messageHandler(receptor, data, isText) {
	let payload = {};
	let text = 'no te cacho';
	let type = 'text'

	if(isText) {
		
		switch (data.toLowerCase()) {
			case 'hola':
				text = 'hola';
				break;
			case 'matate':
				text = 'matate tú';
				break;
			case 'tengo un problema':
				text = 'tranquilein john wein';
				break;
			case 'holi':
				text = 'holi tenis pololi?'
				break;
			case 'dame notas':
				text = 'todas las categorias';
				type = 'noticias';
				break;
		}

		payload = {
			text: text
		};
		
	}

	sendMessage(receptor, payload, type);
}

function sendMessage(user_psid, response, type) {
	let message = '';
	
	switch (type) {
		case 'text':			
			message = response;
			break;
		case 'noticias':
			message = {
				"attachment": {
					"type": "template",
					"payload": {
						"template_type": "generic",
						"elements": [
							{
								"title": "BBCL",
								"image_url": "http://placekitten.com/200/301",
								"subtitle": response,
								"default_action": {
									"type": "web_url",
									"url": "https://www.biobiochile.cl/noticias/sociedad/animales/2018/03/12/el-gato-mas-triste-de-internet-que-se-ha-vuelto-furor-en-las-redes.shtml",
									"messenger_extensions": false,
									"webview_height_ratio": "tall",
								},
								"buttons": [
									{
										"type": "web_url",
										"url": "https://www.biobiochile.cl",
										"title": "Ver el Sitio"
									}
								]
							}
						]
					}
				}
			};			
			break;
	}

	let request_body = {
		"recipient": {
			"id": user_psid
		},
		"message": message
	};

	request({
		"uri": conf.FB_MESSAGE_URL,
		"method": 'POST',
		"qs": {
			"access_token": conf.PROFILE_TOKEN
		},
		"json": request_body
	}, (err, res, body) => {
		if (!err) {
			console.log('mensaje enviado!');
		}else {
			console.error("no se envió el mensaje :c" + err);
		}
	});
}

