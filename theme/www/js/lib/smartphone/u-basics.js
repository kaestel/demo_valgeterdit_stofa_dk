u.createPIXIApp = function(_options) {

	var width = 640;
	var height = 920;
	var classname = u.randomString(5);
	var webgl = false;

	// Apply parameters
	if (typeof (_options) == "object") {
		var _argument;
		for (_argument in _options) {
			switch (_argument) {
				case "width": width = _options[_argument]; break;
				case "height": height = _options[_argument]; break;

				case "webgl": webgl = _options[_argument]; break;

				case "classname": classname = _options[_argument]; break;
			}
		}
	}

	var app = new PIXI.Application(width, height, {antialias: false, transparent: true}, !webgl);


	// disable default touch event handling in PIXI
	app.renderer.plugins.interaction.autoPreventDefault = false;

	// add classname to canvas
	u.ac(app.renderer.view, classname);

	return app;
}


u.loadAssets = function(app, _options) {

	var assets_prefix = "/img/assets/smartphone";

	// Apply parameters
	if (typeof (_options) == "object") {
		var _argument;
		for (_argument in _options) {
			switch (_argument) {
				case "assets_prefix": assets_prefix = _options[_argument]; break;
			}
		}
	}


	if(app.loadQueue && app.loadQueue.length) {

		var loader    = new PIXI.loaders.Loader(assets_prefix);

		var i, asset;
		for(i = 0; asset = app.loadQueue[i]; i++) {
			loader.add(asset);
		}

		loader.load(u._assetsLoaded.bind(app));
//		console.log("loading");

	}
	else {

		app.ready();
//		console.log("loaded already");

	}
	
	
}

// will be executed on node
u._assetsLoaded = function(loader, resources) {

	// console.log("assetsloaded")
	// console.log(this);

	// Convert downloaded resources into sprites
	var finalAssets = {};

	for (var key in resources) {
		// skip loop if the property is from prototype
		if ( ! resources.hasOwnProperty(key)) {
			continue;
		}

		var resource = resources[key];
		// remove path
		if(key.match(/\//)) {
			key = key.replace(/.+\//, "");
		}
		// remove extension
		if(key.indexOf('.') != -1) {
			key = key.split('.')[0];
		}

		finalAssets[key] = new PIXI.Sprite(resource.texture);
	}


	// Set the assets for the main banner
	this.assets = finalAssets;

	this.ready();
}



