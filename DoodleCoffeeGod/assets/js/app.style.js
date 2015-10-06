!function(){

$(window).load( function(){
	$(document.body).removeClass("preLoad");
});

var IS_TRANSMUTING = false

$(document).ready( function(){
	var container_selector = ".ingredient-container"
	init_containers( container_selector )
	$.blockUI.defaults.css.cursor = "pointer"
})


function init_containers(selector){
	var containers 	= $(selector)

	//Init Ingredients
	containers.each( function(){
		var $parent = $(this)
		var target 	= $parent.attr("data-target")
			$parent
				.find(".ingredient")
				.each( function(){
					$(this).attr("data-target",target)
				})
	})

	function init_ingredient($dom,$parent){
		var target 	= $parent.attr("data-target")
			$dom.attr("data-target",target)
	}
	
	containers.on("click",".ingredient", function(e){
		if( IS_TRANSMUTING ) return
		var $parent = $(e.delegateTarget)
		var $this 	= $(this)
		var src 	= $this.find("img:first").attr("src")
		
		//Set the new currents
		var curr = $parent.data("current-ingredient")
		if( curr ) curr.removeClass("current")
		
		$this.addClass("current")
		$parent.data("current-ingredient",$this)

		//Add to the couldron
		var couldron_id = $this.attr("data-target")
		var couldron = $(couldron_id)
		couldron.find("img:first").attr("src",src)
		couldron
			.addClass("has-ingredient")
			.attr("data-id", $this.attr("data-id"))

		//Check couldrons
		if( all_couldrons_filled() ){
			transmute()
		}
	})

	function all_couldrons_filled(){
		return $(".has-ingredient").length === containers.length 
	}

	function transmute(){
		$("#result-couldron").addClass("isLoading")

		var ingredients = $(".has-ingredient")			
		var requirement_string 
			= ingredients
				.toArray()
				.map( transmute_map_func )	//convert to numbers
				.sort()

		var data = { "requirements": requirement_string }

		IS_TRANSMUTING = true
		$.post("/canvas/check", data,function(m){
			IS_TRANSMUTING = false
			if( m.items.length ){
				YOU_FOUND_SOMETHING(m)
			} else{
				$.blockUI({
				message: "you found <u>nothing</u>",
				onOverlayClick: function(){
					clear_couldrons( $(".has-ingredient")	)
					$.unblockUI()
				}
			})
			}
		})
	}

	function transmute_map_func(elem){
		return elem.getAttribute("data-id")
	}

	function clear_couldrons(elems){
		elems.each( function(){
			$(this)
				.removeClass("has-ingredient")
				.find("img:first")
				.attr("src","/images/no_ingredient_thumb.gif")
		})

		$(".current").removeClass("current")
	}

	var block_queue
	function YOU_FOUND_SOMETHING(response){
		block_queue = []
		$.each(response.items, function(index,node){
			containers.each( function(){
				var $this = $(this)
				var temp = new_ingredient(node)
				//Don't add if already in the canvas
				if( $this.find("#item_"+node.id).length == 0){
					init_ingredient(temp, $this)
					$(this).append( temp )
				}
			})
			block_queue.push( new_block_queue(node) )
		})
		run_next_block_queue()
		
	}
	
	function run_next_block_queue(){
		if( block_queue.length ){
			block_queue.shift()()
		} else{
			clear_couldrons( $(".has-ingredient")	)
		}
	}
	
	function new_block_queue(node){
		var $div = $(document.createElement("div"))
		var $img = $(document.createElement("img"))
		var $h	= $(document.createElement("h2"))
		var $label = $(document.createElement("label"))
		var $a = $(document.createElement('a'))	

		$div.addClass("discovery")
			.append($h)
			.append($img)
			.append("<Br/>")
			.append($label)
			.append($a)
			.css("text-align","center")

		$a
			.html("learn more")
			.attr("target","_blank")
			.attr("href", "/item/" + node.name.replace(" ","_").toLowerCase())

		
		$label.html( node.discovery )
		$img.addClass("ingredient")
			.attr("src", node.thumb )
			
		$h.html( "You have discovered " +node.name)

		$("#result-couldron").removeClass("isLoading")
		return function(){
			$.blockUI({
				message: $div ,
				onOverlayClick: function(){
					$.unblockUI()
					run_next_block_queue()
				}
			})
		}
	}

	function new_ingredient(obj){
		var $div = $(document.createElement("div"))
		var $img = $(document.createElement("img"))

		$div.append($img)
		$div.addClass("ingredient")
		$div.attr("id","item_" + obj.id)
		$div.attr("data-id", obj.id)
		$div.attr("data-name",obj.name)
		$img.attr("src",obj.thumb)

		return $div
	}
	
	
}



}();