Util.Objects["IntroScene"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node) {
//		u.bug("IntroScene.init");

		node.intro_scene = u.createPIXIApp({"classname":"intro_scene", "height":900, "webgl":true});
		node.intro_scene.node = node;
		node.appendChild(node.intro_scene.renderer.view);

		// Load asses
		node.intro_scene.loadQueue = [
			"prize_appletv.png",
			"prize_bg.png",
			"prize_dropshadow.png",
			"prize_gavekort.png",
			"prize_gavekort_shadow.png",
			"prize_glow.png",
			"prize_header.png",
			"prize_header_dropshadow.png",
			"prize_header_glow.png",
			"prize_island.png",
			"prize_mac.png",
			"prize_mac_dropshadow.png",
			"prize_nespresso.png",
			"prize_sand_toplayer.png",
			"prize_tablet.png",
			"prize_tv.png",
			"prize_tile.jpg",
		];


		// Will be invoked when assets have loaded
		node.intro_scene.ready = function() {
//			u.bug("node.intro_scene.ready");


			this.prizeObjIn = function(prizeObj){
				prizeObj.x = prizeObj.xPos;
				Tween.to(prizeObj.scale,.8,{x:1,y:1, ease:Quad.easeOut});
				Tween.fromTo(prizeObj,0.3,{y:prizeObj.yPos-20},{y:prizeObj.yPos-180, ease:Quad.easeOut});
				Tween.to(prizeObj,.3,{delay:0.3, y:prizeObj.yPos, ease:Quad.easeIn});
				if(prizeObj.shadow){
//					console.log("shadow");
					Tween.to(prizeObj.shadow,0.2,{delay:0.6, alpha:1});
				}
			}
			this.headerIn = function(){
				Tween.to(this.introHeader.scale,0.5,{x:1, y:1, ease:Elastic.easeOut.config(.3)});
			}
			this.headerOut = function(){
				Tween.to(this.introHeader.scale,0.5,{x:0, y:0, ease:Elastic.easeIn.config(.15)});
			}
			this.tvIn = function(){
				this.assets.prize_tv.scale.x = 0.3;
				Tween.to(this.assets.prize_tv.scale,0.5,{x:1, ease:Quad.easeOut});
			}
			this.onIntroIn = function(){
				this.isHovering = true;
				this.introHover();
			}
			this.introHover = function(){
				if(this.isHovering){
					this.hoverDiff*=-1;
					var tSpeed = 3;
					Tween.to(this.introContainer,tSpeed,{y:this.startY + this.hoverDiff, ease:Quad.easeInOut});
					Tween.delayedCall(tSpeed, this.introHover.bind(this));
				}
		
			}
			this.introIn = function(){
				var tSpeed = 3;
				Tween.to(this.introContainer,tSpeed, {y:this.startY, ease:Elastic.easeOut.config(0.15)});
				//Tween.delayedCall(tSpeed,function(){this.isHovering = true;this.introHover();}.bind(this));
			}
			this.introOut = function(){
				this.isHovering = false;
				var tSpeed = 0.5;
				Tween.to(this.introContainer,tSpeed, {y:this.introContainer.height*-1, ease:Quad.easeIn, 
					onComplete:this._destroy.bind(this)
				});

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


			this.changeDisplacementPosition = function () {
				this.displacementSprite.y -= 1.4;
				Tween.delayedCall(0.04, this.changeDisplacementPosition.bind(this));
			}

			this.stageHeightDiff = 200;
			this.introContainer = new PIXI.Container();
			this.stage.addChild(this.introContainer);
			this.startY = this.stageHeightDiff;
			this.introContainer.y = -400;


			this.introHeader = new PIXI.Container();
			this.introHeader.addChild(this.assets.prize_header_dropshadow);
			this.introHeader.addChild(this.assets.prize_header_glow);
			this.introHeader.addChild(this.assets.prize_header);
			this.stage.addChild(this.introHeader);
			this.introHeader.pivot.set(this.assets.prize_header.width/2,this.assets.prize_header.height/2);

			this.introHeader.y = (this.assets.prize_header.height/2) + this.stageHeightDiff;
			this.introHeader.x = this.assets.prize_header.width/2;

			this.introHeader.scale.x = this.introHeader.scale.y = 0;

			this.introContainer.addChild(this.assets.prize_dropshadow);
			this.introContainer.addChild(this.assets.prize_glow);
			this.introContainer.addChild(this.assets.prize_bg);

			this.introContainer.addChild(this.assets.prize_tv);
			this.assets.prize_tv.x = 363;
			this.assets.prize_tv.y = 250;
			this.assets.prize_tv.scale.x = 0;

			this.introContainer.addChild(this.assets.prize_tablet);
			this.assets.prize_tablet.anchor.set(0.5);
			this.assets.prize_tablet.xPos = 363 + (this.assets.prize_tablet.width/2);
			this.assets.prize_tablet.yPos = 250 + (this.assets.prize_tablet.height/2);
			this.assets.prize_tablet.scale.x = this.assets.prize_tablet.scale.y = 0;

			this.introContainer.addChild(this.assets.prize_island);

			this.introContainer.addChild(this.assets.prize_nespresso);
			this.assets.prize_nespresso.anchor.set(0.5);
			this.assets.prize_nespresso.xPos = 590 + (this.assets.prize_nespresso.width/2);
			this.assets.prize_nespresso.yPos = 325 + (this.assets.prize_nespresso.height/2);
			this.assets.prize_nespresso.scale.x = this.assets.prize_nespresso.scale.y = 0;


			this.introContainer.addChild(this.assets.prize_mac_dropshadow);
			this.assets.prize_mac_dropshadow.anchor.set(0.5);
			this.assets.prize_mac_dropshadow.x = 500 + (this.assets.prize_mac_dropshadow.width/2);
			this.assets.prize_mac_dropshadow.y = 316 + (this.assets.prize_mac_dropshadow.height/2);
			this.assets.prize_mac_dropshadow.alpha = 0;

			this.introContainer.addChild(this.assets.prize_mac);
			this.assets.prize_mac.anchor.set(0.5);
			this.assets.prize_mac.xPos = 500 + (this.assets.prize_mac.width/2);
			this.assets.prize_mac.yPos = 316 + (this.assets.prize_mac.height/2);
			this.assets.prize_mac.scale.x = this.assets.prize_mac.scale.y = 0;
			this.assets.prize_mac.shadow = this.assets.prize_mac_dropshadow;

			this.introContainer.addChild(this.assets.prize_gavekort_shadow);
			this.assets.prize_gavekort_shadow.anchor.set(0.5);
			this.assets.prize_gavekort_shadow.x = 590 + (this.assets.prize_gavekort_shadow.width/2);
			this.assets.prize_gavekort_shadow.y = 283 + (this.assets.prize_gavekort_shadow.height/2);
			this.assets.prize_gavekort_shadow.alpha = 0;

			this.introContainer.addChild(this.assets.prize_gavekort);
			this.assets.prize_gavekort.anchor.set(0.5);
			this.assets.prize_gavekort.xPos = 590 + (this.assets.prize_gavekort.width/2);
			this.assets.prize_gavekort.yPos = 290 + (this.assets.prize_gavekort.height/2);
			this.assets.prize_gavekort.scale.x = this.assets.prize_gavekort.scale.y = 0;
			this.assets.prize_gavekort.shadow = this.assets.prize_gavekort_shadow;

			this.introContainer.addChild(this.assets.prize_appletv);
			this.assets.prize_appletv.anchor.set(0.5);
			this.assets.prize_appletv.xPos = 348 + (this.assets.prize_appletv.width/2);
			this.assets.prize_appletv.yPos = 435 + (this.assets.prize_appletv.height/2);
			this.assets.prize_appletv.scale.x = this.assets.prize_appletv.scale.y = 0;

			this.introContainer.addChild(this.assets.prize_sand_toplayer);

			this.displacementSprite = this.assets.prize_tile;
			this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
			this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
			this.displacementFilter.scale.x = this.displacementFilter.scale.y = 6;
			this.assets.prize_glow.filters = [this.displacementFilter];
			this.assets.prize_header_glow.filters = [this.displacementFilter];
			this.introContainer.addChild(this.displacementSprite);
			this.changeDisplacementPosition();

			this.hoverDiff = 5;
			this.introContainer.x = (this.renderer.width/2) - (this.introContainer.width/2);
			this.startX = this.introContainer.x;


			this.is_ready = true;


			// Let scene know we are ready to start playback
			page.cN.scene.build();

		}


		// Will be invoked from scene controller when it's time to start (scene could be waiting for other canvases)
		node.intro_scene.build = function() {
//			u.bug("node.intro_scene.build");

			Tween.delayedCall(0,this.introIn.bind(this));
			Tween.delayedCall(1,this.headerIn.bind(this));

			Tween.delayedCall(0.6,this.prizeObjIn.bind(this),[this.assets.prize_appletv]);
			Tween.delayedCall(.7,this.prizeObjIn.bind(this),[this.assets.prize_tablet]);
			Tween.delayedCall(1.3,this.tvIn.bind(this));
			Tween.delayedCall(.8,this.prizeObjIn.bind(this),[this.assets.prize_mac]);
			Tween.delayedCall(.9,this.prizeObjIn.bind(this),[this.assets.prize_gavekort]);
			Tween.delayedCall(1,this.prizeObjIn.bind(this),[this.assets.prize_nespresso]);


			Tween.delayedCall(4,this.introOut.bind(this));
			Tween.delayedCall(3.7,this.headerOut.bind(this));

		}

		// avoid name conflict with pixi object
		node.intro_scene._destroy = function() {
//			u.bug("node.intro_scene.destroy");

			this.destroy(true);
			delete this.node.intro_scene


			// destroy scene
			page.cN.scene.destroy();

		}

		// start loading assets
		u.loadAssets(node.intro_scene);

	}


	// starts canvas playback
	this.build = function(node) {
//		u.bug("IntroScene.build");

		node.intro_scene.build();

	}

}
