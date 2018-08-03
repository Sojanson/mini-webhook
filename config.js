let mysql = require('mysql');

let con = mysql.createConnection({
	host : "localhost",
	user : "fbBot",
	password : "54321fbBot",
	database: "messenger-bot-db"
});

let allowedCategories = [
	'group-nacional',
	'group-internacional',
	'group-economia',
	'group-deportes',
	'group-ciencia-y-tecnologia',
	'group-sociedad',
	'group-artes-y-cultura',
	'group-espectaculos-y-tv',
	'group-vida-actual',
	'group-opinion'
];

let conf = module.exports = {
	MYSQL: con,
	BBCL_CATEGORIES_URL: 'http://prensa.radiobiobio.cl/wp-content/plugins/bbcl/components/Categorias/static/categories.json',
    FB_MESSAGE_URL: 'https://graph.facebook.com/v2.6/me/messages',
    CATEGORIES: allowedCategories,
    VERIFY_TOKEN: '9ec8a1920f643dd17f3dbdf7bb8a6243',
    PROFILE_TOKEN: 'EAADhJpR6K7UBANiZCA31H0dhgrrQl1LZC6imRBwTfueqrb0Ucm4vZAsGgpxYR7pc0FqEDDkDuBkeATMT4hffWAi5ihsbPWq13Jt8OHxJpT1Gv0Gg8D7ZAVVsaa3dj7bcNoTabernBFrxkACZAbUryLOY1fU1b3wYxOKofVzocuAZDZD',
    PORT: '5000'
};