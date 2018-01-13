Util.Objects["GameBricks"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node, state) {
//		u.bug("GameBricks.init");

		node.game_bricks = u.createPIXIApp({"classname":"game_bricks", "height":900});
		node.game_bricks.node = node;
		node.game_bricks.state = state;

		node.appendChild(node.game_bricks.renderer.view);


		// console.log("QUIZ");
		// console.log(node.scene.quiz);
		//
		// console.log("QUIZ Answers");
		// console.log(node.scene.quiz_answers);
		//
		// console.log("QUIZ current round");
		// console.log(node.scene.current_round_index);



		// map current round index
//			current_round_index = round_index;
//		var current_round_index = node.scene.current_round_index;
//		var current_round = node.scene.quiz.rounds[node.scene.current_round_index];


		// reset question vars
		node.scene.current_category_index = false;
		node.scene.current_question_index = false;



		// Load asses
		node.game_bricks.loadQueue = [
			"screen.png",
			"categories_header_"+node.scene.current_round_index+"_1.png",
			"categories_header_"+node.scene.current_round_index+"_2.png",
			"categories_header_"+node.scene.current_round_index+"_3.png",

			"categories_brick.png",
			"categories_brick_back_0_0.png",
			"categories_brick_back_0_1.png",
			"categories_brick_back_0_2.png",
			"categories_brick_back_1_0.png",
			"categories_brick_back_1_1.png",
			"categories_brick_back_1_2.png",
			"categories_brick_back_2_0.png",
			"categories_brick_back_2_1.png",
			"categories_brick_back_2_2.png",
			"categories_brick_rollover.png",
			"categories_brick_hitarea.png"
		];


		// Will be invoked when assets have loaded
		node.game_bricks.ready = function() {
//			u.bug("node.game_bricks.ready");


			// map dynamic assets to fixed names
			this.assets.categories_header_1 = this.assets["categories_header_"+ this.node.scene.current_round_index + "_1"];
			this.assets.categories_header_2 = this.assets["categories_header_"+ this.node.scene.current_round_index + "_2"];
			this.assets.categories_header_3 = this.assets["categories_header_"+ this.node.scene.current_round_index + "_3"];


			// declare helper functions


			this.createBrick = function(category, question) {

				var brickStackY = 254;
				var brickMargin = 9;
				var brickWidth = 204;
				var brickHeight = 89;

				var brickContainer = new PIXI.Container();
				brickContainer.category_index = category;
				brickContainer.question_index = question;
				brickContainer.question = this.node.scene.quiz.rounds[this.node.scene.current_round_index].categories[brickContainer.category_index].questions[brickContainer.question_index];

				brickContainer.app = this;

				this.screenContainer.addChild(brickContainer);

				// has already been answered
				if(typeof(this.node.scene.quiz_answers["r"+this.node.scene.current_round_index+"c"+category+"q"+question]) !== "undefined"){
					this.setupInactiveBrick(brickContainer);
				}
				else {
					this.setupActiveBrick(brickContainer);
				}


				// position brick container
				brickContainer.x = 134 + (brickWidth*category) + brickMargin;
				brickContainer.y = brickStackY + (brickHeight*question);


				return brickContainer;

			}

			this.setupActiveBrick = function(brickContainer){

				var texture, asset;

				brickContainer.brick  = new PIXI.Container();
				brickContainer.addChild(brickContainer.brick);
				texture = PIXI.Texture.fromImage('/img/assets/desktop/categories_brick.png');
				asset = new PIXI.Sprite(texture);
				brickContainer.brick.addChild(asset);


				//add rollover
				brickContainer.brick_rollover = new PIXI.Container();
				brickContainer.addChild(brickContainer.brick_rollover);
				texture = PIXI.Texture.fromImage('/img/assets/desktop/categories_brick_rollover.png');
				asset = new PIXI.Sprite(texture);
				brickContainer.brick_rollover.addChild(asset);
				brickContainer.brick_rollover.alpha = 0;



				//add 150
				brickContainer.brickBrick = new PIXI.Container();
				brickContainer.addChild(brickContainer.brickBrick);
				texture = PIXI.Texture.fromImage('/img/assets/desktop/categories_brick_'+brickContainer.question.stake+'.png');
				asset = new PIXI.Sprite(texture);
				brickContainer.brickBrick.addChild(asset);


				//add hitarea
				brickContainer.brick_hitarea = new PIXI.Container();
				brickContainer.addChild(brickContainer.brick_hitarea);
				texture = PIXI.Texture.fromImage('/img/assets/desktop/categories_brick_hitarea.png');
				asset = new PIXI.Sprite(texture);
				brickContainer.brick_hitarea.addChild(asset);


				brickContainer.brick_hitarea.x = 71;
				brickContainer.brick_hitarea.y = 31;
				brickContainer.brick_hitarea.alpha = 0.001;


				brickContainer.brick_hitarea.interactive = false;
				brickContainer.brick_hitarea.buttonMode = false;

				brickContainer.brick_hitarea.on('mouseover', this.onMouseOver.bind(brickContainer));
				brickContainer.brick_hitarea.on('mouseout', this.onMouseOut.bind(brickContainer));
				brickContainer.brick_hitarea.on('click', this._onBrickSelected.bind(brickContainer));
			}

			this.setupInactiveBrick = function(brickContainer) {

				//add backside
				var brickBack = new PIXI.Container();
				brickContainer.addChild(brickBack)
				var texture = PIXI.Texture.fromImage('/img/assets/desktop/categories_brick_back_' + brickContainer.category_index +'_'+ brickContainer.question_index + '.png');
//				var backsideTexture = PIXI.Texture.fromImage('/img/assets/desktop/categories_brick_back' + brickNum + '.png');
				var asset = new PIXI.Sprite(texture);
				brickBack.addChild(asset);

			}

			this.onMouseOver = function(){

		        if(!this.startBtnBtnIsActive){
		            //AnimatedBanner.zIndexHandler(this);
		            var tSpeed = 0.15;
		            Tween.to(this.brick_rollover ,tSpeed,{alpha:1, ease:Quad.easeInOut});
		        }
		    }
			this.onMouseOut = function(){
		        if(!this.startBtnBtnIsActive){
		            var tSpeed = 0.15;
		            Tween.to(this.brick_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
		        }
		    }


			// redraw bricks
			this.showBricksAndObjects = function(){

				this.screenContainer.y = this.startY;
				for(var i=1;i<=9;i++){
					var brickObj = this["brick" + i];
					brickObj.alpha = 0;
					TweenLite.to(brickObj, .3, {
						delay:u.random(0,20)/100,
						alpha: 1,
						ease: RoughEase.ease.config({
							template: Power0.easeNone,
							strength: 5,
							points: 5,
							randomize: true,
							clamp: true,
							taper: "out"
						}),
					});
				}
				TweenLite.fromTo(this.assets.categories_header_1, .3, {alpha:0},{
					delay:u.random(0,20)/100,
					alpha: 1,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 20,
						points: 5,
						randomize: true,
						clamp: true,
						taper: "out"
					}),
				});
				TweenLite.fromTo(this.assets.categories_header_2, .3, {alpha:0},{
					delay:u.random(0,20)/100,
					alpha: 1,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 20,
						points: 5,
						randomize: true,
						clamp: true,
						taper: "out"
					}),
				});
				TweenLite.fromTo(this.assets.categories_header_3, .3, {alpha:0},{
					delay:u.random(0,20)/100,
					alpha: 1,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 20,
						points: 5,
						randomize: true,
						clamp: true,
						taper: "out"
					}),
				});
				Tween.delayedCall(0.3, this.onScreenContainerIn.bind(this));
			}
			this.brickContainerEnterFromTop = function(){
				var tSpeed = 3;
				Tween.to(this.screenContainer,tSpeed,{y:this.startY, ease:Elastic.easeOut.config(0.2)});
				Tween.delayedCall(2,this.onScreenContainerIn.bind(this));
			}

			this.onScreenContainerIn = function(){

				for(var i=1;i<=9;i++){
					var brickObj = this["brick" + i];
					if(brickObj.brick_hitarea) {
						brickObj.brick_hitarea.interactive = true;
						brickObj.brick_hitarea.buttonMode = true;
					}
				}
			}
			this.brickContainerOut = function(){
				var tSpeed = 0.5;
				Tween.to(this.screenContainer,tSpeed, {y:-600, ease:Quad.easeIn});
			}

			this._onBrickSelected = function(){

				page.playEventSound();

//				console.log("category_index = " + this.category_index);
//				console.log("question_index = " + this.question_index);

				this.app.node.scene.current_category_index = this.category_index;
				this.app.node.scene.current_question_index = this.question_index;


				for(var i=1;i<=9;i++){
					var brickObj = this.app["brick" + i];
					if(brickObj.brick_hitarea) {
						brickObj.brick_hitarea.interactive = false;
						brickObj.brick_hitarea.buttonMode = false;
					}

					Tween.to(brickObj,0.2,{delay:u.random(0,20)/100,alpha:0});
				}
				Tween.to(this.app.assets.categories_header_1,0.2,{delay:u.random(0,20)/100,alpha:0});
				Tween.to(this.app.assets.categories_header_2,0.2,{delay:u.random(0,20)/100,alpha:0});
				Tween.to(this.app.assets.categories_header_3,0.2,{delay:u.random(0,20)/100,alpha:0});
				Tween.delayedCall(0.5, this.app.onBrickScreenOut.bind(this.app));
			}
			this.onBrickScreenOut = function(){

				this._destroy();
			}


			// Start building stage


			this.stageHeightDiff = 200;
			this.startY = this.stageHeightDiff;

			this.screenContainer = new PIXI.Container();
			this.stage.addChild(this.screenContainer);
			this.screenContainer.x = (this.renderer.width/2)-(this.assets.screen.width/2);
			this.screenContainer.y = -600;

			var headerXPos = 197;
			var headerYPos = 184;
			var headerWidth = 204;
			this.screenContainer.addChild(this.assets.categories_header_1);
			this.assets.categories_header_1.x = headerXPos;
			this.assets.categories_header_1.y = headerYPos;

			this.screenContainer.addChild(this.assets.categories_header_2);
			this.assets.categories_header_2.x = headerXPos + headerWidth;
			this.assets.categories_header_2.y = headerYPos;

			this.screenContainer.addChild(this.assets.categories_header_3);
			this.assets.categories_header_3.x = headerXPos + (headerWidth*2)
			this.assets.categories_header_3.y = headerYPos;


			this.brick7 = this.createBrick(0, 2);
			this.brick8 = this.createBrick(1, 2);
			this.brick9 = this.createBrick(2, 2);

			this.brick4 = this.createBrick(0, 1);
			this.brick5 = this.createBrick(1, 1);
			this.brick6 = this.createBrick(2, 1);

			this.brick3 = this.createBrick(0, 0);
			this.brick2 = this.createBrick(1, 0);
			this.brick1 = this.createBrick(2, 0);


			// set round header in game screen
			this.node.game_screen.setHeader("round_header_"+this.node.scene.current_round_index);


			this.is_ready = true;

			// Let scene know we are ready to start playback
			page.cN.scene.build();

		}


		// Will be invoked from scene controller when it's time to start (scene could be waiting for other canvases)
		node.game_bricks.build = function() {
//			u.bug("node.game_bricks.build");

			if(this.state == "first") {
				this.brickContainerEnterFromTop();
			}
			else {
				this.showBricksAndObjects();
			}

			page.showJan("game");

		}


		node.game_bricks._destroy = function() {


			page.hideJan(true);

			// remove category canvas

			this.destroy(true);
			this.node.game_bricks = false;


			// start question flow
			u.o.GameQuestion.init(this.node);

		}

		// start loading assets
		u.loadAssets(node.game_bricks);

	}


	// starts canvas playback
	this.build = function(node) {
//		u.bug("GameBricks.build");

		node.game_bricks.build();

	}

}
