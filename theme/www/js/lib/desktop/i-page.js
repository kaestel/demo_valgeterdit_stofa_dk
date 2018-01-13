Util.Objects["page"] = new function() {
	this.init = function(page) {

		// header reference
		page.hN = u.qs("#header");
		page.hN.service = u.qs("ul.servicenavigation", page.hN);

		// content reference
		page.cN = u.qs("#content", page);

		// navigation reference
		page.nN = u.qs("#navigation", page);

		// footer reference
		page.fN = u.qs("#footer");


		// global resize handler 
		page.resized = function() {
//			u.bug("page.resized:" + u.nodeId(this));

			page.browser_h = u.browserH();
			page.browser_w = u.browserW();

			// fix page width to browser size
			u.ass(page, {
				"width": (page.browser_w > 768 ? page.browser_w : 768) + "px",
				"height": (page.browser_h > 600 ? page.browser_h : 600) + "px"
			});


			if(page.browser_w > 1200) {
				page.assetsActive = true;
			}
			else {
				page.assetsActive = false;
			}
			page.updateAssets();


			// forward scroll event to current scene
			if(page.cN && page.cN.scene) {

				u.ass(page.cN.scene, {
					"margin-left":((page.browser_w > 768 ? page.browser_w : 768) - page.cN.scene.offsetWidth)/2 + "px",
					"margin-top":((page.browser_h > 600 ? (page.browser_h > 900 ? 900 : page.browser_h) : 600) - page.cN.scene.offsetHeight)/2 + "px"
				});

				if(typeof(page.cN.scene.resized) == "function") {
					page.cN.scene.resized();
				}

			}

		}

		// global scroll handler 
		page.scrolled = function() {
//			u.bug("page.scrolled:" + u.nodeId(this))

			// forward scroll event to current scene
			if(page.cN && page.cN.scene && typeof(page.cN.scene.scrolled) == "function") {
				page.cN.scene.scrolled();
			}
		}

		// global orientationchange handler
		page.orientationchanged = function() {

			if((screen && screen.orientation && screen.orientation.type == "portrait-primary") || (window.orientation !== undefined && (window.orientation === 0 || window.orientation === 180))) {
				if(!this.inTurnMode) {
					this.inTurnMode = u.ae(document.body, "div", {"class":"badorientation"});
				}
			}
			else if(this.inTurnMode) {
				this.inTurnMode.parentNode.removeChild(this.inTurnMode);
				delete this.inTurnMode;
			}
		}

		// Page is ready
		page.ready = function() {
//			u.bug("page.ready:" + u.nodeId(this));

			// page is ready to be shown - only initalize if not already shown
			if(!this.is_ready) {

				// page is ready
				this.is_ready = true;


				this.cN.scene = u.qs(".scene", this);


				// set resize handler
				u.e.addEvent(window, "resize", this.resized);
				// set scroll handler
				u.e.addEvent(window, "scroll", this.scrolled);
				// set orientation change handler
				u.e.addEvent(window, "orientationchange", page.orientationchanged);


				// do we need "turn your device overlay"
				page.orientationchanged();

				// adjust element sizes
				page.resized();


				if(typeof(TweenLite) !== "undefined") {
					Tween = TweenLite;
				}

				if(typeof(PIXI) !== "undefined") {
					PIXI.utils._saidHello = true;
				}


				this.audioPlayerBg = u.audioPlayer();
				u.ae(page, this.audioPlayerBg);
				this.audioPlayerBg.load("/sounds/background.mp3");
				this.audioPlayerBg.ended = function() {
					if(!page.audio_off) {
						this.play();
					}
				}


				this.audioPlayerEvent = u.audioPlayer();
				u.ae(page, this.audioPlayerEvent);
				this.audioPlayerEvent.load("/sounds/click.mp3");

				this.bn_audio = u.ae(page, "div", {"class":"audioSwitch"});
				u.ce(this.bn_audio);
				this.bn_audio.clicked = function() {
					if(page.audio_off) {
						u.rc(this, "off");
						page.audio_off = false;
						page.startSounds();
					}
					else {
						u.ac(this, "off");
						page.audio_off = true;
						page.stopSounds();
					}
				}


				// init header
				this.initHeader();


				// init accept cookies dialog
				this.acceptCookies();


				// start intro automatically
				this.initIntro();

				// init any additional assets
//				this.initAssets();
			}

		}


		page.playEventSound = function() {
			if(!this.audio_off) {
				this.audioPlayerEvent.play();
			}
		}
		page.playBgSound = function() {

			if(!this.audio_off) {
				this.audioPlayerBg.play();
			}

		}

		page.startSounds = function() {

			if(this.audioPlayerBg) {
				this.audioPlayerBg.play();
			}

			this.audio_off = false;
		}

		page.stopSounds = function() {

			if(this.audioPlayerBg) {
				this.audioPlayerBg.stop();
			}

			if(this.audioPlayerEvent) {
				this.audioPlayerBg.stop();
			}

			this.audio_off = true;
		}


		// initialize navigation content
		page.initNavigation = function() {

			page.nN.list = u.qs("ul.navigation", page.nN);

			// add play game
			page.nN.bn_prices = u.ae(page.nN.list, "li", {"class":"prizes", "html":"Præmier"});
			u.ce(page.nN.bn_prices);
			page.nN.bn_prices.clicked = function() {
				page.playEventSound();

//				console.log("Show prices carousel");
				page.openPrizes();

			}
			u.a.transition(page.nN.bn_prices, "all 0.3s ease-in-out");
			u.ass(page.nN.bn_prices, {
				"opacity":1
			});


			// add rules
			page.nN.bn_rules = u.ae(page.nN.list, "li", {"class":"rules", "html":"Sådan spiller du"});
			u.ce(page.nN.bn_rules);
			page.nN.bn_rules.clicked = function() {
				page.playEventSound();

				page.openOverlay("/regler");
			}
			u.a.transition(page.nN.bn_rules, "all 0.3s ease-in-out 0.1s");
			u.ass(page.nN.bn_rules, {
				"opacity":1
			});

			// add terms
			page.nN.bn_terms = u.ae(page.nN.list, "li", {"class":"terms", "html":"Betingelser"});
			u.ce(page.nN.bn_terms);
			page.nN.bn_terms.clicked = function() {
				page.playEventSound();

				page.openOverlay("/betingelser");
			}
			u.a.transition(page.nN.bn_terms, "all 0.3s ease-in-out 0.2s");
			u.ass(page.nN.bn_terms, {
				"opacity":1
			});

		}


		// initialize header content
		page.initHeader = function() {

			page.logo = u.ae(page.hN, "div", {"class":"logo"});
			u.ce(page.logo);
			page.logo.clicked = function() {
				location.href = "/";
			}
			page.ved_logo = u.ae(page.hN, "div", {"class":"ved_logo"});
			

		}
		page.showVedLogo = function() {

			u.a.transition(page.ved_logo, "all 0.3s ease-in-out");
			u.ass(page.ved_logo, {
				"opacity":1
			});

		}
		page.hideVedLogo = function() {

			u.a.transition(page.ved_logo, "all 0.3s ease-in-out");
			u.ass(page.ved_logo, {
				"opacity":0
			});

		}

		// Carousel should be able to show the prize of a specific week
		page.openPrizes = function(week) {

			week = week || 0;

			page.overlay = u.createOverlay({"class":"prizes"});

			var h1_prizes = u.ae(page.overlay, "h1");
			var div_prizes = u.ae(page.overlay, "div", {"class":"prizes"});
			div_prizes.h1 = h1_prizes;
			div_prizes.week = week;

			div_prizes.ul = u.ae(div_prizes, "ul");
			var week0 = u.ae(div_prizes.ul, "li", {"class":"week0"});
			var week1 = u.ae(div_prizes.ul, "li", {"class":"week1"});
			var week2 = u.ae(div_prizes.ul, "li", {"class":"week2"});
			var week3 = u.ae(div_prizes.ul, "li", {"class":"week3"});
			var week4 = u.ae(div_prizes.ul, "li", {"class":"week4"});
			var week5 = u.ae(div_prizes.ul, "li", {"class":"week5"});

			// main prize
			var week6 = u.ae(div_prizes.ul, "li", {"class":"week6"});


			div_prizes.bn_next = u.ae(page.overlay, "span", {"class":"next"});
			div_prizes.bn_next.div = div_prizes;
			div_prizes.bn_prev = u.ae(page.overlay, "span", {"class":"prev"});
			div_prizes.bn_prev.div = div_prizes;


			u.ce(div_prizes.bn_next);
			div_prizes.bn_next.clicked = function() {
				this.div.setWeek(this.div.week + 1);
			}

			u.ce(div_prizes.bn_prev);
			div_prizes.bn_prev.clicked = function() {
				this.div.setWeek(this.div.week - 1);
			}

			div_prizes.setWeek = function(week) {

//				console.log(week)
				// compensate for our of range
				week = week < 0 ? 0 : (week > 6 ? 6 : week);
//				console.log("2:" + week)

				if(week == 0) {
					u.ass(this.bn_prev, {
						"opacity":0
					});
				}
				else {
					u.ass(this.bn_prev, {
						"opacity":1
					});
				}

				if(week == 6) {
					u.ass(this.bn_next, {
						"opacity":0
					});
				}
				else {
					u.ass(this.bn_next, {
						"opacity":1
					});
				}

				this.week = week;

				// go to selected frame
				u.a.transition(this.ul, "all 0.4s ease-in-out");
				u.a.translate(this.ul, -week*620, 0);

				u.ass(this.h1, {
					"backgroundImage":"url(/img/assets/desktop/prize_header_week"+week+".png)"
				});
				
			}


			// go to correct week to avoid transition
			u.a.translate(div_prizes.ul, -week*620, 0);

			// officially set week
			div_prizes.setWeek(week);


			page.overlay.closed = function() {
				delete page.overlay;
			}

		}


		page.initIntro = function() {

			page.playBgSound();

//			u.bug("initIntro");

			// init intro component
			u.o.intro.init(page.cN.scene);


			// skip straight to front
//			u.o.front.init(page.cN.scene);


			// skip straight to game
//			u.o.game.init(page.cN.scene);



		}


		// show accept cookies dialogue
		page.acceptCookies = function() {

			// show terms notification
			if(!u.getCookie("terms_v1")) {
				var terms = u.ie(document.body, "div", {"class":"terms_notification"});
				u.ae(terms, "p", {"html":"Vi gør brug af cookies til at fastlægge hvem, der besøger vores site, samt til at føre demografiske og brugerrelaterede statistikker. Ved indsendelse af lodder og afgivelse af kontaktinfo, accepterer du at Stofa gerne må kontakte dig med markedsføring, samt målrette henvendelser til dig."});
				var ul_actions = u.ae(terms, "ul", {"class":"actions"});
				var bn_accept = u.ae(ul_actions, "li", {"class":"accept", "html":"OK"});
				bn_accept.terms = terms;
				u.ce(bn_accept);
				bn_accept.clicked = function() {
					this.terms.parentNode.removeChild(this.terms);
					u.saveCookie("terms_v1", true, {"expires":new Date(new Date().getTime()+(1000*60*60*24*365)).toGMTString()});
				}

				var bn_details = u.ae(ul_actions, "li", {"class":"details", "html":"Læs betingelser"});
				u.ce(bn_details);
				bn_details.clicked = function() {
					page.openOverlay("/betingelser");

				}

				// show terms/cookie approval
				u.a.transition(terms, "all 0.5s ease-in");
				u.ass(terms, {
					"opacity": 1
				});
			}

		}


//		page.initAssets = function() {

//			console.log("init assets controller");


		page.updateAssets = function() {

			if(this.assetsActive && this.current_jan) {
				this.showJan(this.current_jan)
			}
			else if(!this.assetsActive) {
				this.hideJan();
			}

		}

		page.showJan = function(which) {
//			u.bug("showjan:" + which)


			this.old_jan = this.current_jan;
			this.current_jan = which;

			if(this.assetsActive && (this.old_jan != this.current_jan || !this.div_jan)) {
//				u.bug("new jan")

				if(!this.div_jan) {
//					u.bug("first jan")

					// create jan
					this.div_jan = u.ae(page, "div", {"class":"jan"});

					// move him out of sight
					u.a.translate(this.div_jan, -(this.div_jan.offsetWidth), 0);
				}


				this.div_jan.janReady = function() {
//					u.bug("this.div_jan.janReady");

					// show new jan
					u.ass(this, {
						"backgroundImage":"url(/img/assets/desktop/jan_"+page.current_jan+".png)"
					})
				
					u.a.transition(this, "all 0.2s ease-out");
					u.ass(this, {
						"opacity":1,
						"transform":"translate(0, 0)"
					});
//						u.a.translate(this, 0, 0);

				}


				// current jan exists
				if(this.old_jan && this.old_jan != this.current_jan) {
//					u.bug("jan exists already")


					// remove existing jan
					u.a.transition(this.div_jan, "all 0.3 ease-in", "janReady");
					u.a.translate(this.div_jan, -this.div_jan.offsetWidth, 0);

				}


				else if(this.current_jan) {
//					u.bug("jan does not exist already")

					delete this.div_jan.removeJan;
					this.div_jan.janReady();

				}

			}
			// else {
			// 	u.bug("jan is fine")
			// }

		}

		page.hideJan = function(clear) {

			clear = clear || false;

//			u.bug("hideJan");

			if(this.current_jan && this.div_jan) {

				this.div_jan.removeJan = function() {
					this.parentNode.removeChild(this);
					delete page.div_jan;
				}
				
				u.a.transition(this.div_jan, "all 0.2s ease-in", "removeJan");
				u.ass(this.div_jan, {
					"opacity":0,
					"transform":"translate("+(-(this.div_jan.offsetWidth))+"px, 0)"
				});

			}
			// else {
			// 	u.bug("jan is already out")
			// }

			if(clear) {
				this.current_jan = false;
			}

		}


		// standard overlay handler (for rules, terms and signup)
		page.openOverlay = function(url) {
//			u.bug("page.openOverlay");

			// if overlay already exists
			// TODO: not tested (and should never be possible because overlay is covering all links)
			if(page.overlay) {
				u.bug("overlay already open");

				// save url
				page._overlay_queued_url = url;

				// existing overlay has been closed
				page.overlay.closed = function() {
					if(page._overlay_queued_url) {
						page.openOverlay(page._overlay_queued_url);
						page._overlay_queued_url = false;
					}
				}
				// close existing overlay
				page.overlay.close();
			}

			// Ok to open overlay
			else {
				u.bug("create new overlay");
				page.overlay = u.createOverlay();

				page.overlayResponse = function(response) {
					u.bug("page.overlayResponse");

					u.ae(page.overlay, u.qs("div.scene", response));

				}
				u.bug("request overlay data");
				u.request(page, url, {"callback":"overlayResponse"});

				page.overlay.closed = function() {
					delete page.overlay;
				}

			}


		}



		page.error = function(type) {

			type = type || "generel";

			page.overlay = u.createOverlay({"class":"error"});

			if(type == "signup") {

				var h1 = u.ae(page.overlay, "h1", {"html":"Hov!"});
				var p = u.ae(page.overlay, "p", {"html":"Du kan ikke gemme dine data - det er jo kun en demo."});

			}
			else {

				var h1 = u.ae(page.overlay, "h1", {"html":"Hov! Det var ikke meningen."});
				var p = u.ae(page.overlay, "p", {"html":"Vi genstarter spillet om <span>10</span> sekunder."});
				var span = u.qs("span", p);
			
				page.t_reboot = u.t.setInterval(span, function() {
					this.innerHTML = parseInt(this.innerHTML)-1;

					if(this.innerHTML == 0) {
						u.t.resetInterval(page.t_reboot);
						location.reload(true);
					}

				}, 1000);

			}

		}


		// ready to start page builing process
		page.ready();
	}
}

u.e.addDOMReadyEvent(u.init);
