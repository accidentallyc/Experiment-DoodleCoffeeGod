var doodleCoffeeGod = require("DoodleCoffeeGod/DoodleCoffeeGod")
module.exports = {
  installScript: function (req, res) {
    doodleCoffeeGod.install()
    return res.send("The database entries have been re-added");
  },

  test: function(req,res){
    var Coffee = require("DoodleCoffeeGod/Coffee")
    Coffee.findById(1, function(coffee){
        return res.json(coffee)
    })
    
  },


  renderCoffeePage: function (req, res) {
    var Coffee = require("DoodleCoffeeGod/Coffee")
    var name = req.param('name')

    Coffee.findByName(name, function(coffee){
        var args = {
            coffee: coffee
        }
        console.log(coffee)
        return res.view('coffee_page',args)
    })  
  }
};