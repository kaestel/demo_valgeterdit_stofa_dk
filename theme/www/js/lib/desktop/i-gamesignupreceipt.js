Util.Objects["GameSignupReceipt"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node) {
//		u.bug("GameSignupReceipt.init:" + u.nodeId(node));

		node.game_signup_receipt = u.createPIXIApp({"classname":"game_signup_receipt", "height":600});
		node.game_signup_receipt.node = node;
		node.appendChild(node.game_signup_receipt.renderer.view);

		// Load asses
		node.game_signup_receipt.loadQueue = [
			"screen_footer.png",

			"btn_hitarea.png",
			"txt_receipt.png",

			"txt_readmore.png",
			"txt_readmore_hitarea.png",
			"btn_facebook.png",


			"btn_se_naeste_uges_praemie.png",
			"btn_se_naeste_uges_praemie_rollover.png",
		];


		// Will be invoked when assets have loaded
		node.game_signup_receipt.ready = function() {
//			u.bug("node.game_signup_receipt.ready");


			this.addBtn = function(){

				this.btnContainer = new PIXI.Container();
				this.screenContainer.addChild(this.btnContainer);
				this.btnContainer.pivot.set(this.assets.btn_se_naeste_uges_praemie.width/2,(this.assets.btn_se_naeste_uges_praemie.height/2)-16);

				this.btnContainer.x = 400;
				this.btnContainer.y = 500;

				// this.btnContainer.x = this.renderer.width/2;
				// this.btnContainer.y = 230 + this.stageHeightDiff;
				this.screenContainer.addChild(this.btnContainer);
				this.btnContainer.addChild(this.assets.btn_se_naeste_uges_praemie);
				this.btnContainer.addChild(this.assets.btn_se_naeste_uges_praemie_rollover);
				this.assets.btn_se_naeste_uges_praemie_rollover.alpha = 0;
				this.btnContainer.addChild(this.assets.btn_hitarea);

		        this.assets.btn_hitarea.x = 31;
		        this.assets.btn_hitarea.y = 35;
		        this.assets.btn_hitarea.alpha = 0.001;
		        this.btnHoverDiff = 1;
		        this.btnStartY = this.btnContainer.y;

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
				page.openPrizes(this.node.scene.current_round_index+1);

				// var tSpeed = .2;
				// Tween.to(this.assets.txt_receipt,tSpeed,{alpha:0, ease:Quad.easeIn});
				// Tween.to(this.btnContainer,tSpeed,{alpha:0, ease:Quad.easeIn});
				// this.assets.btn_hitarea.interactive = false;
			}
			this.onBtnOut = function(){
//				console.log("Knap og tekst er ude");
			}
	

			this.setupInteractionEvents = function(){
				this.assets.btn_hitarea.interactive = true;
				this.assets.btn_hitarea.buttonMode = true;
				this.assets.btn_hitarea.on('click', this.onClicked.bind(this));
				this.assets.btn_hitarea.on('mouseover', this.onMouseOver.bind(this));
				this.assets.btn_hitarea.on('mouseout', this.onMouseOut.bind(this));

				this.assets.btn_facebook.interactive = true;
				this.assets.btn_facebook.buttonMode = true;
				this.assets.btn_facebook.on('click', this.facebookClick.bind(this));

				this.assets.txt_readmore_hitarea.interactive = true;
				this.assets.txt_readmore_hitarea.buttonMode = true;
				this.assets.txt_readmore_hitarea.on('click', this.readmoreClick.bind(this));

			}
			this.onMouseOver = function(){
				var tSpeed = 0.15;
				Tween.to(this.assets.btn_se_naeste_uges_praemie_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
			}
			this.onMouseOut = function(){
				var tSpeed = 0.15;
				Tween.to(this.assets.btn_se_naeste_uges_praemie_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
			}

			this.onClicked = function(){

				page.playEventSound();

				page.openPrizes(this.node.scene.current_round_index+1);
//				console.log("Knap og tekst er ude");
			}

			this.facebookClick = function(){

				page.playEventSound();

//				console.log("Der er klikket på facebook");

//				location.href = "https://www.facebook.com/sharer/sharer.php?u=https%3A//valgeterdit.stofa.dk";
				window.open("https://www.facebook.com/sharer/sharer.php?u=https%3A//valgeterdit.stofa.dk");

			}
			this.readmoreClick = function(){

				page.playEventSound();

//				console.log("Der er klikket på Læs mere");

				location.href = "https://www.stofa.dk";

			}


			this.showReceipt = function(){
				var tSpeed = 0.3;


				Tween.fromTo(this.assets.txt_receipt,tSpeed,{alpha:0},{delay:0.1, alpha:1,ease:Quad.easeIn});
				Tween.fromTo(this.assets.txt_readmore,tSpeed,{alpha:0},{delay:0.2, alpha:1,ease:Quad.easeIn});
				Tween.fromTo(this.assets.btn_facebook,tSpeed,{alpha:0},{delay:0.3, alpha:1,ease:Quad.easeIn});
				Tween.delayedCall(0.4,this.btnIn.bind(this))

			}


			this.stageHeightDiff = 0;
		
			this.screenContainer = new PIXI.Container();
			this.stage.addChild(this.screenContainer);
			this.startY = this.stageHeightDiff;

			this.screenContainer.x = (this.renderer.width/2)-(1024/2);
//			this.screenContainer.y = -600;


			this.assets.txt_receipt.alpha = 0;
			//this.screenIn();

			this.screenContainer.addChild(this.assets.txt_receipt);
			this.assets.txt_receipt.x = (this.renderer.width/2)-(this.assets.txt_receipt.width/2);
			this.assets.txt_receipt.y = 203;

			this.screenContainer.addChild(this.assets.txt_readmore);
			this.assets.txt_readmore.alpha = 0;
			this.assets.txt_readmore.x = 203;
			this.assets.txt_readmore.y = 190;


			this.screenContainer.addChild(this.assets.txt_readmore_hitarea);
			this.assets.txt_readmore_hitarea.x = 596;
			this.assets.txt_readmore_hitarea.y = 375;
			this.assets.txt_readmore_hitarea.alpha = 0.003;


			this.screenContainer.addChild(this.assets.btn_facebook);
			this.assets.btn_facebook.alpha = 0;
			this.assets.btn_facebook.x = 530;
			this.assets.btn_facebook.y = 475;


			this.addBtn();


			// create question wrapper
			this.node.div_signup_receipt = u.ae(this.node, "div", {"class":"signup_receipt"});
			this.node.div_signup_receipt.node = this.node;


			this.is_ready = true;

			// Let scene know we are ready to start playback
//			page.cN.scene.build();
			this.build();

		}


		node.game_signup_receipt.build = function() {
//			u.bug("node.game_signup_receipt.build");


			page.showJan("godt_spillet");


			u.a.transition(this.node.div_signup_receipt, "all 0.4s ease-in-out");
			u.ass(this.node.div_signup_receipt, {
				"opacity": 1
			});


			this.node.game_screen.setHeader(false);


			this.showReceipt();


		}


		node.game_signup_receipt._destroy = function() {
//			u.bug("node.game_signup_receipt.destroy:" + onto);


			page.hideJan(true);

			this.destroy(true);
			this.node.game_signup_receipt = false;

		}

		// start loading assets
		u.loadAssets(node.game_signup_receipt);

	}


	// // starts canvas playback
	this.build = function(node) {
//		u.bug("GameSignupReceipt.build");

		node.game_signup_receipt.build();

	}

}
