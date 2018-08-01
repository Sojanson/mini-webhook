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
	'group-vida-actual'
];

let conf = module.exports = {
	MYSQL: con,
	BBCL_CATEGORIES_URL: 'http://prensa.radiobiobio.cl/wp-content/plugins/bbcl/components/Categorias/static/categories.json',
    FB_MESSAGE_URL: 'https://graph.facebook.com/v2.6/me/messages',
    CATEGORIES: allowedCategories,
    VERIFY_TOKEN: 'dc90fb411580163dba492968d4991099',
    PROFILE_TOKEN: 'EAAPiXLBhCsABAIH93OXCfbtHZCVUBxwZCnflDpZAUZCDCHm6SKb9b5aWOHn1BhzV5ohT1SCmlap26D0GNKjBIsGYzRilEBZAX0DOqZCqczz98qTz9be6CVnpBCagiTtqXrPZB2vWQme2OhrCp3XtEoIYqvZAbmzA6J2lviLe4KDAUAZDZD',
    PORT: '5000'
};