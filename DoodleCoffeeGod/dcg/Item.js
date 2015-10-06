module.exports = Item
var SqlLite = require("./SqlLite")
function Item(name,type){
	var requirements = []
	this.id 		= null
	this.name 		= name
	this.descp		= null
	this.thumb		= null	
	this.img		= null
	this.addRequirement = function(a){ requirements.push(a) }
	this.getRequirements = function(){ return requirements }

	this.getCleanName	= function(){ return this.name.replace(" ","_").toLowerCase() }
	this.getCleanRequirements = function(){ return getCleanRequirements(requirements) }
	this.findByName	= findByName
	this.save 		= save


	function save(callback){
		var wrapped_callback = wrap_with_error_log( callback )
		var db 		= SqlLite.getInstance()
		var sql 	= SqlLite.getStatement("saveItem")
		var args	= {
			":name" : this.getCleanName(),
			":thumb": this.thumb,
			":discovery": this.discovery,
			":type": type,
			":requirements" : this.getCleanRequirements()
		}

		var that = this
		
		db.serialize( function(){
			var chained_callback = function(){
				that.id = this.lastID
				
				var sql2 	= SqlLite.getStatement("saveItemDetails")
				var args2	= {
					":item_id" : that.id,
					":img": that.img,
					":descp": that.descp
				}

				sql2.run(args2,wrapped_callback)
			}
			sql.run(args,chained_callback)	
		})
	}
}

function wrap_with_error_log(callback,isGet){
	return function(err,row){
		if( err )
			console.warn(err)
		else {
			if( callback )callback()
		}
	}
}

function wrap_and_get(callback){
	return function(err,row){
		if( err )
			console.warn(err)
		else if (row.length == 0){
			throw Error("No results found")
		}
		else{
			var coffee = sql_to_instance( row )
			if( callback) callback( coffee )
		}
	}
}

function wrap_and_get_multi(callback){
	return function(err,rows){
		var items = []
		if( err ){
			console.warn(err)
		}
		else{
			for( var x=0; x<rows.length;x++){
				items.push( sql_to_instance(rows[x]) )
			}
		}
		if( callback ) callback(items)
	}
}

function sql_to_instance(row){
	var coffee = new Item
	coffee.id 		= row['id']
	coffee.name 	= row['name'].replace("_"," ")
	coffee.descp	= row['descp']
	coffee.thumb	= row['thumb']
	coffee.img		= row['img']
	coffee.discovery = row['discovery']
	coffee.requirements = row['requirements']

	return coffee
}

Item.findById		= findById
Item.findByName 	= findByName
Item.findByRequirements = findByRequirements

function findById(getDetails){
	throw Error("This function is empty")
}

function findByName(getDetails,callback,isFull){
	var wrapped_callback = wrap_and_get( callback )
	var db 		= SqlLite.getInstance()
	var sql 	= SqlLite.getStatement( isFull ? "findFullItemByName" : "findItemByName")
	var args	= {
		":name" : getDetails,
	}
	db.serialize( function(){
		sql.get(args,wrapped_callback)	
	})
}

function findByRequirements(requirements,callback){
	var wrapped_callback = wrap_and_get_multi( callback )
	var db 		= SqlLite.getInstance()
	var sql 	= SqlLite.getStatement( "findByRequirements")
	var args	= {
		":requirements" : getCleanRequirements( requirements ),
	}

	db.serialize( function(){
		sql.all(args,wrapped_callback)	
	})
}

function getCleanRequirements (reqs){
	var result = ""
	var new_array = []

	for( var x=0; x < reqs.length; x++ ){
		var node = reqs[x]

		if( typeof node === "object" && node.constructor.name === "Item"){
			new_array.push( node.id )
		} else {
			new_array.push( parseInt(node) )
		}
	}

	return result + new_array.sort().join("_")
}




