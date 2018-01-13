Util.Objects["torkild"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node) {
//		u.bug("torkild.init:" + u.nodeId(node));

		node.torkild = u.createPIXIApp({"classname":"torkild", "height":345, "width":345, "webgl":true});
		node.torkild.node = node;
		node.appendChild(node.torkild.renderer.view);

		// Load asses
		node.torkild.loadQueue = [
			"torkild.png",
			"torkild_bg.png",
			"torkild_btn_active.png",
			"torkild_btn_inactive.png",
			"torkild_btn_glow.png",
			"torkild_top_circle.png",
			"torkild_tile.jpg",
			"torkild_hitarea.png",
		];

		// Will be invoked when assets have loaded
		node.torkild.ready = function() {
//			console.log("node.torkild.ready");


			// declare helper functions

			this.torkildHover = function(){
//				if(!this.torkildBtnIsActive) {
					this.hoverDiff*=-1;
					var tSpeed = 2;
					Tween.to(this.torkildContainer,tSpeed,{y:this.startY + this.hoverDiff, ease:Quad.easeInOut});
//				}
				Tween.delayedCall(tSpeed, this.torkildHover.bind(this));
			}
			this.torkildIn = function(){
				var tSpeed = 2;
				Tween.to(this.torkildContainer.scale,tSpeed,{x:1,y:1, ease:Elastic.easeOut.config(0.6)});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.torkildOut = function(){
				var tSpeed = 0.5;
				Tween.to(this.torkildContainer.scale,tSpeed,{x:0,y:0, ease:Back.easeIn});
				this.assets.torkild_hitarea.interactive = false;
			}

			this.torkildJump = function (){
				if(!this.torkildBtnIsActive && this.renderer){
					Tween.to(this.assets.torkild,0.2,{y:-18, ease:Quad.easeInOut});
					Tween.to(this.torkildContainer,0.2,{delay:0.3, y:(this.renderer.height/2) + 10, ease:Quad.easeInOut});
					Tween.to(this.torkildContainer,1.4,{delay:0.5, y:this.renderer.height/2, ease:Elastic.easeOut});
					Tween.to(this.assets.torkild,0.2,{delay:0.2, y:0, ease:Quad.easeIn});
				}
				if(this.renderer) {
					Tween.delayedCall(4, this.torkildJump.bind(this));
				}
			}

			this.setupInteractionEvents = function(){
				this.assets.torkild_hitarea.interactive = true;
				this.assets.torkild_hitarea.buttonMode = true;
				this.assets.torkild_hitarea.on('click', this.setTorkildToActive.bind(this));
				//this.assets.torkild_hitarea.on('mouseover', this.onMouseOver.bind(this));
				//this.assets.torkild_hitarea.on('mouseout', this.onMouseOut.bind(this));
			}
			this.onMouseOver = function(){
				if(!this.torkildBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.torkild_btn_glow,0.3,{alpha:1});
					//Tween.to(this.assets.torkild,tSpeed,{y:-9, ease:Quad.easeInOut});
				}
			}
			this.onMouseOut = function(){
				if(!this.torkildBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.torkild_btn_glow,0.3,{alpha:0});
					//Tween.to(this.assets.torkild,tSpeed,{y:0, ease:Quad.easeInOut});
				}
			}
			this.setTorkildToActive = function(){
				var tSpeed = 0.3;
				if(!this.torkildBtnIsActive){
					this.torkildBtnIsActive = true;


					this.node.torkild_hint = u.ae(this.node, "p", {"class":"torkild_hint"});
					this.node.torkild_hint.node = this.node;
					this.node.torkild_hint_span = u.ae(this.node.torkild_hint, "span", {"html":this.node.question.hint});

					this.node.torkild_close = u.ae(this.node.torkild_hint, "div", {"class":"torkild_hint_close"});
					this.node.torkild_close.node = this.node;

					u.ce(this.node.torkild_hint);
					this.node.torkild_close.clicked = this.node.torkild_hint.clicked = function() {
						this.node.torkild.setTorkildToActive();
					}

					this.node.scene.resized();

					u.ass(this.node.torkild_hint, {
						"display":"block",
					});
					u.a.transition(this.node.torkild_hint, "all 0.2s ease-in-out");
					u.ass(this.node.torkild_hint, {
						"opacity":1,
					});

				} 
				else {
					this.torkildBtnIsActive = false;

					this.node.torkild_hint.fullCollapse = function() {
						u.ass(this, {
							"display":"none",
						});
						this.parentNode.removeChild(this);
						delete this.node.torkild_hint;
						delete this.node.torkild_hint_span;

					}

					u.a.transition(this.node.torkild_hint, "all 0.2s ease-in-out");
					u.ass(this.node.torkild_hint, {
						"opacity":0
					});


					u.t.setTimer(this.node.torkild_hint, "fullCollapse", 200);
				}
		
			}

			this.changeDisplacementPosition = function () {
				this.displacementSprite.y -= 1;
				Tween.delayedCall(0.04, this.changeDisplacementPosition.bind(this));
			}




			// Start building stage

			this.torkildContainer = new PIXI.Container();
			this.stage.addChild(this.torkildContainer);
			this.torkildContainer.pivot.set(this.renderer.width/2,this.renderer.width/2);
			this.torkildContainer.x = this.renderer.width/2;
			this.torkildContainer.y = this.renderer.width/2;
			this.torkildContainer.addChild(this.assets.torkild_bg);
			this.torkildContainer.addChild(this.assets.torkild);
			this.torkildContainer.addChild(this.assets.torkild_top_circle);
			this.torkildContainer.addChild(this.assets.torkild_btn_inactive);
			this.torkildContainer.addChild(this.assets.torkild_btn_glow);
			this.displacementSprite = this.assets.torkild_tile;
			this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
			this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
			this.displacementFilter.scale.x = this.displacementFilter.scale.y = 15;
			this.assets.torkild_btn_glow.filters = [this.displacementFilter];
			this.torkildContainer.addChild(this.displacementSprite);
			this.changeDisplacementPosition();
			this.torkildContainer.addChild(this.assets.torkild_btn_active);
			this.torkildContainer.addChild(this.assets.torkild_hitarea);
			this.assets.torkild_btn_active.alpha = 1;
			this.assets.torkild_btn_glow.alpha = 0;
			this.assets.torkild_hitarea.x = (this.renderer.width-this.assets.torkild_hitarea.width)/2;
			this.assets.torkild_hitarea.y = (this.renderer.width-this.assets.torkild_hitarea.width)/2;
			this.assets.torkild_hitarea.alpha = 0.001;
			this.torkildContainer.scale.x = this.torkildContainer.scale.y = 0;  
			this.hoverDiff = 3;
			this.startY = this.torkildContainer.y;



			// this.node.div_torkild = u.ae(this.node, "div", {"class":"torkild"});
			// this.node.div_torkild.node = this.node;
			//
			//
			// this.node.div_torkild.over = function() {
			// 	this.node.torkild.onMouseOver();
			// }
			// this.node.div_torkild.out = function() {
			// 	this.node.torkild.onMouseOut();
			// }
			//
			//
			// if(u.e.event_support == "touch") {
			// 	u.e.addEvent(this.node.div_torkild, "touchstart", this.node.div_torkild.over);
			// 	u.e.addEvent(this.node.div_torkild, "touchend", this.node.div_torkild.out);
			// }
			// else {
			// 	u.e.addEvent(this.node.div_torkild, "mouseover", this.node.div_torkild.over);
			// 	u.e.addEvent(this.node.div_torkild, "mouseout", this.node.div_torkild.out);
			// }
			//
			// u.ce(this.node.div_torkild);
			// this.node.div_torkild.clicked = function() {
			// 	this.node.torkild.setTorkildToActive();
			// }


			// this.node.torkild_hint.org_width = this.node.torkild_hint.offsetWidth;
			// this.node.torkild_hint.org_height = this.node.torkild_hint.offsetHeight;
			// u.ass(this.node.torkild_hint, {
			// 	"width":"0px",
			// 	"height":"0px",
			// 	"opacity":0,
			// 	"margin-right":Math.round(this.node.torkild_hint.org_width/2)+"px"
			// });
			// u.ass(this.node.torkild_hint_span, {
			// 	"opacity":0
			// });



			this.is_ready = true;

			this.node.game_question.readyCheck();

//			this.build();

		}


		// Will be invoked from scene controller when it's time to start (scene could be waiting for other canvases)
		node.torkild.build = function() {
//			u.bug("node.torkild.build");
//			console.log(this);

			this.torkildIn();
			//this.torkildHover();
			Tween.delayedCall(4, this.torkildJump.bind(this));
		}


		node.torkild._destroy = function() {
//			u.bug("node.torkild.destroy");


			this.destroyed = function() {

				if(this.node.torkild_hint) {
					this.node.torkild_hint.parentNode.removeChild(this.node.torkild_hint);
					delete this.node.torkild_hint;
				}

				// this.node.div_torkild.parentNode.removeChild(this.node.div_torkild);
				// delete this.node.div_torkild;

//				this.renderer.view.parentNode.removeChild(this.renderer.view);
				this.destroy(true);
				delete this.node.torkild;
			}

			if(this.node.torkild_hint) {
				u.a.transition(this.node.torkild_hint, "all 0.2s ease-in-out");
				u.ass(this.node.torkild_hint, {
					"opacity":0
				});
			}

			this.torkildOut();

			u.t.setTimer(this, "destroyed", 500);

		}

		// start loading assets
		u.loadAssets(node.torkild);

	}


	//	starts canvas playback
	this.build = function(node) {
//		u.bug("torkild.build:" + u.nodeId(node));

		node.torkild.build();

	}

}