Util.Objects["GameScreen"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node) {
//		u.bug("GameScreen.init");

		node.game_screen = u.createPIXIApp({"classname":"game_screen", "height":900});
		node.game_screen.node = node;
		node.appendChild(node.game_screen.renderer.view);

		// Load asses
		node.game_screen.loadQueue = [
			"screen.png",
			"screen_glow.png",
			"screen_tile.jpg",
		];


		// Will be invoked when assets have loaded
		node.game_screen.ready = function() {
//			u.bug("node.game_screen.ready");


			this.stageHeightDiff = 200;


			this.setHeader = function(round) {

				if(this.header_asset) {
					this.screenContainer.removeChild(this.header_asset);
					delete this.header_asset;
				}

				if(round !== false) {
					var texture = PIXI.Texture.fromImage('/img/assets/desktop/' + round + '.png');
					this.header_asset = new PIXI.Sprite(texture);

					this.screenContainer.addChild(this.header_asset);

					this.header_asset.x = (this.renderer.width/2)-(210/2);
					this.header_asset.y = 100;
				}

			}


			// Start building stage
			this.screenContainer = new PIXI.Container();
			this.stage.addChild(this.screenContainer);
			this.screenContainer.x = (this.renderer.width/2)-(this.assets.screen.width/2);
			this.screenContainer.y = this.assets.screen.height*-1;
			this.screenContainer.addChild(this.assets.screen_glow);
			this.assets.screen_glow.alpha = 0.2;
			this.screenContainer.addChild(this.assets.screen);
			this.startY = this.stageHeightDiff;


			// if round is selected, show round header
			// if(this.node.scene.current_round_index !== false) {
			// 	this.setHeader(this.node.scene.current_round_index);
			// }


			this.is_ready = true;

			// Let scene know we are ready to start playback
			page.cN.scene.build();

		}


		// Will be invoked from scene controller when it's time to start (scene could be waiting for other canvases)
		node.game_screen.build = function() {
//			u.bug("node.game_screen.build");

			var tSpeed = 3;
			Tween.to(this.screenContainer,tSpeed,{y:this.startY, ease:Elastic.easeOut.config(0.2)});

			this.is_built = true;
		}


		// avoid name conflict with pixi object
		node.game_screen._destroy = function() {
//			u.bug("node.game_screen.destroy");

			this.destroy(true);
			delete this.node.game_screen

			// // destroy scene
			// page.cN.scene.destroy();

		}


		// start loading assets
		u.loadAssets(node.game_screen);

	}


	// starts canvas playback
	this.build = function(node) {
//		u.bug("GameScreen.build");

		node.game_screen.build();

	}

}
