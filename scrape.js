var utils = require('utils');
var casper = require('casper').create({
	verbose: true,
    logLevel: 'error',
    pageSettings: {
    loadImages: false,
    loadPlugins: false
  }
});

//Object
function Item (name, zones, sun_type, soil_type, ph, instructions) {
    	this.name = name;
    	this.zones = zones;
    	this.sun_type = sun_type;
    	this.soil_type = soil_type;
    	this.ph = ph;
    	this.instructions = instructions;
}

 var links = [
 'http://www.almanac.com/plants/type/vegetable',
 'http://www.almanac.com/plants/type/plant',
 'http://www.almanac.com/plants/type/herb'
 ];

 casper.start().each(links, function(self, link) {
    self.thenOpen(link, function() {
        casper.wait (3000, function() {       
            //grab URLs for each vegetable profile page listed
        	var type_selector = '.views-field-title a[href*="plant"]';
        	var type_info = this.getElementsInfo(type_selector);
        	var types = [];
        	for (var i = 0; i < type_info.length; i++) {
            	types.push('http://www.almanac.com' + type_info[i].attributes.href);
            }
            //utils.dump(types);

            //open each link in array, then grab data and store in a new Item
            casper.start().each(types, function(self, link) {
                self.thenOpen(link, function() {
                     //name
                    var name = this.fetchText('h1');
                    //create an array of the zones
                    var zone_selector = 'a[href*="hardiness-zone"]';  
                    var zone_info = this.getElementsInfo(zone_selector);
                    var zones = [];
                    for (var i = 0; i < zone_info.length; i++) {
                        //change zones text to integers in the array
                        var zone = parseInt(zone_info[i].text);
                        zones.push(zone);
                    }
                    //sun and soil info
                    var sun_type = this.fetchText('a[href*="sun"]');
                    var soil_type = this.fetchText('a[href^="/plants/soil/"]');
                    var ph = this.fetchText('a[href*="soilph"]');
                    //select planting info
                    var instr_selector = '#article-body > h2:first-of-type + p + ul > li';
                    var instr_info = this.getElementsInfo(instr_selector);
                    var instructions = [];
                    for (var i = 0; i < instr_info.length; i++) {
                        instructions.push(instr_info[i].text);
                    }

                    //create new vegetable
                    var plant = new Item (name, zones, sun_type, soil_type, ph, instructions);
                    utils.dump(plant);
                    return (plant);
                }); //end main script body
            });//end types iterations
        });//end profile URL loop
    });//end links iterations
});//end page URL loop

casper.then(function () {
	casper.exit();
});

casper.run();

