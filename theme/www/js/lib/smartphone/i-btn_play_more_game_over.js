Util.Objects["BtnPlayMoreGameOver"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node) {
//		u.bug("BtnPlayMoreGameOver.init:" + u.nodeId(node));

		node.btn_play_more = u.createPIXIApp({"classname":"btn_play_more", "height":185, "width":626});
		node.btn_play_more.node = node;
		node.appendChild(node.btn_play_more.renderer.view);

		// Load asses
		node.btn_play_more.loadQueue = [
			"btn_svar_paa_flere_spoergsmaal.png",
			"btn_svar_paa_flere_spoergsmaal_rollover.png",

			"btn_hitarea.png",
//			"categories_header_"+node.scene.current_round_index+".png",
		];


		// Will be invoked when assets have loaded
		node.btn_play_more.ready = function() {
//			u.bug("node.btn_play_more.ready");


			this.addBtn = function(){
				this.btnContainer.addChild(this.assets.btn_svar_paa_flere_spoergsmaal);

				this.btnContainer.addChild(this.assets.btn_svar_paa_flere_spoergsmaal_rollover);
				this.assets.btn_svar_paa_flere_spoergsmaal_rollover.alpha = 0;

				this.btnContainer.addChild(this.assets.btn_hitarea);
		        this.assets.btn_hitarea.x = 47;
		        this.assets.btn_hitarea.y = 31;
		        this.assets.btn_hitarea.alpha = 0.001;
			}
	
			this.btnIn = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){
				var tSpeed = .2;

				this.assets.btn_svar_paa_flere_spoergsmaal_rollover.alpha = 1;
				TweenLite.fromTo(this.btnContainer, .3, {alpha:1},{
					delay:.1,
		            alpha: 1,
		            ease: RoughEase.ease.config({
		                template: Power0.easeNone,
		                strength: 20,
		                points: 15,
		                randomize: true,
		                clamp: true,
		                taper: "out"
		            }),
					onComplete:function(){
						this.assets.btn_svar_paa_flere_spoergsmaal_rollover.alpha = 0;
//						this.node.game_receipt._destroy("continue");
						
					}.bind(this),
		        });

//				Tween.to(this.btnContainer,tSpeed,{alpha:0, ease:Quad.easeOut, onComplete:this.onBtnOut.bind(this)});

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
					Tween.to(this.assets.btn_svar_paa_flere_spoergsmaal_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
				}
			}
			this.onMouseOut = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_svar_paa_flere_spoergsmaal_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
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
		
			//this.stage.addChild(this.assets.bg);

			this.btnContainer = new PIXI.Container();
			this.stage.addChild(this.btnContainer);
			this.btnContainer.alpha = 0;
			this.addBtn();

//	        Tween.delayedCall(0.4,this.btnIn.bind(this));
//	        Tween.delayedCall(2.4,this.btnOut.bind(this));



			this.is_ready = true;

			this.node.game_receipt.readyCheck();

			// Let scene know we are ready to start playback
//			page.cN.scene.build();
//			this.build();

		}


		node.btn_play_more.build = function() {
//			u.bug("node.btn_play_more.build");

			if(!this.node.btn_signup) {
				u.ac(this.renderer.view, "single");
			}

			this.btnIn();


		}


		node.btn_play_more._destroy = function() {
//			u.bug("node.btn_play_more.destroy");

			this.destroyed = function() {

				this.destroy(true);
				delete this.node.btn_signup_confirm;

			}

			this.btnOut();

			u.t.setTimer(this, "destroyed", 200);

		}

		// start loading assets
		u.loadAssets(node.btn_play_more);

	}


	// // starts canvas playback
	this.build = function(node) {
//		u.bug("BtnPlayMore.build");

		node.btn_play_more.build();

	}

}
