Util.Objects["front"] = new function() {
	this.init = function(scene) {

		scene.resized = function() {
//			u.bug("scene.resized:" + u.nodeId(this));

			if(this.front.start_scene) {

			}

		}

		scene.scrolled = function() {
//			u.bug("scene.scrolled:" + u.nodeId(this))
		}

		scene.ready = function() {
//			u.bug("scene.front.ready");

			this.front = u.ae(this, "div", {"class":"front"});
			this.front.scene = this;


			// will callback to scene.build, when assets are loaded and StartScreen stage is ready
			u.o.StartScene.init(this.front);

		}

		


		scene.build = function() {
//			u.bug("scene.front.build")


			// ensure correct positioning before building
			this.resized();


			// show front container
			u.a.transition(this.front, "none");
			u.ass(this.front, {
				"opacity":1
			});


			// start building
			u.o.StartScene.build(this.front);


			// init navigation
			page.initNavigation();



		}

		scene.destroy = function() {

			if(this.front) {

				this.front.parentNode.removeChild(this.front);

			}

			u.o.game.init(this);

		}



		// scene is ready
		scene.ready();
	}
}
