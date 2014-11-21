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

casper.start('http://www.almanac.com/plants/type/vegetable'); 

//give page time to load, then click object link
casper.wait(3000, function () {
	//this.click('.field-content a');
	var type_selector = '.views-field-title a[href*="plant"]';
	var type_info = this.getElementsInfo(type_selector);
	var types = [];
	for (var i = 0; i < type_info.length; i++) {
    	types.push('http://www.almanac.com' + type_info[i].attributes.href);
    }
    utils.dump(types);

});

//test url opened by object link
casper.then(function() {
    this.echo('clicked link, new location is ' + this.getCurrentUrl());
});

//grab data from object profile page
casper.then(function() {

    //name
    var name = this.fetchText('h1');
    //create an array of the zones
    var zone_selector = 'a[href*="hardiness-zone"]';  
    var zone_info = this.getElementsInfo(zone_selector);
    var zones = [];
    for (var i = 0; i < zone_info.length; i++) {
    	zones.push(zone_info[i].text);
    	/* var zone = parseInt(zone_info[i].text);
    	zones.push(zone); */ //use this for numeric values in array
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
    var vegetable = new Item (name, zones, sun_type, soil_type, ph, instructions);
    utils.dump(vegetable);
});

casper.then(function () {
	this.back();
});

casper.then(function () {
	casper.exit();
});

casper.run();

