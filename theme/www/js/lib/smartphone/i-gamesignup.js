Util.Objects["GameSignup"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node) {
//		u.bug("GameSignup.init:" + u.nodeId(node));

		node.game_signup = u.createPIXIApp({"classname":"game_signup", "height":600});
		node.game_signup.node = node;
		node.appendChild(node.game_signup.renderer.view);

		// Load asses
		node.game_signup.loadQueue = [
			"screen.png",
		];


		// Will be invoked when assets have loaded
		node.game_signup.ready = function() {
//			u.bug("node.game_signup.ready");

			if(this.node.scene.current_round_index !== false && !this.node.scene.all_rounds_over && this.node.scene.correct_answers) {

				// create signup wrapper
				this.node.div_signup = u.ae(this.node, "div", {"class":"signup"});
				this.node.div_signup.node = this.node;

				this.node.div_signup.response = function(response) {
//					u.bug("page.overlayResponse:" + u.nodeId(this));

					this._form = u.ae(this, u.qs("div.scene form", response));
					this._form.node = this.node;

					this.h2 = u.qs("h2", this._form);
					this.fieldset_data = u.qs("fieldset.data", this._form);
					this.fieldset_permissions = u.qs("fieldset.permissions", this._form);
					this.ul_actions = u.qs("ul.actions", this._form);

					this.bn_continue = u.ae(this.node, "div", {"class":"continue"});
					this.bn_continue.node = this.node;

					u.f.addField(this._form, {"type":"hidden", "name":"answers", "value":JSON.stringify(this.node.scene.quiz_answers)});
					u.f.addField(this._form, {"type":"hidden", "name":"round", "value":this.node.scene.current_round_index});

					// console.log(this.h2);

					u.f.init(this._form);


					u.textscaler(this._form, {
						"min_width":320,
						"max_width":1024,
						"unit":"px",
						".field.checkbox label":{
							"min_size":10,
							"max_size":36
						}
					});


					// this._form.fields["email"].val("martin@think.dk");
					// this._form.fields["phone"].val("123456");
					// this._form.fields["name"].val("martin");
					// this._form.fields["lastname"].val("nielsen");
					// this._form.fields["address"].val("vejen");
					// this._form.fields["city"].val("byen");
					// this._form.fields["postal"].val("1234");



					this._form.submitted = function() {

						if(!this.submitting) {
							this.response = function(response) {

								if(response && response.cms_status == "success") {

									this.node.game_signup._destroy("receipt");

									// remember that the user has answered this round
									u.saveCookie("stofa_ved_round_"+this.node.scene.current_round_index, 1, {"expires":"Mon, 01-May-2017 05:00:00 GMT"});

								}
								else {

									this.submitting = false;
									page.error("signup");
								}

							}
							this.submitting = true;
							u.request(this, this.action, {"data":u.f.getParams(this), "method":"post"});

						}


					}


					this.bn_continue.over = function() {
						if(this.node.btn_continue) {
							this.node.btn_continue.onMouseOver();
						}
					}
					this.bn_continue.out = function() {
						if(this.node.btn_continue) {
							this.node.btn_continue.onMouseOut();
						}
					}

					if(u.e.event_support == "touch") {
						u.e.addEvent(this.bn_continue, "touchstart", this.bn_continue.over);
						u.e.addEvent(this.bn_continue, "touchend", this.bn_continue.out);
					}
					else {
						u.e.addEvent(this.bn_continue, "mouseover", this.bn_continue.over);
						u.e.addEvent(this.bn_continue, "mouseout", this.bn_continue.out);
					}


					u.ce(this.bn_continue);
					this.bn_continue.clicked = function() {

						// going to step 3
						if(this.step2) {

							this.node.div_signup._form.fields["email"].used = true;
							this.node.div_signup._form.fields["phone"].used = true;
							this.node.div_signup._form.fields["name"].used = true;
							this.node.div_signup._form.fields["lastname"].used = true;
							this.node.div_signup._form.fields["address"].used = true;
							this.node.div_signup._form.fields["city"].used = true;
							this.node.div_signup._form.fields["postal"].used = true;
//							this.node.div_signup._form.fields["email"].used = true;

							u.f.validate(this.node.div_signup._form.fields["email"]);
							u.f.validate(this.node.div_signup._form.fields["phone"]);
							u.f.validate(this.node.div_signup._form.fields["name"]);
							u.f.validate(this.node.div_signup._form.fields["lastname"]);
							u.f.validate(this.node.div_signup._form.fields["address"]);
							u.f.validate(this.node.div_signup._form.fields["city"]);
							u.f.validate(this.node.div_signup._form.fields["postal"]);


							if(
								u.f.validate(this.node.div_signup._form.fields["email"]) &&
								u.f.validate(this.node.div_signup._form.fields["phone"]) &&
								u.f.validate(this.node.div_signup._form.fields["name"]) &&
								u.f.validate(this.node.div_signup._form.fields["lastname"]) &&
								u.f.validate(this.node.div_signup._form.fields["address"]) &&
								u.f.validate(this.node.div_signup._form.fields["city"]) &&
								u.f.validate(this.node.div_signup._form.fields["postal"])
//								u.f.validate(this.node.div_signup._form.fields["email"]) &&
							
							) {

								this.node.game_signup.build_step3();

							}

						}
						// going to step 2
						else {

							this.node.div_signup._form.fields["email"].used = true;

							if(u.f.validate(this.node.div_signup._form.fields["email"])) {

								u.a.transition(this.node.btn_continue.renderer.view, "all 0.3s ease-in-out");
								u.ass(this.node.btn_continue.renderer.view, {
									"opacity":0
								});

								u.ac(this.node.div_signup._form.fields["email"].field, "loading");

								this.response = function(response) {

									// user exists - just submit values
									if(response && response.cms_status == "success" && response.cms_object && response.cms_object.user_exists) {

										console.log("user exists")

										// just submit user answers with email
										this.response = function(response) {

											if(response && response.cms_status == "success") {

												this.node.game_signup._destroy("receipt");

												// remember that the user has answered this round
												u.saveCookie("stofa_ved_round_"+this.node.scene.current_round_index, 1, {"expires":"Mon, 01-May-2017 05:00:00 GMT"});

											}
											else {

												u.a.transition(this.node.btn_continue.renderer.view, "all 0.3s ease-in-out");
												u.ass(this.node.btn_continue.renderer.view, {
													"opacity":1
												});

												u.rc(this.node.div_signup._form.fields["email"].field, "loading");

												page.error("signup");

											}

										}
										u.request(this, "/signup/saveParticipantAnswers", {"data":u.f.getParams(this.node.div_signup._form), "method":"post"});


										// remember that the user has answered this round
		//								u.saveCookie("stofa_ved_round_"+this.node.scene.current_round_index, 1, {"expires":"Mon, 01-May-2017 05:00:00 GMT"});

									}

									// user already played this round - go to already played screen
									else if(response && response.cms_status == "success" && response.cms_object && response.cms_object.already_played) {

		//								console.log("already played")
										// go to error screen
										this.node.game_signup._destroy("already_played");


										// remember that the user has answered this round
										u.saveCookie("stofa_ved_round_"+this.node.scene.current_round_index, 1, {"expires":"Mon, 01-May-2017 05:00:00 GMT"});

									}

									// user does not exist - show full form
									else {

										this.node.game_signup.build_step2();

									}
								}

								u.request(this, "/signup/checkParticipant", {"data":u.f.getParams(this.node.div_signup._form), "method":"post"});
								
							}

						}

					}



					this._form.actions["signup"].over = function() {
						if(this._form.node.btn_submit) {
							this._form.node.btn_submit.onMouseOver();
						}
					}
					this._form.actions["signup"].out = function() {
						if(this._form.node.btn_submit) {
							this._form.node.btn_submit.onMouseOut();
						}
					}

					if(u.e.event_support == "touch") {
						u.e.addEvent(this._form.actions["signup"], "touchstart", this._form.actions["signup"].over);
						u.e.addEvent(this._form.actions["signup"], "touchend", this._form.actions["signup"].out);
					}
					else {
						u.e.addEvent(this._form.actions["signup"], "mouseover", this._form.actions["signup"].over);
						u.e.addEvent(this._form.actions["signup"], "mouseout", this._form.actions["signup"].out);
					}


//					u.ce(this._form.actions["cancel"]);
					this._form.actions["cancel"].clicked = function() {
						this._form.node.game_signup._destroy("game");
					}


					this._form.actions["cancel"].over = function() {
						if(this._form.node.btn_regret) {
							this._form.node.btn_regret.onMouseOver();
						}
					}
					this._form.actions["cancel"].out = function() {
						if(this._form.node.btn_regret) {
							this._form.node.btn_regret.onMouseOut();
						}
					}

					if(u.e.event_support == "touch") {
						u.e.addEvent(this._form.actions["cancel"], "touchstart", this._form.actions["cancel"].over);
						u.e.addEvent(this._form.actions["cancel"], "touchend", this._form.actions["cancel"].out);
					}
					else {
						u.e.addEvent(this._form.actions["cancel"], "mouseover", this._form.actions["cancel"].over);
						u.e.addEvent(this._form.actions["cancel"], "mouseout", this._form.actions["cancel"].out);
					}


					page.resized();


					this.node.game_signup.is_ready = true;
					this.node.game_signup.readyCheck();

				}
				u.request(this.node.div_signup, "/signup");


				u.o.BtnContinue.init(this.node);
				u.o.BtnSubmit.init(this.node);
//				u.o.BtnRegret.init(this.node);


				// set kontakt header in game screen
				this.node.game_screen.setHeader("kontakt_header");


			}
			// error
			else {
			
				page.error();
			}


//			this.is_ready = true;

			// Let scene know we are ready to start playback
//			page.cN.scene.build();
//			this.readyCheck();

		}

		node.game_signup.readyCheck = function() {

			if(
				(!this.node.game_signup || (this.node.game_signup && this.node.game_signup.is_ready))
				&&
				(!this.node.btn_regret || (this.node.btn_regret && this.node.btn_regret.is_ready))
				&&
				(!this.node.btn_submit || (this.node.btn_submit && this.node.btn_submit.is_ready))
				&&
				(!this.node.btn_continue || (this.node.btn_continue && this.node.btn_continue.is_ready))
			) {

				this.build();

			}

		}


		node.game_signup.build = function() {
//			u.bug("node.game_signup.build");

//			u.o.GameScreen.build(this.node);


			// console.log("h2");
			// console.log(this.node.div_signup.h2)

			if(this.node.div_signup.h2) {
				u.a.transition(this.node.div_signup.h2, "all 0.2s ease-in-out");
				u.ass(this.node.div_signup.h2, {
					"opacity": 1
				});
			}

			if(this.node.div_signup._form) {
				u.a.transition(this.node.div_signup._form, "all 0.2s ease-in-out 0.1s");
				u.ass(this.node.div_signup._form, {
					"opacity": 1
				});
			}


			// show continue button
			u.o.BtnContinue.build(this.node);

		}

		node.game_signup.build_step2 = function() {
//			u.bug("node.game_signup.build_step2");


			this.node.div_signup.bn_continue.step2 = true;


//			delete this.node.div_signup._form.fields["email"].updated;


			// remove loader from input
			u.rc(this.node.div_signup._form.fields["email"].field, "loading");

			this.node.div_signup._form.fields["email"].field.transitioned = function() {
				u.ass(this, {
					"display": "none"
				});
			}
			u.a.transition(this.node.div_signup._form.fields["email"].field, "all 0.3s ease-in-out 0.2s");
			u.ass(this.node.div_signup._form.fields["email"].field, {
				"opacity": 0
			});


			if(this.node.div_signup.h2) {
				this.node.div_signup.h2.transitioned = function() {
					u.ass(this, {
						"display": "none"
					});
				}
				u.a.transition(this.node.div_signup.h2, "all 0.2s ease-in-out");
				u.ass(this.node.div_signup.h2, {
					"opacity": 0
				});
			}

			u.a.transition(this.node.btn_continue.renderer.view, "all 0.3s ease-in-out");
			u.ass(this.node.btn_continue.renderer.view, {
				"opacity":1
			});


			if(this.node.div_signup.bn_continue) {
//				this.node.div_signup.bn_continue.parentNode.removeChild(this.node.div_signup.bn_continue);
				// u.ass(this.node.div_signup.bn_continue, {
				// 	"display": "none"
				// });
			}


			// if(this.node.btn_continue) {
			// 	this.node.btn_continue._destroy();
			// }




			u.a.transition(this.node.div_signup.fieldset_data, "all 0.3s ease-in-out 0.2s");
			u.ass(this.node.div_signup.fieldset_data, {
				"top": 0
			});


			// u.a.transition(this.node.div_signup._form.fields["email"], "all 0.3s ease-in-out 0.2s");
			// u.ass(this.node.div_signup._form.fields["email"], {
			// 	"padding-top": "8px",
			// 	"padding-bottom": "6px",
			// 	"width":"259px"
			// });




			var i = 0;
			for(x in this.node.div_signup._form.fields) {
				if(this.node.div_signup._form.fields[x].field && x != "email") {
					u.ass(this.node.div_signup._form.fields[x].field, {
						"display":"block"
					});

					u.a.transition(this.node.div_signup._form.fields[x].field, "all 0.3s ease-in-out "+(300 + (100*i))+"ms");
					u.ass(this.node.div_signup._form.fields[x].field, {
						"opacity":1
					});

					i++;

				}
			}


		}


		node.game_signup.build_step3 = function() {
//			console.log("node.game_signup.build_step3");


			if(this.node.btn_continue) {
				this.node.btn_continue._destroy();
			}

			if(this.node.div_signup.bn_continue) {
				this.node.div_signup.bn_continue.parentNode.removeChild(this.node.div_signup.bn_continue);
				delete this.node.div_signup.bn_continue;
			}

			u.a.transition(this.node.div_signup.fieldset_data, "all 0.3s ease-in-out");
			u.ass(this.node.div_signup.fieldset_data, {
				"opacity": 0
			});



			u.a.transition(this.node.div_signup.fieldset_permissions, "all 0.3s ease-in-out 0.2s");
			u.ass(this.node.div_signup.fieldset_permissions, {
				"display": "block",
				"opacity":1
			});

			u.ass(this.node.div_signup.ul_actions, {
				"display": "block",
			});
			u.a.transition(this.node.div_signup.ul_actions, "all 0.3s ease-in-out 0.2s");
			u.ass(this.node.div_signup.ul_actions, {
				"opacity":1
			});

			u.o.BtnSubmit.build(this.node);
//			u.o.BtnRegret.build(this.node);

		}



		node.game_signup._destroy = function(onto) {
//			u.bug("node.game_signup.destroy:" + onto);

			this.onto = onto;

			this.destroyed = function() {

				if(this.node.div_signup.bn_continue) {
					this.node.div_signup.bn_continue.parentNode.removeChild(this.node.div_signup.bn_continue);
				}

				this.node.div_signup.parentNode.removeChild(this.node.div_signup);
				delete this.node.div_signup;

				this.destroy(true);
				delete this.node.game_signup;



				if(this.onto == "game") {

					// initialize bricks
					u.o.GameReceipt.init(this.node);

				}
				else if(this.onto == "already_played") {

					// game already played screen
					u.o.GameSignupAlreadyPlayed.init(this.node);

				}
				else {

					u.stats.event(this.node, {
						"eventCategory":"signups",
						"eventAction":"complete",
						"eventLabel":"signups"
					});

					// initialize signup receipt
					u.o.GameSignupReceipt.init(this.node);

				}

			}

			if(this.node.btn_continue) {
				this.node.btn_continue._destroy();
			}

			if(this.node.btn_submit) {
				this.node.btn_submit._destroy();
			}

			if(this.node.btn_regret) {
				this.node.btn_regret._destroy();
			}


			if(this.node.div_signup._form) {
				u.a.transition(this.node.div_signup._form, "all 0.3s ease-in-out");
				u.ass(this.node.div_signup._form, {
					"opacity": 0
				});
			}

			u.t.setTimer(this, "destroyed", 300);

		}

		// start loading assets
		u.loadAssets(node.game_signup);

	}


	// // starts canvas playback
	// this.build = function(node) {
	// 	u.bug("GameSignup.build");
	//
	// 	node.game_signup.build();
	//
	// }

}
