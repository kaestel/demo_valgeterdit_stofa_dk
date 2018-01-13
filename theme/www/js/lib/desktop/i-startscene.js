Util.Objects["StartScene"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node) {
//		u.bug("StartScene.init");

		node.start_scene = u.createPIXIApp({"classname":"start_scene", "height":900, "webgl":true});
		node.start_scene.node = node;
		node.appendChild(node.start_scene.renderer.view);

		// Load asses
		node.start_scene.loadQueue = [
			"ved_dropshadow.png",
			"ved_glow.png",
			"ved_powered.png",
			"ved_unpowered.png",
			"ved_tile.jpg",
			"startbtn.png",
			"startbtn_rollover.png",
			"startbtn_hitarea.png",
			"startbtn_glow.png",
			"ved_spark.png"
		];


		// Will be invoked when assets have loaded
		node.start_scene.ready = function() {


			this.stageHeightDiff = 200;


			// declare helper functions

			this.addBtn = function(){

				this.startBtnContainer = new PIXI.Container();
				this.stage.addChild(this.startBtnContainer);
				this.startBtnContainer.pivot.set(this.assets.startbtn.width/2,this.assets.startbtn.height/2);
				this.startBtnContainer.x = this.renderer.width/2;
				this.startBtnContainer.y = 500 + this.stageHeightDiff;
				this.stage.addChild(this.startBtnContainer);
				this.startBtnContainer.addChild(this.assets.startbtn_glow);
				this.startBtnContainer.addChild(this.assets.startbtn);
				this.startBtnContainer.addChild(this.assets.startbtn_rollover);
				this.assets.startbtn_rollover.alpha = 0;
				this.startBtnContainer.addChild(this.assets.startbtn_hitarea);
				this.assets.startbtn_hitarea.x = 59;
				this.assets.startbtn_hitarea.y = 46;
				this.assets.startbtn_hitarea.alpha = 0.001;
				this.startBtnContainer.scale.x = this.startBtnContainer.scale.y = 0;  
				this.btnHoverDiff = 1;
				this.btnStartY = this.startBtnContainer.y;
				this.assets.startbtn_glow.filters = [this.displacementFilter];
				this.startBtnIn();
				Tween.delayedCall(1.2,this.startBtnHover.bind(this));

			}
	
			this.startBtnHover = function(){
				this.btnHoverDiff*=-1;
				var tSpeed = 2;
				Tween.to(this.startBtnContainer,tSpeed,{y:this.btnStartY + this.btnHoverDiff, ease:Quad.easeInOut});
				Tween.delayedCall(tSpeed, this.startBtnHover.bind(this));
			}
			this.startBtnIn = function(){
				var tSpeed = .8;
				Tween.to(this.startBtnContainer.scale,tSpeed,{x:1,y:1, ease:Elastic.easeOut.config(0.2)});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.startBtnOut = function(){

				page.playEventSound();

				this.vedOut();
				var tSpeed = .2;
				this.assets.startbtn_rollover.alpha = 0;
				Tween.to(this.assets.startbtn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
				Tween.to(this.startBtnContainer.scale,tSpeed,{x:0,y:0, ease:Quad.easeIn});
				this.assets.startbtn_hitarea.interactive = false;
			}
			this.onStartBtnOut = function(){

				this._destroy();
//				page.cN.scene.destroy();
			}
			this.changeDisplacementPositionBtn = function () {
				this.displacementSpriteBtn.y -= 1;
				Tween.delayedCall(0.04, this.changeDisplacementPositionBtn.bind(this));
			}

			this.setupInteractionEvents = function(){
				this.assets.startbtn_hitarea.interactive = true;
				this.assets.startbtn_hitarea.buttonMode = true;
				this.assets.startbtn_hitarea.on('click', this.startBtnOut.bind(this));
				this.assets.startbtn_hitarea.on('mouseover', this.onMouseOver.bind(this));
				this.assets.startbtn_hitarea.on('mouseout', this.onMouseOut.bind(this));
			}
			this.onMouseOver = function(){
				if(!this.startBtnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.startbtn_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
				}
			}
			this.onMouseOut = function(){
				if(!this.startBtnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.startbtn_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
				}
			}
			this.setstartBtnToActive = function(){
				var tSpeed = 0.3;
				if(!this.startBtnBtnIsActive){
					this.startBtnBtnIsActive = true;
					Tween.to(this.assets.startBtn_btn_active,tSpeed*.2,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.startBtn_btn_glow,tSpeed,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.startBtn,tSpeed,{y:-18, ease:Quad.easeInOut});
				} else {
					this.startBtnBtnIsActive = false;
					Tween.to(this.assets.startBtn_btn_active,tSpeed*.2,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.startBtn_btn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.startBtn,tSpeed,{y:0, ease:Quad.easeInOut});
				}
		
			}

			this.vedHover = function(){
				if(this.isHovering) {
					this.hoverDiff*=-1;
					var tSpeed = 3;
					Tween.to(this.vedContainer,tSpeed,{y:this.startY + this.hoverDiff, ease:Quad.easeInOut});
					Tween.delayedCall(tSpeed, this.vedHover.bind(this));
				}
			}
			this.vedIn = function(){
				var tSpeed = 4;
				this.isHovering = true;
				Tween.to(this.vedContainer,tSpeed, {y:this.startY, ease:Elastic.easeOut.config(0.15)});
				Tween.delayedCall(tSpeed,function(){this.vedHover();}.bind(this));
			}
			this.vedOut = function(){
				this.isHovering = false;
				var tSpeed = 0.5;
				Tween.to(this.vedContainer,tSpeed, {y:this.vedContainer.height*-1, ease:Quad.easeIn, onComplete:this.onStartBtnOut.bind(this)});
			}


			this.powerUp = function(){
				this.makeSplashBlast();
				TweenLite.to(this.vedPowered, 1.3, {
					alpha: 1,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 20,
						points: 35,
						randomize: true,
						clamp: true,
						taper: "out"
					}),
				});
		 
			}
			this.makeSplashBlast = function (){

				for(var i=0;i<this.sparks.length;i++){
					var sparkObj = this.sparks[i];
					var dNum = u.random(0,400)/600;
					this.tw_sb = Tween.delayedCall(dNum, this.doSpark.bind(this),[sparkObj]);
				}

			}
			this.doSpark = function(sparkObj){
				var diff = 1;
				if(this.vedContainer.scale.x == 1){
					diff = 1;
				} else {
					diff = 4;
				}
				sparkObj.x = this.vedContainer.x + (u.random(50,600))/diff;
				sparkObj.y = this.vedContainer.y + (u.random(100,150))/diff;

				sparkObj.ySpeed = u.random(-7,0)/1;
				sparkObj.xSpeed = u.random(-12,12)/2.5;
				sparkObj.active = true;
				var tSpeed = u.random(70,130)/100;
				sparkObj.anchorPoint = u.random(0,15)/2;

				Tween.to(sparkObj,tSpeed,{rotation:u.random(-3,3), ease:Quad.easeOut});
				Tween.to(sparkObj.anchor,tSpeed,{x:sparkObj.anchorPoint, ease:Quad.easeOut});
				sparkObj.alpha = 1;
				Tween.to(sparkObj, tSpeed, {
					alpha: 0,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 50,
						points: 50,
						randomize: true,
						clamp: true,
						taper: "out",
						onComplete:this.deActivateSparkObj.bind(this),
						onCompleteParams:[sparkObj],
					}),
				});
			}
			this.deActivateSparkObj = function(){
				sparkObj.active = false;
			}
			this.handleSparks = function(){
				for(i=0;i<this.sparks.length;i++){
					var sparkObj = this.sparks[i];
					if(sparkObj.active){
						this.sparkMove(sparkObj);
					}
				}
			}
			this.sparkMove = function(sparkObj){

				sparkObj.xSpeed*=0.99;
				sparkObj.ySpeed*=0.99;
				sparkObj.x += sparkObj.xSpeed;
				sparkObj.y += sparkObj.ySpeed + this.sparkGravity;
			}
			this.insertSparks = function(){

				this.sparkGravity = 5;
				this.sparkContainer = new PIXI.Container();
				this.stage.addChild(this.sparkContainer);
				this.sparks = [];

				var totalSparks = 5;
				for(var i = 0; i < totalSparks; i++) {
					this.drawSpark();
				}
			}
			this.drawSpark = function() {

				this.assets.ved_spark.anchor.set(0.5, 0.5);
				this.assets.ved_spark.scale.x = this.assets.ved_spark.scale.y = u.random(70,100)/100;
				this.sparkContainer.addChild(this.assets.ved_spark);
				this.sparks.push(this.assets.ved_spark);

			}
			this.doSingleSpark = function(){
				//Tween.fromTo(this.vedPowered, 0.1,{alpha:0.5},{alpha:1, ease:Quad.easeOut});
				if(this.vedContainer.scale.x == 1){
					Tween.delayedCall(u.random(0,100)/10, this.doSingleSpark.bind(this));
				}
		
				this.vedPowered.alpha = 0.4;
				this.tw_sp = Tween.to(this.vedPowered, 0.3, {
					alpha: 1,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 50,
						points: 5,
						randomize: true,
						clamp: true,
						taper: "out",
						onComplete:this.deActivateSparkObj.bind(this),
						onCompleteParams:[sparkObj],
					}),
				});
				var rNum = u.random(1,3);
				for(var i=0;i<rNum;i++){
					var sparkObj = this.sparks[i];
					this.doSpark(sparkObj);
				}
			}

			this.changeDisplacementPosition = function () {
				this.displacementSprite.y -= 1;
				Tween.delayedCall(0.04, this.changeDisplacementPosition.bind(this));
			}




			// Start building stage
			this.insertSparks();

			this.vedContainer = new PIXI.Container();
			this.stage.addChild(this.vedContainer);

			this.startY = 120 + this.stageHeightDiff;
		
			this.vedContainer.y = -400;
		
			this.vedContainer.addChild(this.assets.ved_dropshadow);
			this.vedContainer.addChild(this.assets.ved_unpowered);

			this.vedPowered = new PIXI.Container();
			this.vedContainer.addChild(this.vedPowered);

			this.vedPowered.addChild(this.assets.ved_glow);
			this.vedPowered.addChild(this.assets.ved_powered);
			this.vedPowered.alpha = 0;

			this.displacementSprite = this.assets.ved_tile;
			this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
			this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
			this.displacementFilter.scale.x = this.displacementFilter.scale.y = 15;
			this.assets.ved_glow.filters = [this.displacementFilter];
			this.vedContainer.addChild(this.displacementSprite);
			this.changeDisplacementPosition();

			this.hoverDiff = 5;
			this.vedContainer.x = (this.renderer.width/2) - (this.vedContainer.width/2);
			this.startX = this.vedContainer.x;


			this.is_ready = true;


			// Let scene know we are ready to start playback
			page.cN.scene.build();

		}


		// Will be invoked from scene controller when it's time to start (scene could be waiting for other canvases)
		node.start_scene.build = function() {
//			u.bug("node.app.build");

			Tween.delayedCall(0,this.vedIn.bind(this));
			Tween.delayedCall(.8,this.powerUp.bind(this));
			Tween.delayedCall(2.5,this.doSingleSpark.bind(this));
			Tween.delayedCall(1.8,this.addBtn.bind(this));


			page.showJan("start");

		}

		// avoid name conflict with pixi object
		node.start_scene._destroy = function() {
//			u.bug("node.start_scene.destroy");


			page.hideJan(true);

			this.destroy(true);
			delete this.node.start_scene

			// destroy scene
			page.cN.scene.destroy();

		}


		// start loading assets
		u.loadAssets(node.start_scene);

	}


	// starts canvas playback
	this.build = function(node) {
//		u.bug("StartScene.build");

		node.start_scene.build();

	}

}
