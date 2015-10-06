var installers = module.exports = {}
var db = require("./SqlLite").getInstance()
installers.table = function(){
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS item(id INTEGER PRIMARY KEY,name TEXT UNIQUE, thumb TEXT, discovery TEXT, type TEXT, requirements TEXT)")
		db.run("CREATE TABLE IF NOT EXISTS item_details(item_id INTEGER, img TEXT, descp TEXT)")
	})
}

installers.data = function(){
	var coffee = "coffee"
	var ingredient = "ingredient"

	var Item  = require("./Item")
	var async 	= require("async")
	var order	= []

	var coffee_beans 	= new Item("Coffee Beans",ingredient)
	coffee_beans.thumb	= "/images/coffee_beans_thumb.gif"
	coffee_beans.img	= "/images/coffee_beans.gif"
	coffee_beans.descp	= "asd"
	coffee_beans.discovery	= "Supposedly magical beans traded in for a mule."
	order.push( coffee_beans )

	var milk 	= new Item("Milk",ingredient)
	milk.thumb	= "/images/milk_thumb.gif"
	milk.img	= "/images/milk.gif"
	milk.descp	= "asd"
	milk.discovery	= "I wonder what the guy that discovered milk was doing with the cow."
	order.push( milk )

	var fire 	= new Item("fire", coffee)
	fire.thumb 	= "/images/fire_thumb.gif"
	fire.img 	= "/images/fire.gif"
	fire.descp	= "If you don't know what this is, you are probably a retard"
	fire.discovery = "WOW? HOW DID YOU GET FIRE FROM COFFEE BEANS AND MILK???"
	fire.addRequirement(coffee_beans)
	fire.addRequirement(milk)
	order.push( fire )

	var espresso 	= new Item("Espresso", coffee)
	espresso.thumb 	= "/images/espresso_thumb.gif"
	espresso.img 	= "/images/espresso.gif"
	espresso.descp	= "This is the intense experience of coffee that most Europeans prefer and believe Americans are too scared to try. Proper Espresso is served in small demitasse-style cups and consumed promptly after extraction."
	espresso.discovery = "Go ahead, chug it all down, i dare ya!"
	espresso.addRequirement(coffee_beans)
	espresso.addRequirement(coffee_beans)
	order.push( espresso )

	var dopio	= new Item("Dopio", coffee)
	dopio.thumb	= "/images/dopio_thumb.gif"
	dopio.img	= "/images/dopio.gif"
	dopio.descp = "Doppio in espresso is a double shot, extracted using a double coffee filter in the portafilter.This results in 60 ml of drink, double the amount of a single shot espresso. More commonly called a standard double, it is a standard in judging the espresso quality in barista competitions. Doppio is Italian multiplier, meaning 'double'."
	dopio.discovery = "Double the coffee, double the fun"
	dopio.addRequirement(espresso)
	dopio.addRequirement(espresso)
	order.push( dopio )

	var mocchiato = new Item("Mocchiato", coffee)
	mocchiato.thumb	= "/images/mocchiato_thumb.gif"
	mocchiato.img	= "/images/mocchiato.gif"
	mocchiato.descp = "Caffè macchiato, sometimes called espresso macchiato, is an espresso coffee drink with a small amount of milk added, today usually foamed milk."
	mocchiato.discovery = "Macchiato comes from the Italian word that means `stained`"
	mocchiato.addRequirement(dopio)
	mocchiato.addRequirement(milk)
	order.push( mocchiato )

	var cappucino = new Item("Cappucino", coffee)
	cappucino.thumb	= "/images/cappucino_thumb.gif"
	cappucino.img	= "/images/cappucino.gif"
	cappucino.descp = "A cappuccino is an Italian coffee drink which is traditionally prepared with espresso, hot milk and steamed milk foam. Cream may be used instead of milk and is often topped with cinnamon."
	cappucino.discovery = "What if the cappuccino you had this morning was not, in fact, a cappuccino?"
	cappucino.addRequirement(espresso)
	cappucino.addRequirement(milk)
	order.push( cappucino )

	var cafe_creme = new Item("Cafe Creme", coffee)
	cafe_creme.thumb	= "/images/cafe_creme_thumb.gif"
	cafe_creme.img		= "/images/cafe_creme.gif"
	cafe_creme.descp 	= "Coffee from france, generally it is an espresso made with steamed milk."
	cafe_creme.discovery = "Ooh la la, French."
	cafe_creme.addRequirement(mocchiato)
	cafe_creme.addRequirement(milk)
	order.push( cafe_creme )

	var dry_cappucino = new Item("dry_cappucino", coffee)
	dry_cappucino.thumb	= "/images/dry_cappucino_thumb.gif"
	dry_cappucino.img	= "/images/dry_cappucino.gif"
	dry_cappucino.descp = "A cappuccino that has less steamed milk and more frothed milk."
	dry_cappucino.discovery = "What if the cappuccino you had this morning was not, in fact, a cappuccino?"
	dry_cappucino.addRequirement(cappucino)
	dry_cappucino.addRequirement(fire)
	order.push( dry_cappucino )

	for( var x = 0; x<order.length;x++){
		!function(){
			var node = order[x]
			order[x] = function(callback){
				node.save(callback)
			}
		}()
	}



	async.series( order )
}