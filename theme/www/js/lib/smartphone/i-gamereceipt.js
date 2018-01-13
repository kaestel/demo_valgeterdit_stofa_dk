Util.Objects["GameReceipt"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node) {
//		u.bug("GameReceipt.init:" + u.nodeId(node));

		node.game_receipt = u.createPIXIApp({"classname":"game_receipt"});
		node.game_receipt.node = node;
		node.appendChild(node.game_receipt.renderer.view);

		// Load asses
		node.game_receipt.loadQueue = [
			"screen_footer.png",
			"confirm_bg.png",
		];


		// Will be invoked when assets have loaded
		node.game_receipt.ready = function() {
//			u.bug("node.game_receipt.ready");


			this.node.ticket = false;
			this.node.btn_play_more = false;



			if(this.node.scene.current_round_index !== false && this.node.scene.current_category_index !== false && this.node.scene.current_question_index !== false) {

				this.node.buttonUnderlay(true);

				// create receipt wrapper
				this.node.div_receipt = u.ae(this.node, "div", {"class":"receipt"});

				this.node.table_receipt = u.ae(this.node.div_receipt, "div", {"class":"table"});
				this.node.cell_receipt = u.ae(this.node.table_receipt, "div", {"class":"cell"});

				if(this.node.scene.quiz_answers["r"+this.node.scene.current_round_index+"c"+this.node.scene.current_category_index+"q"+this.node.scene.current_question_index]) {
					this.node.div_receipt.h2 = u.ae(this.node.cell_receipt, "h2", {"html":"Svaret er rigtigt"});
				}
				else {
					this.node.div_receipt.h2 = u.ae(this.node.cell_receipt, "h2", {"html":"Svaret er forkert"});
				}

//				this.node.div_receipt.p = u.ae(this.node.cell_receipt, "p", {"html": this.node.scene.quiz.rounds[this.node.scene.current_round_index].categories[this.node.scene.current_category_index].questions[this.node.scene.current_question_index].answer_text.replace(/(http[s]:\/\/[^ $]+)/, '<a href="$1" target="_blank">$1</a>')});

				var answer_text = this.node.scene.quiz.rounds[this.node.scene.current_round_index].categories[this.node.scene.current_category_index].questions[this.node.scene.current_question_index].answer_text;
				if(!answer_text.match(/<a/i)) {
					answer_text = answer_text.replace(/(http[s]:\/\/[^ $]+)/, '<a href="$1" target="_blank">$1</a>')
				}

				this.node.div_receipt.p = u.ae(this.node.cell_receipt, "p", {"html": answer_text});


				u.textscaler(this.node.div_receipt, {
					"min_width":320,
					"max_width":1024,
					"unit":"px",
					"h2":{
						"min_size":16,
						"max_size":36
					},
					".cell p":{
						"min_size":11,
						"max_size":30
					},
					"> h3":{
						"min_size":11,
						"max_size":30
					}

				});



				this.node.scene.correct_answers = 0;
				this.node.scene.total_answers = 0;
				for(x in this.node.scene.quiz_answers) {
					if(x.match("r"+this.node.scene.current_round_index)) {

						if(this.node.scene.quiz_answers[x]) {
							this.node.scene.correct_answers++;
						}

						this.node.scene.total_answers++;

					}
				}

				this.node.div_table = u.ae(this.node, "div", {"class":"actions_table"});
				var div_cell = u.ae(this.node.div_table, "div", {"class":"actions_cell"});
				var ul_actions = u.ae(div_cell, "ul", {"class":"actions"});


				if(!this.node.scene.all_rounds_over) {

					if(this.node.scene.correct_answers) {


//						u.o.ticket.init(this.node);



						this.node.div_receipt.h3 = u.ae(this.node.div_receipt, "h3", {"class":"status", "html":"<span>Du har " + u.pluralize(this.node.scene.correct_answers, "lod", "lodder") + " og kan deltage i lodtrækningen om ugens præmie:</span> <span class=\"prize\">"+this.node.scene.quiz.rounds[this.node.scene.current_round_index].prize+"</span>"});


						u.o.BtnSignup.init(this.node);

						if(this.node.scene.total_answers == 9) {
							u.ac(this.node.btn_signup.renderer.view, "single");
						}


						this.node.div_receipt.bn_send = u.ae(ul_actions, "li", {"class":"send"});
						this.node.div_receipt.bn_send.node = this.node;


						this.confirmSignup = function() {

							if(this.node.scene.total_answers < 9) {

						
								this.confirm_box = u.ae(this.node, "div", {"class":"confirm"});

								page.resized();

								u.o.BtnSignupConfirm.init(this.node);

								this.confirm_h3 = u.ae(this.confirm_box, "h3", {"html":"Er du sikker på, at du har svaret på alt, hvad du vil?"})
								this.confirm_p = u.ae(this.confirm_box, "p", {"html":"Når du indsender dine lodder, kan du ikke deltage igen før næste uge."})


								u.a.transition(this.confirm_box, "all 0.3s ease-in-out");
								u.ass(this.confirm_box, {
									"opacity": 1
								});

							}
							else {
								this.signupConfirmed();
							}
//							console.log("confirmSignup");
//							this.signupConfirmed();

						}
						this.signupConfirmed = function() {
							this._destroy("signup");
						}


					

					}

					// only show "play more" if there is more to play
					if(this.node.scene.total_answers < 9) {


						u.o.BtnPlayMore.init(this.node);

						if(!this.node.btn_signup) {
							u.ac(this.node.btn_play_more.renderer.view, "single");
						}


	 					this.node.div_receipt.bn_play = u.ae(ul_actions, "li", {"class":"play"});
	 					this.node.div_receipt.bn_play.node = this.node;

					}

				}
				else {

					u.o.BtnPlayMoreGameOver.init(this.node);

					u.ac(this.node.btn_play_more.renderer.view, "single");


 					this.node.div_receipt.bn_play = u.ae(ul_actions, "li", {"class":"play"});
 					this.node.div_receipt.bn_play.node = this.node;

				}




			}
			// error
			else {
			
				page.error();
			}

			page.resized();

			this.is_ready = true;

			// Let scene know we are ready to start playback
//			page.cN.scene.build();
			this.readyCheck();

		}

		node.game_receipt.readyCheck = function() {
			
			if(
				(!this.node.game_receipt || (this.node.game_receipt && this.node.game_receipt.is_ready))
				&&
				(!this.node.ticket || (this.node.ticket && this.node.ticket.is_ready))
				&&
				(!this.node.btn_play_more || (this.node.btn_play_more && this.node.btn_play_more.is_ready))
				&&
				(!this.node.btn_signup || (this.node.btn_signup && this.node.btn_signup.is_ready))
			) {

				this.build();

			}


		}


		node.game_receipt.build = function() {
//			u.bug("node.game_receipt.build");




			u.a.transition(this.node.div_receipt.h2, "all 0.3s ease-in-out");
			u.ass(this.node.div_receipt.h2, {
				"opacity": 1
			});

			u.a.transition(this.node.div_receipt.p, "all 0.3s ease-in-out 0.2s");
			u.ass(this.node.div_receipt.p, {
				"opacity": 1
			});


			if(!this.node.scene.all_rounds_over) {
				

				if(this.node.div_receipt.h3) {
					u.a.transition(this.node.div_receipt.h3, "all 0.3s ease-in-out 0.2s");
					u.ass(this.node.div_receipt.h3, {
						"opacity": 1
					});
				}


				// if(this.node.ticket) {
				// 	u.o.ticket.build(this.node);
				// }

				if(this.node.btn_play_more) {
					u.o.BtnPlayMore.build(this.node);

					// this.node.div_receipt.bn_play.over = function() {
					// 	this.node.btn_play_more.onMouseOver();
					// }
					// this.node.div_receipt.bn_play.out = function() {
					// 	this.node.btn_play_more.onMouseOut();
					// }
					//
					//
					// if(u.e.event_support == "touch") {
					// 	u.e.addEvent(this.node.div_receipt.bn_play, "touchstart", this.node.div_receipt.bn_play.over);
					// 	u.e.addEvent(this.node.div_receipt.bn_play, "touchend", this.node.div_receipt.bn_play.out);
					// }
					// else {
					// 	u.e.addEvent(this.node.div_receipt.bn_play, "mouseover", this.node.div_receipt.bn_play.over);
					// 	u.e.addEvent(this.node.div_receipt.bn_play, "mouseout", this.node.div_receipt.bn_play.out);
					// }

					u.ce(this.node.div_receipt.bn_play);
					this.node.div_receipt.bn_play.clicked = function() {

						this.node.game_receipt._destroy("continue");

					}
				}

				if(this.node.btn_signup) {
					u.o.BtnSignup.build(this.node);


					// this.node.div_receipt.bn_send.over = function() {
					// 	this.node.btn_signup.onMouseOver.call(this.node.btn_signup);
					// }
					// this.node.div_receipt.bn_send.out = function() {
					// 	this.node.btn_signup.onMouseOut.call(this.node.btn_signup);
					// }
					//
					// if(u.e.event_support == "touch") {
					// 	u.e.addEvent(this.node.div_receipt.bn_send, "touchstart", this.node.div_receipt.bn_send.over);
					// 	u.e.addEvent(this.node.div_receipt.bn_send, "touchend", this.node.div_receipt.bn_send.out);
					// }
					// else {
					// 	u.e.addEvent(this.node.div_receipt.bn_send, "mouseover", this.node.div_receipt.bn_send.over);
					// 	u.e.addEvent(this.node.div_receipt.bn_send, "mouseout", this.node.div_receipt.bn_send.out);
					// }

					u.ce(this.node.div_receipt.bn_send);
					this.node.div_receipt.bn_send.clicked = function() {

						this.node.game_receipt.confirmSignup();

					}

				}

			}
			else {

				u.o.BtnPlayMoreGameOver.build(this.node);

				// this.node.div_receipt.bn_play.over = function() {
				// 	this.node.btn_play_more.onMouseOver();
				// }
				// this.node.div_receipt.bn_play.out = function() {
				// 	this.node.btn_play_more.onMouseOut();
				// }
				//
				//
				// if(u.e.event_support == "touch") {
				// 	u.e.addEvent(this.node.div_receipt.bn_play, "touchstart", this.node.div_receipt.bn_play.over);
				// 	u.e.addEvent(this.node.div_receipt.bn_play, "touchend", this.node.div_receipt.bn_play.out);
				// }
				// else {
				// 	u.e.addEvent(this.node.div_receipt.bn_play, "mouseover", this.node.div_receipt.bn_play.over);
				// 	u.e.addEvent(this.node.div_receipt.bn_play, "mouseout", this.node.div_receipt.bn_play.out);
				// }

				u.ce(this.node.div_receipt.bn_play);
				this.node.div_receipt.bn_play.clicked = function() {

					this.node.game_receipt._destroy("continue");

				}
				
			}



		}


		node.game_receipt._destroy = function(onto) {
//			u.bug("node.game_receipt.destroy:" + onto);

			this.onto = onto;

			this.destroyed = function() {

				this.node.div_receipt.parentNode.removeChild(this.node.div_receipt);
				delete this.node.div_receipt;

				this.node.div_table.parentNode.removeChild(this.node.div_table);
				delete this.node.div_table;

				if(this.confirm_box) {
					this.confirm_box.parentNode.removeChild(this.confirm_box);
					delete this.confirm_box;
				}

				this.destroy(true);
				delete this.node.game_question;

				if(this.onto == "continue") {
					if(this.node.scene.all_rounds_over) {
						// initialize bricks
						u.o.GameSelector.init(this.node);
					}
					else {
						// initialize bricks
						u.o.GameBricks.init(this.node);
					}
				}
				else {
					// initialize signup
					u.o.GameSignup.init(this.node);

				}

			}


			if(this.node.ticket) {
				this.node.ticket._destroy();
			}

			if(this.node.btn_play_more) {
				this.node.btn_play_more._destroy();
			}

			if(this.node.btn_signup) {
				this.node.btn_signup._destroy();
			}


			if(this.node.btn_signup_confirm) {
				this.node.btn_signup_confirm._destroy();
			}


			u.a.transition(this.node.div_receipt.h2, "all 0.3s ease-in-out");
			u.ass(this.node.div_receipt.h2, {
				"opacity": 0
			});

			u.a.transition(this.node.div_receipt.p, "all 0.3s ease-in-out 0.1s");
			u.ass(this.node.div_receipt.p, {
				"opacity": 0
			});

			if(this.node.div_receipt.h3) {
				u.a.transition(this.node.div_receipt.h3, "all 0.3s ease-in-out 0.2s");
				u.ass(this.node.div_receipt.h3, {
					"opacity": 0
				});
			}

			if(this.confirm_box) {
				u.a.transition(this.confirm_box, "all 0.3s ease-in-out 0.1s");
				u.ass(this.confirm_box, {
					"opacity": 0
				});
			}

			u.a.transition(this.node.div_receipt, "all 0.3s ease-in-out 0.3s");
			u.ass(this.node.div_receipt, {
				"opacity": 0
			});

			u.t.setTimer(this, "destroyed", 600);

		}

		// start loading assets
		u.loadAssets(node.game_receipt);

	}


	// // starts canvas playback
	// this.build = function(node) {
	// 	u.bug("GameReceipt.build");
	//
	// 	node.game_receipt.build();
	//
	// }

}
