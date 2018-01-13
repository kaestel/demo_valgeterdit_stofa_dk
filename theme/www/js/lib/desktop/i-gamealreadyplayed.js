Util.Objects["GameAlreadyPlayed"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node) {
//		u.bug("GameAlreadyPlayed.init:" + u.nodeId(node));

		node.game_already_played = u.createPIXIApp({"classname":"game_already_played", "height":900});
		node.game_already_played.node = node;
		node.appendChild(node.game_already_played.renderer.view);

		// Load asses
		node.game_already_played.loadQueue = [
			"btn_hitarea.png",
			"txt_already_played.png",
			"btn_se_naeste_uges_praemie.png",
			"btn_se_naeste_uges_praemie_rollover.png",
		];


		// Will be invoked when assets have loaded
		node.game_already_played.ready = function() {
//			u.bug("node.game_already_played.ready");


			this.addBtn = function(){

				this.btnContainer = new PIXI.Container();
				this.screenContainer.addChild(this.btnContainer);
				this.btnContainer.pivot.set(this.assets.btn_se_naeste_uges_praemie.width/2,(this.assets.btn_se_naeste_uges_praemie.height/2)-16);
				this.btnContainer.x = this.renderer.width/2;
				this.btnContainer.y = 230 + this.stageHeightDiff;
				this.screenContainer.addChild(this.btnContainer);
				this.btnContainer.addChild(this.assets.btn_se_naeste_uges_praemie);
				this.btnContainer.addChild(this.assets.btn_se_naeste_uges_praemie_rollover);
				this.assets.btn_se_naeste_uges_praemie_rollover.alpha = 0;
				this.btnContainer.addChild(this.assets.btn_hitarea);
				this.assets.btn_hitarea.x = 35;
				this.assets.btn_hitarea.y = 30;
				this.assets.btn_hitarea.alpha = 0.001;
				this.btnContainer.alpha = 0;

			}
	
			this.btnIn = function(){
				var tSpeed = .3;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){

				page.playEventSound();

				page.openPrizes(this.node.scene.current_round_index+1);

				// var tSpeed = .2;
				// Tween.to(this.assets.txt_already_played,tSpeed,{alpha:0, ease:Quad.easeIn});
				// Tween.to(this.btnContainer,tSpeed,{alpha:0, ease:Quad.easeIn});
				// this.assets.btn_hitarea.interactive = false;
			}
			this.onBtnOut = function(){
//				console.log("Knap og tekst er ude");
			}
	

			this.setupInteractionEvents = function(){
				this.assets.btn_hitarea.interactive = true;
				this.assets.btn_hitarea.buttonMode = true;
				this.assets.btn_hitarea.on('click', this.btnOut.bind(this));
				this.assets.btn_hitarea.on('mouseover', this.onMouseOver.bind(this));
				this.assets.btn_hitarea.on('mouseout', this.onMouseOut.bind(this));
			}
			this.onMouseOver = function(){
				var tSpeed = 0.15;
				Tween.to(this.assets.btn_se_naeste_uges_praemie_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
			}
			this.onMouseOut = function(){
				var tSpeed = 0.15;
				Tween.to(this.assets.btn_se_naeste_uges_praemie_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
			}


			this.screenEnterFromTop = function(){
				var tSpeed = 3;
				Tween.to(this.screenContainer,tSpeed,{y:this.startY, ease:Elastic.easeOut.config(0.2)});

				Tween.fromTo(this.assets.txt_already_played,0.5,{alpha:0},{delay:1.2, alpha:1});
				Tween.delayedCall(1.4,this.btnIn.bind(this))

			}


			this.stageHeightDiff = 200;
		
			this.screenContainer = new PIXI.Container();
			this.stage.addChild(this.screenContainer);
			this.startY = this.stageHeightDiff;

			this.screenContainer.x = (this.renderer.width/2)-(1024/2);
			this.screenContainer.y = -600;


			this.assets.txt_already_played.alpha = 0;
			//this.screenIn();

			this.screenContainer.addChild(this.assets.txt_already_played);
			this.assets.txt_already_played.x = (this.renderer.width/2)-(this.assets.txt_already_played.width/2);
			this.assets.txt_already_played.y = 220;

			this.addBtn();


			this.is_ready = true;

			// Let scene know we are ready to start playback
			page.cN.scene.build();
//			this.build();

		}


		node.game_already_played.build = function() {
//			u.bug("node.game_already_played.build");

			page.showJan("already_played");

			this.screenEnterFromTop();


		}


		node.game_already_played._destroy = function() {
//			u.bug("node.game_already_played.destroy:" + onto);

			page.hideJan(true);

			this.destroy(true);
			this.node.game_already_played = false;

		}

		// start loading assets
		u.loadAssets(node.game_already_played);

	}


	// // starts canvas playback
	this.build = function(node) {
		u.bug("GameAlreadyPlayed.build");

		node.game_already_played.build();

	}

}
