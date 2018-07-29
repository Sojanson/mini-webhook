let mysql = require('mysql');
let con = mysql.createConnection({
	host : "localhost",
	user : "fbBot",
	password : "54321fbBot"
});

let conf = module.exports = {
	MYSQL: con,
    FB_MESSAGE_URL: 'https://graph.facebook.com/v2.6/me/messages',
    VERIFY_TOKEN: 'dc90fb411580163dba492968d4991099',
    PROFILE_TOKEN: 'EAAPiXLBhCsABAIH93OXCfbtHZCVUBxwZCnflDpZAUZCDCHm6SKb9b5aWOHn1BhzV5ohT1SCmlap26D0GNKjBIsGYzRilEBZAX0DOqZCqczz98qTz9be6CVnpBCagiTtqXrPZB2vWQme2OhrCp3XtEoIYqvZAbmzA6J2lviLe4KDAUAZDZD',
    PORT: '5000'
};