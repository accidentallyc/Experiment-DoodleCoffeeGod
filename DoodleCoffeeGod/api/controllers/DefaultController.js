
var DCG_PATH = "../../dcg/"
module.exports = {
  installScript: function (req, res) {
    var what = req.param('what')
    var installer = require(DCG_PATH + "Installer")
    if( what in installer ){
        installer[ what ]() 
        res.send("The database entries have been re-added"); 
    } else{
        res.send("What are you trying to do?");
    }
  },

  renderItemPage: function (req, res) {
    var Item = require(DCG_PATH + "Item")
    var name = req.param('name')

    var getAllDetails = true
    Item.findByName(name, function(item){
        var args = {
            item: item
        }
        console.log(args)
        
        return res.view('item_details',args)
    },getAllDetails)  
  },
  
  renderCanvasPage: function(req,res){
    var Item = require(DCG_PATH + "Item")
    var requirements = []
    Item.findByRequirements(requirements, function(items){
      var args = {
        items:items
      }

      return res.view('app',args)
    })
  },

  findByRequirements: function(req,res){
    var Item = require(DCG_PATH + "Item")
    var requirements = req.param("requirements")
    Item.findByRequirements(requirements, function(items){
      var args = {
        items:items
      }
      
      return res.json(args)
    })
  }
}