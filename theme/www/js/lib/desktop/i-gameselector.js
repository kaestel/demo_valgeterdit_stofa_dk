Util.Objects["GameSelector"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node, state) {
//		u.bug("GameSelector.init:" + u.nodeId(node));

		node.game_selector = u.createPIXIApp({"classname":"game_selector", "height":900});
		node.game_selector.node = node;
		node.game_selector.state = state;

		node.appendChild(node.game_selector.renderer.view);

		// Load asses
		node.game_selector.loadQueue = [
			"round_header.png",
			"round_back0.png",
			"round_back1.png",
			"round_back2.png",
			"round_back3.png",
			"round_back4.png",
			"round_back5.png",
			"round_btn.png",
			"round_btn_rollover.png",
			"round_hitarea.png",
			"round_week0.png",
			"round_week1.png",
			"round_week2.png",
			"round_week3.png",
			"round_week4.png",
			"round_week5.png",
		];


		// Will be invoked when assets have loaded
		node.game_selector.ready = function() {
//			u.bug("node.game_selector.ready");

			this.createBtn = function(round){
//				console.log("add btn:" + round)
//				this.stage = stage
//				this.renderer = renderer
//				this.btnNum = btnNum;
				//categories_brick_back5
				//categories_brick_rollover
				//categories_brick
				//categories_brick_150
				//
//				this["categoryBtnContainer" + btnNum] = 
				var roundBtnContainer = new PIXI.Container();
				
				roundBtnContainer.app = this;
				roundBtnContainer.round_index = round;
				
				this.screenContainer.addChild(roundBtnContainer);

				this.setupBtn(roundBtnContainer,round);


				return roundBtnContainer;
			}
			this.setupBtn = function(roundBtnContainer,round){
//				roundBtnContainer.btnNumber = round;
//				roundBtnContainer.roundber = round;

				var texture, asset;
				roundBtnContainer.roundBack  = new PIXI.Container();
				roundBtnContainer.addChild(roundBtnContainer.roundBack)
				texture = PIXI.Texture.fromImage('/img/assets/desktop/round_back' + round +'.png');
				asset = new PIXI.Sprite(texture);
				roundBtnContainer.roundBack.addChild(asset);

				roundBtnContainer.roundBtn  = new PIXI.Container();
				roundBtnContainer.addChild(roundBtnContainer.roundBtn)
				texture = PIXI.Texture.fromImage('/img/assets/desktop/round_btn.png');
				asset = new PIXI.Sprite(texture);
				roundBtnContainer.roundBtn.addChild(asset);
				//roundBtn.alpha = 0;

				//add rollover
				roundBtnContainer.rollover = new PIXI.Container();
				roundBtnContainer.addChild(roundBtnContainer.rollover)
				texture = PIXI.Texture.fromImage('/img/assets/desktop/round_btn_rollover.png');
				asset = new PIXI.Sprite(texture);
				roundBtnContainer.rollover.addChild(asset);
				roundBtnContainer.rollover.alpha = 0;

				//add rollover
				roundBtnContainer.hitarea = new PIXI.Container();
				roundBtnContainer.addChild(roundBtnContainer.hitarea)
				texture = PIXI.Texture.fromImage('/img/assets/desktop/round_hitarea.png');
				asset = new PIXI.Sprite(texture);

				roundBtnContainer.hitarea.addChild(asset);
				roundBtnContainer.hitarea.x = 33;
				roundBtnContainer.hitarea.y = 21;
				roundBtnContainer.hitarea.alpha = 0.001;

				//add rollover
				roundBtnContainer.roundBtn_week = new PIXI.Container();
				roundBtnContainer.addChild(roundBtnContainer.roundBtn_week)
				texture = PIXI.Texture.fromImage('/img/assets/desktop/round_week'+ round + '.png');
				asset = new PIXI.Sprite(texture);
				roundBtnContainer.roundBtn_week.addChild(asset);

	   

				//SETUP MOUSE EVENTS ----------------------------------------------------
				roundBtnContainer.hitarea.interactive = true
				roundBtnContainer.hitarea.buttonMode = true;
				roundBtnContainer.hitarea.on('mouseover', this.onMouseOver.bind(roundBtnContainer));
				roundBtnContainer.hitarea.on('mouseout', this.onMouseOut.bind(roundBtnContainer));
				roundBtnContainer.hitarea.on('click', this._onBrickSelected.bind(roundBtnContainer));
			}

			// this.onMouseClick = function(){
			//
			// 	AnimatedCore._b.onBrickSelected(this.btnNumber);
			//
			// }


			this.onMouseOver = function(){
				var tSpeed = 0.15;
				Tween.to(this.rollover ,tSpeed,{alpha:1, ease:Quad.easeInOut});
			}
			this.onMouseOut = function(){
				var tSpeed = 0.15;
				Tween.to(this.rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
			}



			this.selectorEnterFromTop = function(){
				var tSpeed = 3;
				Tween.to(this.screenContainer,tSpeed,{y:this.startY, ease:Elastic.easeOut.config(0.2)});
//				Tween.delayedCall(2,this.onScreenContainerIn.bind(this));
			}



			this._onBrickSelected = function(){

				page.playEventSound();

				this.app.node.scene.current_round_index = this.round_index;

//				console.log("selectedCategory = " + selectedCategory);
				Tween.to(this.app.assets.round_header,0.2,{delay:0.3,alpha:0});
				for(var i=1;i<=6;i++){
					var btnObj = this.app["btn" + i];
					btnObj.hitarea.interactive = false;
					btnObj.hitarea.buttonMode = false;

					if(i!=this.round_index){
						Tween.to(btnObj,0.1,{delay:u.random(0,10)/100,alpha:0});
					} else {
						Tween.to(btnObj,0.2,{delay:.3,alpha:0});
					}
			
				}
		
				Tween.delayedCall(.5, this.app.onRoundBtnsOut.bind(this.app));
			}
			this.onRoundBtnsOut = function(){
				this._destroy();
			}

			this.showBtns = function(){
				Tween.fromTo(this.assets.round_header,0.2,{alpha:0},{delay:0,alpha:1});
				this.screenContainer.y = this.startY;
				for(var i=1;i<=6;i++){
					var btnObj = this["btn" + i];
					btnObj.alpha = 0;

					TweenLite.to(btnObj, .3, {
						delay:u.round(0,20)/100,
						alpha: 1,
						ease: RoughEase.ease.config({
							template: Power0.easeNone,
							strength: 5,
							points: 1,
							randomize: true,
							clamp: true,
							taper: "out"
						}),
					});
				}
			}


			this.stageHeightDiff = 200;
			this.startY = this.stageHeightDiff;
			//this.stage.addChild(this.assets.bg);
			this.screenContainer = new PIXI.Container();
			this.stage.addChild(this.screenContainer);
			this.screenContainer.x = (this.renderer.width/2)-(1024/2);
			this.screenContainer.y = -600;



		
			var btnStackX = 192;
			var btnStackY = 186;
			var btnMargin = 15;
			var btnWidth = 184;
			var btnHeight = 175;


			this.btn4 = this.createBtn(3);
			this.btn4.x = btnStackX + (btnWidth*0);
			this.btn4.y = btnStackY + (btnHeight*1);

			this.btn5 = this.createBtn(4);
			this.btn5.x = btnStackX +  btnMargin + (btnWidth*1);
			this.btn5.y = btnStackY + (btnHeight*1);

			this.btn6 = this.createBtn(5);
			this.btn6.x = btnStackX +  (btnMargin*2) + (btnWidth*2);
			this.btn6.y = btnStackY + (btnHeight*1);

			this.btn1 = this.createBtn(0);
			this.btn1.x = btnStackX + (btnWidth*0);
			this.btn1.y = btnStackY + (btnHeight*0);

			this.btn2 = this.createBtn(1);
			this.btn2.x = btnStackX +  btnMargin + (btnWidth*1);
			this.btn2.y = btnStackY + (btnHeight*0);

			this.btn3 = this.createBtn(2);
			this.btn3.x = btnStackX +  (btnMargin*2) + (btnWidth*2);
			this.btn3.y = btnStackY + (btnHeight*0);

			// set round header in game screen
			this.node.game_screen.setHeader("round_header");


			this.is_ready = true;

			// Let scene know we are ready to start playback
			page.cN.scene.build();
//			this.build();

		}


		node.game_selector.build = function() {
//			u.bug("node.game_selector.build");


			if(this.state == "first") {
				this.selectorEnterFromTop();
			}
			else {
				this.showBtns();
			}

		}


		node.game_selector._destroy = function() {
//			u.bug("node.game_selector.destroy");

			// remove category canvas

			this.destroy(true);
//			this.node.game_selector.renderer.view.parentNode.removeChild(this.node.game_selector.renderer.view);
			this.node.game_selector = false;

			// show category bricks
			u.o.GameBricks.init(this.node);


		}

		// start loading assets
		u.loadAssets(node.game_selector);

	}


	// starts canvas playback
	this.build = function(node) {
//		u.bug("GameSelector.build");

		node.game_selector.build();

	}

}
