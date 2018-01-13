Util.Objects["BtnSubmit"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node) {
//		u.bug("BtnSubmit.init:" + u.nodeId(node));

		node.btn_submit = u.createPIXIApp({"classname":"btn_submit", "height":185, "width":626});
		node.btn_submit.node = node;
		node.appendChild(node.btn_submit.renderer.view);

		// Load asses
		node.btn_submit.loadQueue = [
			"btn_deltag.png",
			"btn_deltag_rollover.png",

			"btn_hitarea.png",
		];


		// Will be invoked when assets have loaded
		node.btn_submit.ready = function() {
//			u.bug("node.btn_submit.ready");


			this.addBtn = function(){
				this.btnContainer.addChild(this.assets.btn_deltag);

				this.btnContainer.addChild(this.assets.btn_deltag_rollover);
				this.assets.btn_deltag_rollover.alpha = 0;

				this.btnContainer.addChild(this.assets.btn_hitarea);
				this.assets.btn_hitarea.x = 47;
				this.assets.btn_hitarea.y = 31;
				this.assets.btn_hitarea.alpha = 0.001;
			}
	
			this.btnIn = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, delay: 0.8, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:0, ease:Quad.easeOut, onComplete:this.onBtnOut.bind(this)});
				this.assets.btn_hitarea.interactive = false;
			}
			this.onBtnOut = function(){
//				console.log("Knap og tekst er ude");
			}
	

			this.setupInteractionEvents = function(){
				// this.assets.btn_hitarea.interactive = true;
				// this.assets.btn_hitarea.buttonMode = true;
				// 		        this.assets.btn_hitarea.on('click', this.onClicked.bind(this));
				// 		        this.assets.btn_hitarea.on('mouseover', this.onMouseOver.bind(this));
				// 		        this.assets.btn_hitarea.on('mouseout', this.onMouseOut.bind(this));
			}
			this.onMouseOver = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_deltag_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
				}
			}
			this.onMouseOut = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_deltag_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
				}
			}
			// this.onClicked = function() {
			// 	console.log("clicked");
			//
			// 	this.node.game_receipt.destroy("continue");
			//
			// }

			this.setbtnToActive = function(){
				var tSpeed = 0.3;
				if(!this.btnBtnIsActive){
					this.btnBtnIsActive = true;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:-18, ease:Quad.easeInOut});
				} else {
					this.btnBtnIsActive = false;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:0, ease:Quad.easeInOut});
				}
		
			}


			this.stageHeightDiff = 0;
		
			this.btnContainer = new PIXI.Container();
			this.stage.addChild(this.btnContainer);
			this.btnContainer.alpha = 0;
			this.addBtn();



			this.is_ready = true;

			this.node.game_signup.readyCheck();

			// Let scene know we are ready to start playback
//			page.cN.scene.build();
//			this.build();

		}


		node.btn_submit.build = function() {
//			u.bug("node.btn_submit.build");

			if(!this.node.btn_submit) {
				u.ac(this.renderer.view, "single");
			}

			this.btnIn();


		}


		node.btn_submit._destroy = function() {
//			u.bug("node.btn_submit.destroy");

			this.destroyed = function() {

				this.destroy(true);
				delete this.node.btn_signup_confirm;

			}

			this.btnOut();

			u.t.setTimer(this, "destroyed", 200);

		}

		// start loading assets
		u.loadAssets(node.btn_submit);

	}


	// // starts canvas playback
	this.build = function(node) {
//		u.bug("BtnSubmit.build");

		node.btn_submit.build();

	}

}
