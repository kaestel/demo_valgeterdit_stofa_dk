Util.Objects["GameQuestion"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node) {
//		u.bug("GameQuestion.init:" + u.nodeId(node));

		node.game_question = u.createPIXIApp({"classname":"game_question", "height":600});
		node.game_question.node = node;
		node.appendChild(node.game_question.renderer.view);

		// Load asses
		node.game_question.loadQueue = [
			"answer_btn_1.png",
			"answer_btn_2.png",
			"answer_btn_3.png",
			"answer_btn_4.png",
			"answer_hitarea.png",
			"answer_rollover_1.png",
			"answer_rollover_2.png",
			"answer_rollover_3.png",
			"answer_rollover_4.png",
		];


		// Will be invoked when assets have loaded
		node.game_question.ready = function() {
//			console.log("node.game_question.ready");

			this.torkild = false;

//			this.node.scene.current_round_index = false;

			// do we have correct information
			if(this.node.scene.current_round_index !== false && this.node.scene.current_category_index !== false && this.node.scene.current_question_index !== false) {

				// declare helper functions

				this.createBtn = function(btnNum){

					var btnContainer = new PIXI.Container();
					btnContainer.alpha = 0;
					
					this.screenContainer.addChild(btnContainer);

					this.setupBtn(btnContainer,btnNum);

					return btnContainer;
				}

				this.setupBtn = function(answerBtnContainer,answerBtnNum){

					var texture, asset;

					answerBtnContainer.answerBtn  = new PIXI.Container();
					answerBtnContainer.addChild(answerBtnContainer.answerBtn)
					texture = PIXI.Texture.fromImage('/img/assets/desktop/answer_btn_'+ answerBtnNum + '.png');
					asset = new PIXI.Sprite(texture);
					answerBtnContainer.answerBtn.addChild(asset);

					//add rollover
					answerBtnContainer.answerBtn_rollover = new PIXI.Container();
					answerBtnContainer.addChild(answerBtnContainer.answerBtn_rollover)
					texture = PIXI.Texture.fromImage('/img/assets/desktop/answer_rollover_'+ answerBtnNum + '.png');
					asset = new PIXI.Sprite(texture);
					answerBtnContainer.answerBtn_rollover.addChild(asset);
					answerBtnContainer.answerBtn_rollover.alpha = 0;

					//add hitarea
					answerBtnContainer.hitarea = new PIXI.Container();
					answerBtnContainer.addChild(answerBtnContainer.hitarea)
					texture = PIXI.Texture.fromImage('/img/assets/desktop/answer_hitarea.png');
					asset = new PIXI.Sprite(texture);
					answerBtnContainer.hitarea.addChild(asset);
					answerBtnContainer.hitarea.x = 24;
					answerBtnContainer.hitarea.y = 24;
					answerBtnContainer.hitarea.alpha = 0.001;

					//SETUP MOUSE EVENTS ----------------------------------------------------
					// answerBtnContainer.hitarea.interactive = true
					// answerBtnContainer.hitarea.buttonMode = true;
					// answerBtnContainer.hitarea.on('mouseover', this.onMouseOver.bind(answerBtnContainer));
					// answerBtnContainer.hitarea.on('mouseout', this.onMouseOut.bind(answerBtnContainer));
					// answerBtnContainer.hitarea.on('click', this.onMouseClick.bind(answerBtnContainer));
				}

				this.onMouseOver = function(){
					var tSpeed = 0.15;
					Tween.to(this.answerBtn_rollover ,tSpeed,{alpha:1, ease:Quad.easeInOut});
				}
				this.onMouseOut = function(){
					var tSpeed = 0.15;
					Tween.to(this.answerBtn_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
				}

				this.onBrickSelected = function(selectedCategory){
		//				console.log("selectedCategory = " + selectedCategory);
					for(var i=1;i<=4;i++){

						var btnObj = this["btn" + i];
						btnObj.hitarea.interactive = false;
						btnObj.hitarea.buttonMode = false;

						if(i!=selectedCategory){
							Tween.to(btnObj,0.1,{delay:u.random(0,10)/100,alpha:0});
						} else {
							Tween.to(btnObj,0.2,{delay:1.1,alpha:0});
						}
		
					}
	
					Tween.delayedCall(1.3, this.onAnswerBtnsOut.bind(this));
				}
				this.onAnswerBtnsOut = function(){
		//				console.log("onAnswerBtnsOut")

					this._destroy();

				}

				this.showBtns = function(){
					this.screenContainer.y = this.startY;
					var i;
					for(i=1;i<=4;i++){
						var btnObj = this["btn" + i];
						btnObj.alpha = 0;

						TweenLite.to(btnObj, .3, {
							delay:u.random(0,20)/100,
							alpha: 1,
							ease: RoughEase.ease.config({
								template: Power0.easeNone,
								strength: 5,
								points: 1,
								randomize: true,
								clamp: true,
								taper: "out"
							}),
						});
					}
				}
				this.brickContainerOut = function(){
					var tSpeed = 0.5;
					Tween.to(this.screenContainer,tSpeed, {y:-600, ease:Quad.easeIn});
				}



				// Start building stage

				this.stageHeightDiff = 0; //200;
				this.startY = this.stageHeightDiff;
				this.screenContainer = new PIXI.Container();
				this.stage.addChild(this.screenContainer);
				this.screenContainer.x = (this.renderer.width/2)-(1024/2);
				this.screenContainer.y = 0;

	
				var btnStackY = 413;
				var btnMargin = 7;
				var btnWidth = 300;
				var btnHeight = 60;


				this.btn4 = this.createBtn(4);
				this.btn4.x = 189 +  btnMargin + (btnWidth*1);
				this.btn4.y = btnStackY + (btnHeight*1);

				this.btn3 = this.createBtn(3);
				this.btn3.x = 189 + (btnWidth*0);
				this.btn3.y = btnStackY + (btnHeight*1);

				this.btn1 = this.createBtn(1);
				this.btn1.x = 189 + (btnWidth*0);
				this.btn1.y = btnStackY + (btnHeight*0);

				this.btn2 = this.createBtn(2);
				this.btn2.x = 189 +  btnMargin + (btnWidth*1);
				this.btn2.y = btnStackY + (btnHeight*0);


				// initialize torkild
				u.o.torkild.init(this.node);


				// create question wrapper
				this.node.div_question = u.ae(this.node, "div", {"class":"question"});
				this.node.div_question.node = this.node;


				// get current question
				this.node.question = this.node.scene.quiz.rounds[this.node.scene.current_round_index].categories[this.node.scene.current_category_index].questions[this.node.scene.current_question_index];

				this.node.div_question.h2 = u.ae(this.node.div_question, "h2", {"html":"<span>"+this.node.question.question+"</span>"});
				this.node.div_question.answers = [];


				var ul_answers = u.ae(this.node.div_question, "ul", {"class":"answers"});

				var answer, i = 1;
				for(x in this.node.question.answers) {

					answer = u.ae(ul_answers, "li", {"class":"answer", "html":"<span><span>"+this.node.question.answers[x]+"</span></span>"});

					this.node.div_question.answers.push(answer);

					answer.node = this.node
					answer.index = x;
					answer.i = i++;

					answer.over = function() {
						if(this.node.game_question) {
							this.node.game_question.onMouseOver.call(this.node.game_question["btn"+this.i]);
						}
					}
					answer.out = function() {
						if(this.node.game_question) {
							this.node.game_question.onMouseOut.call(this.node.game_question["btn"+this.i]);
						}
					}


					if(u.e.event_support == "touch") {
						u.e.addEvent(answer, "touchstart", answer.over);
						u.e.addEvent(answer, "touchend", answer.out);
					}
					else {
						u.e.addEvent(answer, "mouseover", answer.over);
						u.e.addEvent(answer, "mouseout", answer.out);
					}


					u.ce(answer);
					answer.clicked = function() {

						page.playEventSound();


						if(this.index == this.node.scene.quiz.rounds[this.node.scene.current_round_index].categories[this.node.scene.current_category_index].questions[this.node.scene.current_question_index].correct_answer) {
							this.node.scene.quiz_answers["r"+ this.node.scene.current_round_index+"c"+this.node.scene.current_category_index+"q"+this.node.scene.current_question_index] = true;
//							u.bug("correct");
						}
						else {
							this.node.scene.quiz_answers["r"+ this.node.scene.current_round_index+"c"+this.node.scene.current_category_index+"q"+this.node.scene.current_question_index] = false;
//							u.bug("wrong")
						}


						// Save answers
						u.saveCookie("stofa_ved_answers", JSON.stringify(this.node.scene.quiz_answers), {"expires":"Mon, 01-May-2017 05:00:00 GMT"});


						var i, answer;
						for(i = 0; answer = this.node.div_question.answers[i]; i++) {

							if(answer != this) {
								u.a.transition(answer, "all 0.1s ease-in-out " + i*30 + "ms");
								u.ass(answer, {
									"opacity": 0
								});
							}

						}


						this.node.game_question.onBrickSelected(this.i);

					}

				}


				page.resized();

			}
			// error
			else {
				
				page.error();
			}


			this.is_ready = true;

			this.readyCheck();

		}


		node.game_question.readyCheck = function() {
			
			if(
				(!this.node.game_question || (this.node.game_question && this.node.game_question.is_ready))
				&&
				(!this.node.torkild || (this.node.torkild && this.node.torkild.is_ready))
			) {

				this.build();

			}


		}



		// Will be invoked from scene controller when it's time to start (scene could be waiting for other canvases)
		node.game_question.build = function() {
//			u.bug("node.game_question.build");


			this.showBtns();


			page.showJan("sporgsmaal");


			u.o.torkild.build(this.node);


			u.a.transition(this.node.div_question.h2, "all 0.3s linear");
			u.ass(this.node.div_question.h2, {
				"opacity": 1
			});

			var i, answer;
			for(i = 0; answer = this.node.div_question.answers[i]; i++) {

				u.a.transition(answer, "all 0.2s linear " + i*100 + "ms");
				u.ass(answer, {
					"opacity": 1
				});

			}

		}


		node.game_question._destroy = function() {
//			u.bug("node.game_question.destroy");


			page.hideJan(true);

			this.destroyed = function() {

				this.node.div_question.parentNode.removeChild(this.node.div_question);
				delete this.node.div_question;

//				this.renderer.view.parentNode.removeChild(this.renderer.view);
				this.destroy(true);
				delete this.node.game_question;



				u.o.GameReceipt.init(this.node);
			}


			// kill torkild
			if(this.node.torkild) {
				this.node.torkild._destroy();
			}


			u.a.transition(this.node.div_question.h2, "all 0.3s ease-in-out");
			u.ass(this.node.div_question.h2, {
				"opacity": 0
			});

			var i, answer;
			for(i = 0; answer = this.node.div_question.answers[i]; i++) {

				u.a.transition(answer, "all 0.2s ease-in-out");
				u.ass(answer, {
					"opacity": 0
				});

			}

			u.t.setTimer(this, "destroyed", (i*100) + 300);

		}

		// start loading assets
		u.loadAssets(node.game_question);

	}


	// starts canvas playback
	// this.build = function(node) {
	// 	u.bug("GameQuestion.build");
	//
	// 	node.game_question.build();
	//
	// }

}
