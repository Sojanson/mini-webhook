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

      if(entry.message && entry.message.text) {
      	messageHandler(entry);
      } else if (entry.postback) {
      	postbackHandler(entry);
      }

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

app.get('/categories', (req, res) => {
	request({
		"uri" : conf.BBCL_CATEGORIES_URL,
		"method": "GET",
		"json": true
	},(err, res, body) => {
		if (!err && res.statusCode == 200) {
			let bbcl = body[0].children;
			let catsObject = {};



			for (let categoria of bbcl) {
				if (conf.CATEGORIES.indexOf(categoria.slug) != -1) {
					let select = `SELECT slug FROM bot_categories WHERE slug = '${categoria.slug}'`;
					let sqlQuery = '';

					conf.MYSQL.query(select, function (err, result, fields){
						if (err) throw err;
						
						if (result.length > 0){
							sqlQuery = `UPDATE bot_categories SET id = '${categoria.id}', name = '${categoria.name}', slug = '${categoria.slug}'`;
							console.log(sqlQuery);
						}else {							
							sqlQuery = `ÌNSERT INTO bot_categories (id, name, slug) VALUES ('${categoria.id}', '${categoria.name}', '${categoria.slug}')`;
							console.log(sqlQuery);
						}
						conf.MYSQL.query(sqlQuery, function (err, result){
							if (err) throw err;
							console.log('1 categoria actualizada');
						});

					});					
				}
			}
		}
	})
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

function messageHandler(evento) {
	let sender = evento.sender.id;
	let recipient = evento.recipient.id;
	let message = evento.message.text;
	let text = '';
	let type = 'text';

	//console.log('El usuario %d envió el mensaje %s a la página %d', sender, message, recipient);

	if (message) {
		switch (message.toLowerCase()) {
			case 'hola':
				text = 'hola';
				sendTextMessage(sender, text, type);
				break;
			case 'matate':
				text = 'matate tú';
				sendTextMessage(sender, text, type);
				break;
			case 'tengo un problema':
				text = 'tranquilein john wein';
				sendTextMessage(sender, text, type);
				break;
			case 'holi':
				text = 'holi tenis pololi?';
				sendTextMessage(sender, text, type);
				break;
			case 'no te cacho':
				text = 'ta mala esta wea';
				sendTextMessage(sender, text, type);
				break;
			case 'categorias':
				sendCategoriasMessage(sender, "Estas son las categorías que puedes elegir para tu feed");
				break;
			case 'dame notas':
				text = 'todas las categorias';
				type = 'noticias';
				sendTextMessage(sender, text, type);
				break;
		}		
	}
}

function postbackHandler(evento) {
	let sender = evento.sender.id;
	let recipient = evento.recipient.id;
	let time = evento.timestamp;
	let payload = evento.postback.payload;

	console.log('Postback recibido de el usuario %d y pagina %d con el payload "%s" a las %d', sender, recipient, payload, time);

	switch (payload) {
		case 'get_started':
			sendGetStarted(sender, "Bienvenido al bot BBCL! ¿Quieres suscribirte para recibir noticias?");
			break;
		case 'daily':
		case 'realtime':
			subscribeUser(sender, payload);
			break;
		case 'nope':
			sendTextMessage(sender, "desactivado")
			break;
		case 'group-nacional':
		case 'group-internacional':
		case 'group-economia':
		case 'group-deportes':
		case 'group-ciencia-y-tecnologia':
		case 'group-sociedad':
		case 'group-artes-y-cultura':
		case 'group-espectaculos-y-tv':
		case 'group-vida-actual':
			subscribeToCategory(sender, payload);
			break;
		default:
			sendTextMessage(sender, "loco, ¡¡¿que hiciste?!! ", "text");
		break;

	}
}

function callSendApi(data) {
	request({
		"uri": conf.FB_MESSAGE_URL,
		"method": 'POST',
		"qs": {
			"access_token": conf.PROFILE_TOKEN
		},
		"json": data
	}, (err, res, body) => {
		if (!err && res.statusCode == 200) {
			let recipientId = body.recipient_id;
			let messageId = body.message_id;

			if (messageId) {
				console.log("Se envió exitosamente el mensaje con el id %s al receptor %s", messageId, recipientId);
			}else {
                console.log("Se estableció comunicación con la Api de envío exitosamente para el receptor %s", recipientId);
            }			
		}else {
			console.error("No se estableció la comunicación", res.statusCode, res.statusMessage, body.error);
		}
	});
}

function subscribeUser(user_psid, suscripcion) {		

	let select = `SELECT psid FROM bot_users WHERE psid = ${user_psid}`;
	let sqlQuery = '';
	let novo = true;

	conf.MYSQL.query(select, function (err, result, fields){
		if (err) throw err;
		if (result.length > 0){
			console.log('ya existe, actualizando');
			novo = false;			
		}else {
			console.log('a este weon no lo he visto ni en pelea de perros, será agregado');
			novo = true;
		}

		request({
			"uri": "https://graph.facebook.com/" + user_psid,
			"method": "GET",
			"qs": {
				"fields": "first_name,last_name,profile_pic",
				"access_token": conf.PROFILE_TOKEN
			},
			"json" : true
		}, (err, res, body) => {
			if (!err && res.statusCode == 200) {
				let name = body.first_name ? body.first_name : '';
				let last_name = body.last_name ? body.last_name : '';

				if (novo) {
					sqlQuery = `INSERT INTO bot_users (psid, name, last_name, subscription_type) VALUES( '${user_psid}', '${name}', '${last_name}', '${suscripcion}')`;
				}else {
					sqlQuery = `UPDATE bot_users SET name = '${name}', last_name = '${last_name}', subscription_type = '${suscripcion}' WHERE psid = '${user_psid}'`;
				}

				conf.MYSQL.query(sqlQuery, function (err, result){
					if (err) throw err;
					console.log('1 fila insertada');
					if (novo) {sendCategoriasMessage(user_psid);}
					else {sendTextMessage(user_psid, 'Tu subscripcion ha sido actualizada!', 'text')}
				});
				
			}else {
				return console.error("No hubo comunicación", res.statusCode, res.statusMessage, body.error);
			}
		});
		
	});	
}

function subscribeToCategory(user_psid, categoria) {
	let select = `SELECT psid FROM bot_users WHERE psid = ${user_psid}`;
	let sqlQuery = '';
	let novo = true;

	conf.MYSQL.query(select, function (err, result, fields){
		if (err) throw err;
		if (result.length > 0){
			let selCat = `SELECT psid FROM bot_user_category WHERE `

			conf.MYSQL.query()
		}else {
			sendTextMessage(user_psid, 'Aún no has seleccionado un tipo de suscripción', 'text');
			sendGetStarted(user_psid, 'Elige tu tipo de suscripción, para poder asignar categorías');
		}

	});
}

function getUserData(user_psid) {
	request({
		"uri": "https://graph.facebook.com/" + user_psid,
		"method": "GET",
		"qs": {
			"fields": "first_name,last_name,profile_pic",
			"access_token": conf.PROFILE_TOKEN
		},
		"json" : true
	}, (err, res, body) => {
		if (!err && res.statusCode == 200) {
			
			let last_name = user.last_name ? user.last_name : '';
		}else {
			return console.error("No hubo comunicación", res.statusCode, res.statusMessage, body.error);
		}
	});
}

function sendTextMessage(user_psid, response, type) {
	let message = '';
	
	switch (type) {
		case 'text':
			message = {
				"text": response,
				"metadata": "BBCL_METADATA"
			};
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
								"image_url": "https://media.biobiochile.cl/wp-content/uploads/2018/03/lanlan731.png",
								"subtitle": response,
								"default_action": {
									"type": "web_url",
									"url": "https://www.biobiochile.cl/noticias/sociedad/animales/2018/03/12/el-gato-mas-triste-de-internet-que-se-ha-vuelto-furor-en-las-redes.shtml",
									"messenger_extensions": false,
									"webview_height_ratio": "tall"
								}
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
	callSendApi(request_body);
}

function sendCategoriasMessage(user_psid, response) {

	let cats = [
		{
			"cats": [{
				"type": "postback",
				"title": "Nacional",
				"payload": "group-nacional"
			},
			{
				"type": "postback",
				"title": "Internacional",
				"payload": "group-internacional"
			},
			{
				"type": "postback",
				"title": "Economía",
				"payload": "group-economia"
			}]
		},
		{
			"cats": [{
				"type": "postback",
				"title": "Deportes",
				"payload": "group-deportes"
			},
			{
				"type": "postback",
				"title": "Ciencia y Tecnología",
				"payload": "group-ciencia-y-tecnologia"
			},
			{
				"type": "postback",
				"title": "Sociedad",
				"payload": "group-sociedad"
			}]
		},
		{
			"cats": [{
				"type": "postback",
				"title": "Artes y Cultura",
				"payload": "group-artes-y-cultura"
			},
			{
				"type": "postback",
				"title": "Espectáculos y TV",
				"payload": "group-espectaculos-y-tv"
			},
			{
				"type": "postback",
				"title": "Vida Actual",
				"payload": "group-vida"
			}]
		},
		{
			"cats": [{
				"type": "postback",
				"title": "Opinion",
				"payload": "group-opinion"
			}]
		}
	];

	let textMessage = {
		"recipient": {
			"id": user_psid
		},
		"message": {
			"text": response,
			"metadata": "BBCL_METADATA"
		}
	};

	callSendApi(textMessage);

	
	let message = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [
					{
						"title": "Categorias",
						"buttons": cats[0].cats
					},
					{	
						"title": "Categorias",
						"buttons": cats[1].cats
					},
					{
						"title": "Categorias",
						"buttons": cats[2].cats
					}
				]
				
			}
		}
	};

	let request_body = {
		"recipient": {
			"id": user_psid
		},
		"message": message
	};

	callSendApi(request_body);
}

function sendGetStarted(user_psid, response) {
	let message = '';
		
	message = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "button",
				"text": response,

				"buttons": [{
					"type": "postback",
					"title": "Recibir a diario",
					"payload": "daily"
				},
				{
					"type": "postback",
					"title": "Recibir al publicar ",
					"payload": "realtime"
				},
				{
					"type": "postback",
					"title": "No recibir",
					"payload": "nope"
				}]
			}
		}
	};

	let request_body = {
		"recipient": {
			"id": user_psid
		},
		"message": message
	};
	callSendApi(request_body);
}
