Util.Objects["game"] = new function() {
	this.init = function(scene) {

		scene.resized = function() {
//			u.bug("scene.resized:" + u.nodeId(this));

			if(this.game.game_screen) {
				u.ass(this.game.game_screen.renderer.view, {
					"margin-top": "-200px"
				});
			}

			if(this.game.game_selector) {
				u.ass(this.game.game_selector.renderer.view, {
					"margin-top": "-200px"
				});
			}

			if(this.game.game_bricks) {
				u.ass(this.game.game_bricks.renderer.view, {
					"margin-top": "-200px"
				});
			}

			if(this.game.game_already_played) {
				u.ass(this.game.game_already_played.renderer.view, {
					"margin-top": "-200px"
				});
			}

			// if(this.game.game_question) {
			// 	u.ass(this.game.game_question.renderer.view, {
			// 		"margin-top": "-200px"
			// 	})
			// }

		}

		scene.scrolled = function() {
//			u.bug("scene.scrolled:" + u.nodeId(this))
		}

		scene.ready = function() {
//			u.bug("scene.game.ready");

			this.game = u.ae(this, "div", {"class":"game"});
			this.game.scene = this;


			this.game.game_bricks = false;
			this.game.game_screen = false;
			this.game.game_selector = false;
			this.game.game_already_played = false;


			page.showVedLogo();

			// will callback to scene.build, when assets are loaded and StartScreen stage is ready
//			u.o.QuizScreen.init(this.game);

//			u.o.CategoryScreen.init(this.game);


			// load quiz
			this.game.response = function(response) {

				// Serverside provided game timestamp (to avoid issues with timezones and local browser settings)
				var game_timestamp = new Date(page.getAttribute("data-date")).getTime();
				this.scene.current_round_index = false;

				// did we get a valid quiz feed
				if(response && response.rounds) {

					this.scene.quiz = response;


					// get answers from cookie
					this.scene.quiz_answers = JSON.parse(u.getCookie("stofa_ved_answers")) || {};



					// find current round if it exists
					var i, round;
					for(i = 0; round = this.scene.quiz.rounds[i]; i++) {

						if(new Date(round.start).getTime() <= game_timestamp && new Date(round.end).getTime() >= game_timestamp) {
							this.scene.current_round_index = i;
							break;
						}

					}

					// initialize game screen
					u.o.GameScreen.init(this);

					// this.scene.correct_answers = 1;
					// u.o.GameSignup.init(this);
					// return;

					this.scene.correct_answers = 0;
					this.scene.total_answers = 0;
					this.scene.all_rounds_over = false;


					if(this.scene.current_round_index !== false) {

						for(x in this.scene.quiz_answers) {
							if(x.match("r"+this.scene.current_round_index)) {

								if(this.scene.quiz_answers[x]) {
									this.scene.correct_answers++;
								}

								this.scene.total_answers++;

							}
						}

						var round_answered = u.getCookie("stofa_ved_round_" + this.scene.current_round_index);

						if(this.scene.total_answers < 9 && !round_answered) {

							// initialize bricks (and set it to first-entrance)
							u.o.GameBricks.init(this, "first");
						}

						else {
							// initialize bricks (and set it to first-entrance)
							u.o.GameAlreadyPlayed.init(this);
						}

					}


					else {
						this.scene.all_rounds_over = true;
						
						// initialize bricks (and set it to first-entrance)
						u.o.GameSelector.init(this, "first");
					}

				}
				else {

//					u.bug("could not load quiz");
					page.error("general");

				}

			}
			u.request(this.game, "/quiz/quiz.json?rev=4");

		}

		


		scene.build = function() {
//			u.bug("scene.game.build")

			// only continue when screen, categories and game data is ready
			if(this.quiz && this.game.game_screen.is_ready && ((this.game.game_bricks && this.game.game_bricks.is_ready) || (this.game.game_selector && this.game.game_selector.is_ready) || (this.game.game_already_played && this.game.game_already_played.is_ready))) {

				// ensure correct positioning before building
				this.resized();


				// show front container
				u.a.transition(this.game, "none");
				u.ass(this.game, {
					"opacity":1
				});





				// start building
				if(!this.game.game_screen.is_built) {
					u.o.GameScreen.build(this.game);
				}

				// Did we find valid game round and is game still on
				if(this.game.game_bricks.is_ready) {
//					u.bug("round found")
//					console.log(game_round);


					// start building
					u.o.GameBricks.build(this.game);

				}
				// game has been played
				else if(this.game.game_already_played.is_ready) {

					u.o.GameAlreadyPlayed.build(this.game);

				}
				else if(this.game.game_selector.is_ready) {

					u.o.GameSelector.build(this.game);

//					u.bug("NO matching round - expect all rounds are over. Go to final gaming overview.");

				}



			}

		}

		scene.destroy = function() {

			if(this.game) {

				this.game.transitioned = function() {
					// remove intro element
					this.parentNode.removeChild(this);

					// delete intro reference
					delete this.scene.game;

					// continue to game
//					u.o.game.init(this.scene);
				}

				u.a.transition(this.game, "all 0.5s ease-in-out");
				u.ass(this.game, {
					"opacity":0
				});

			}
			else {
//				u.o.game.init(this.scene);
			}

		}



		// scene is ready
		scene.ready();
	}
}
