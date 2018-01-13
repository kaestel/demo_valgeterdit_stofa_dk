Util.Objects["intro"] = new function() {
	this.init = function(scene) {

		scene.resized = function() {
//			u.bug("scene.resized:" + u.nodeId(this));

			if(this.intro.intro_scene) {

				u.ass(this.intro.intro_scene.renderer.view, {
					"margin-top": "-200px"
				})
	
			}
		}

		scene.scrolled = function() {
//			u.bug("scene.scrolled:" + u.nodeId(this))
		}

		scene.ready = function() {
//			u.bug("scene.ready:" + u.nodeId(this));

			this.intro = u.ae(this, "div", {"class":"intro"});
			this.intro.scene = this;

			// will callback to scene.build, when assets are loaded and IntroScreen stage is ready
			u.o.IntroScene.init(this.intro);
		}


		scene.build = function() {
//			u.bug("scene.build (intro)");

			// ensure correct positioning before building
			this.resized();


			// show front container
			u.a.transition(this.intro, "none");
			u.ass(this.intro, {
				"opacity":1
			});


			// start building
			u.o.IntroScene.build(this.intro);

		}

		scene.destroy = function() {
//			u.bug("scene.destroy (intro)");

			// is there any intro to destroy
			if(this.intro) {

				// remove intro element
				this.intro.parentNode.removeChild(this.intro);

			}

			u.o.front.init(this);

		}

		// scene is ready
		scene.ready();
	}
}
