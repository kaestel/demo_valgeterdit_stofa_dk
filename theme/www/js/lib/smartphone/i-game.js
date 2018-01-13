Util.Objects["game"] = new function() {
	this.init = function(scene) {

		scene.resized = function() {
//			u.bug("scene.resized:" + u.nodeId(this));

			var i, node;

			var factor = (page.browser_w/640);

			if(this.game.div_question) {
				u.ass(this.game.div_question, {
					"padding-top": Math.round(factor * 246) + "px",
					"padding-left": Math.round(factor * 115) + "px",
					"padding-right": Math.round(factor * 115) + "px",
				});
				u.ass(this.game.div_question.h2, {
					"height": Math.round(factor * 255) + "px"
				});
				for(i = 0; node = this.game.div_question.answers[i]; i++) {
					u.ass(node, {
						"height": Math.round(factor * 70) + "px",
						"margin-bottom": Math.round(factor * 11) + "px",
						"padding-left": Math.round(factor * 55) + "px",
					});
				}


			}

			if(this.game.div_receipt) {
				u.ass(this.game.div_receipt, {
					"margin-top": Math.round(factor * 246) + "px",
					"margin-left": Math.round(factor * 99) + "px",
					"margin-right": Math.round(factor * 99) + "px",
					"width": Math.round(factor * 440) + "px",
					"height": Math.round(factor * 576) + "px"
				});
				u.ass(this.game.table_receipt, {
					"height": Math.round(factor * 250) + "px"
				});


				if(this.game.btn_play_more) {

					if(u.hc(this.game.btn_play_more.renderer.view, "single")) {
						u.ass(this.game.btn_play_more.renderer.view, {
							"top": Math.round(factor * 655) + "px"
						});
					}
					else {
						u.ass(this.game.btn_play_more.renderer.view, {
							"top": Math.round(factor * 805) + "px"
						});
					}
				}

				if(this.game.btn_signup) {

					if(u.hc(this.game.btn_signup.renderer.view, "single")) {
						u.ass(this.game.btn_signup.renderer.view, {
							"top": Math.round(factor * 705) + "px"
						});
					}
					else {
						u.ass(this.game.btn_signup.renderer.view, {
							"top": Math.round(factor * 705) + "px"
						});
					}
				}

				if(this.game.btn_signup || this.game.btn_play_more) {

					if(!this.game.btn_signup) {
						u.ass(this.game.div_table, {
							"top": Math.round(factor * 655) + "px",
							"left": Math.round(factor * 0) + "px",
							"width": Math.round(factor * 640) + "px",
							"height": Math.round(factor * 120) + "px"
						});
					}
					else if(!this.game.btn_play_more) {
						u.ass(this.game.div_table, {
							"top": Math.round(factor * 715) + "px",
							"left": Math.round(factor * 0) + "px",
							"width": Math.round(factor * 640) + "px",
							"height": Math.round(factor * 120) + "px"
						});
					}
					else {
						u.ass(this.game.div_table, {
							"top": Math.round(factor * 715) + "px",
							"left": Math.round(factor * 0) + "px",
							"width": Math.round(factor * 640) + "px",
							"height": Math.round(factor * 220) + "px"
						});
					}


					if(this.game.game_receipt.confirm_box) {
						u.ass(this.game.game_receipt.confirm_box, {
							"top": Math.round((factor * 740) - 185) + "px"
						});
					}


					if(this.game.div_receipt.bn_send) {
						u.ass(this.game.div_receipt.bn_send, {
							"height": Math.round(factor * 100) + "px"
						});
					}

					if(this.game.div_receipt.bn_play) {
						u.ass(this.game.div_receipt.bn_play, {
							"height": Math.round(factor * 100) + "px"
						});
					}

				}

				
				// if(this.game.ticket) {
				// 	u.ass(this.game.ticket.renderer.view, {
				// 		"top": Math.round(factor * 585) + "px",
				// 		"left": Math.round(factor * 65) + "px",
				// 		"width": Math.round(factor * 200) + "px",
				// 		"height": Math.round(factor * 200) + "px"
				// 	});
				// }

				if(this.game.div_receipt.h3) {
					u.ass(this.game.div_receipt.h3, {
						"left": Math.round(factor * 13) + "px",
						"top": Math.round(factor * 375) + "px",
						"width": Math.round(factor * 420) + "px",
						"height": Math.round(factor * 120) + "px"
					});
				}


			}

			if(this.game.div_signup) {

				u.ass(this.game.div_signup, {
					"margin-top": Math.round(factor * 246) + "px",
					"margin-left": Math.round(factor * 99) + "px",
					"margin-right": Math.round(factor * 99) + "px",
					"width": Math.round(factor * 440) + "px",
					"height": Math.round(factor * 576) + "px"
				});


				if(this.game.btn_continue && !this.game.div_signup.bn_continue.step2) {
					u.ass(this.game.div_signup.fieldset_data, {
						"top": Math.round((factor * 100) + 100) + "px",
					});
				}


				if(this.game.div_signup.fieldset_data) {
					u.ass(this.game.div_signup.fieldset_data, {
						"width": Math.round(factor * 440) + "px",
					});
				}

				if(this.game.div_signup.fieldset_permissions) {
					u.ass(this.game.div_signup.fieldset_permissions, {
						"width": Math.round(factor * 440) + "px",
					});
				}

				if(this.game.btn_continue) {

					u.ass(this.game.btn_continue.renderer.view, {
						"top": Math.round(factor * 675) + "px"
					});

					if(this.game.div_signup.bn_continue) {
						u.ass(this.game.div_signup.bn_continue, {
							"top": Math.round(factor * 695) + "px",
							"height": Math.round(factor * 100) + "px"
						});
					}

					var input_padding = Math.round(factor * 30) - 13;
					for(x in this.game.div_signup._form.fields) {

						if(this.game.div_signup._form.fields[x].field) {
							u.ass(this.game.div_signup._form.fields[x], {
								"padding-top": (input_padding+1) + "px",
								"padding-bottom": (input_padding-1) + "px",
							});
						}

					}
				}


				// if(this.game.btn_regret) {
				// 	u.ass(this.game.btn_regret.renderer.view, {
				// 		"top": Math.round(factor * 805) + "px"
				// 	});
				// }
				if(this.game.btn_submit) {
					u.ass(this.game.btn_submit.renderer.view, {
						"top": Math.round(factor * 675) + "px"
					});
				}

				if(this.game.div_signup.ul_actions) {
					u.ass(this.game.div_signup.ul_actions, {
						"top": Math.round(factor * 430) + "px"
					});
				}

			}

			if(this.game.torkild_hint_span) {
				u.ass(this.game.torkild_hint_span, {
					"padding-top": Math.round(factor * 450) + "px"
				});
			}

			if(this.game.div_button_underlay) {
				u.ass(this.game.div_button_underlay, {
					"height": Math.round(factor * 200) + "px",
					"top": Math.round(factor * 720) + "px"
				});
			}

			if(this.game.div_signup_receipt) {

				u.ass(this.game.div_signup_receipt, {
					"margin-top": Math.round(factor * 246) + "px",
					"margin-left": Math.round(factor * 99) + "px",
					"margin-right": Math.round(factor * 99) + "px",
					"width": Math.round(factor * 440) + "px",
					"height": Math.round(factor * 576) + "px"
				});

			}

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


			this.game.buttonUnderlay = function(state) {

				if(state && !this.div_button_underlay) {
					this.div_button_underlay = u.ae(this, "div", {"class":"buttonUnderlay"});
				}
				else if(!state && this.div_button_underlay){
					this.div_button_underlay.parentNode.removeChild(this.div_button_underlay);
					delete this.div_button_underlay;
				}

			}

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
					// u.o.GameSignupReceipt.init(this);
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
