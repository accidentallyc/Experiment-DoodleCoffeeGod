var root = module.exports = {}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.sqlite3');
var statements_sql = {}

root.getInstance = function (){ return db }
root.getStatement = function(name){
	if( name in statements_sql ){
		if( typeof statements_sql[ name ] === "string" )
			statements_sql[ name ] = db.prepare( statements_sql[name] )
		return statements_sql[name]
	} else{
		throw "Unknown prepared statement `" + name + "` requested"
	}
}


var temp = statements_sql
var p	 = db.prepare
temp.findItemById	 		= "SELECT id,name,thumb,discovery,requirements FROM item WHERE id = :ID and type = :type"
temp.findItemByName			= "SELECT id,name,thumb,discovery,requirements FROM item WHERE name = :name AND type = :type"
temp.findFullItemByName		= "SELECT id,name,thumb,discovery,requirements, img, descp FROM item LEFT JOIN item_details ON item.id = item_details.item_id WHERE item.name = :name"
temp.findFullItemById		= "SELECT id,name,thumb,discovery,requirements, img, descp FROM item LEFT JOIN item_details ON item.id = item_details.item_id WHERE item.id = :id"
temp.findByRequirements		= "SELECT id,name,thumb,discovery,requirements FROM item WHERE requirements = :requirements"
temp.saveItem				= "INSERT INTO item(name,thumb,discovery,type,requirements) VALUES (:name,:thumb,:discovery,:type,:requirements)"
temp.saveItemDetails		= "INSERT INTO item_details VALUES (:item_id,:img,:descp)"



