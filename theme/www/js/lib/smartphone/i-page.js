Util.Objects["page"] = new function() {
	this.init = function(page) {

		// header reference
		page.hN = u.qs("#header");

		// content reference
		page.cN = u.qs("#content", page);

		// navigation reference
		page.nN = u.qs("#navigation", page);
//		page.nN = u.ie(page.hN, page.nN);

		// footer reference
		page.fN = u.qs("#footer");

		// global resize handler 
		page.resized = function() {

			page.browser_h = window.innerHeight; //u.browserH();
			page.browser_w = u.browserW();

			// fix page width to browser size
			u.ass(page, {
				"width": page.browser_w + "px",
				"height": page.browser_h + "px"
			});


			if(page.div_prizes) {

				page.div_prizes.item_width = Math.round((page.browser_w/640) * 440);
				u.ass(page.div_prizes, {
					"margin-top": Math.round((page.browser_w/640) * 245) + "px",
					"margin-left": Math.round((page.browser_w/640) * 99) + "px",
					"margin-right": Math.round((page.browser_w/640) * 99) + "px",
					"width": page.div_prizes.item_width + "px",
					"height": Math.round((page.browser_w/640) * 576) + "px"
				});
				u.ass(page.div_prizes.ul, {
					"width": (page.div_prizes.item_width*7) + "px",
				});
				var i, node;
				for(i = 0; node = page.div_prizes.weeks[i]; i++) {
					u.ass(node, {
						"width": (page.div_prizes.item_width) + "px",
					});
				}

				u.a.transition(page.div_prizes.ul, "none");
				u.a.translate(page.div_prizes.ul, -page.div_prizes.week*page.div_prizes.item_width, 0);

				u.ass(page.div_prizes.bn_next, {
					"top": Math.round((page.browser_w/640) * 500) + "px",
					"right": Math.round((page.browser_w/640) * 94) + "px",
				});
				u.ass(page.div_prizes.bn_prev, {
					"top": Math.round((page.browser_w/640) * 500) + "px",
					"left": Math.round((page.browser_w/640) * 94) + "px",
				});



				u.ass(page.div_prizes.h1, {
					"padding-top": Math.round((page.browser_w/640) * 160) + "px",
				});
			}


			// forward scroll event to current scene
			if(page.cN && page.cN.scene && typeof(page.cN.scene.resized) == "function") {
				page.cN.scene.resized();
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

			if((screen && screen.orientation && screen.orientation.type == "landscape-primary") || (window.orientation !== undefined && (window.orientation === 90 || window.orientation === -90))) {
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
//				u.e.addEvent(window, "resize", page.resized);
				// set scroll handler
				u.e.addEvent(window, "scroll", page.scrolled);
				// set orientation change handler
				u.e.addEvent(window, "orientationchange", page.orientationchanged);


				if(typeof(TweenLite) !== "undefined") {
					Tween = TweenLite;
				}

				if(typeof(PIXI) !== "undefined") {
					PIXI.utils._saidHello = true;
				}


				// adjust element sizes
				page.resized();


				// init header
				this.initHeader();


				// init accept cookies dialog
				this.acceptCookies();


				// start intro automatically
				this.initIntro();


				// init any additional assets
				//this.initAssets();
			}

		}


		page.initNavigation = function() {

			page.hN.service = u.qs("ul.servicenavigation", page.hN);
			u.ae(page, page.hN.service);
			u.a.transition(page.hN.service, "all 0.3s ease-in-out");
			u.ass(page.hN.service, {
				"opacity":1
			});


			// enable nav link
			u.ce(page.hN.service);
			page.hN.service.clicked = function(event) {

				// close navigation
				if(u.hc(this, "open")) {
					u.rc(this, "open");

					// hide navigation when hidden
					page.nN.transitioned = function() {
						u.ass(page.nN, {
							"display": "none"
						});
					}

					// collapse header
					u.a.transition(page.nN, "all 0.3s ease-in");
					u.ass(page.nN, {
						"opacity": 0
					});

				}
				// open navigation
				else {
					u.ac(this, "open");


					// set animation for header
					u.ass(page.nN, {
						"display": "block"
					});
					u.a.transition(page.nN, "all 0.3s ease-in");
					u.ass(page.nN, {
						"opacity": 1
					});

				}

			}



			page.nN.list = u.qs("ul.navigation", page.nN);

			// add play game
			page.nN.bn_prices = u.ae(page.nN.list, "li", {"class":"prizes", "html":"Præmier"});
			u.ce(page.nN.bn_prices);
			page.nN.bn_prices.clicked = function() {
				page.hN.service.clicked();

//				console.log("Show prices carousel");
				page.openPrizes();
			}


			// add rules
			page.nN.bn_rules = u.ae(page.nN.list, "li", {"class":"rules", "html":"Sådan spiller du"});
			u.ce(page.nN.bn_rules);
			page.nN.bn_rules.clicked = function() {
				page.hN.service.clicked();

				page.openOverlay("/regler");
			}


			// add terms
			page.nN.bn_terms = u.ae(page.nN.list, "li", {"class":"terms", "html":"Betingelser"});
			u.ce(page.nN.bn_terms);
			page.nN.bn_terms.clicked = function() {
				page.hN.service.clicked();

				page.openOverlay("/betingelser");
			}

		}


		// initialize header
		page.initHeader = function() {

			page.logo = u.ae(page.hN, "div", {"class":"logo"});
			u.ce(page.logo);
			page.logo.clicked = function() {
				location.reload();
			}
			page.ved_logo = u.ae(page.hN, "div", {"class":"ved_logo"});

		}

		page.showVedLogo = function() {

			u.a.transition(page.ved_logo, "all 0.3s ease-in-out");
			u.ass(page.ved_logo, {
				"opacity":1
			});

		}

		// Carousel should be able to show the prize of a specific week
		page.openPrizes = function(week) {

			week = week || 0;

			page.overlay = u.createOverlay({"class":"prizes"});

			page.h1_prizes = u.ae(page.overlay, "h1");
			page.div_prizes = u.ae(page.overlay, "div", {"class":"prizes"});
			page.div_prizes.h1 = page.h1_prizes;
			page.div_prizes.week = week;

			page.div_prizes.ul = u.ae(page.div_prizes, "ul");
			var week0 = u.ae(page.div_prizes.ul, "li", {"class":"week0"});
			var week1 = u.ae(page.div_prizes.ul, "li", {"class":"week1"});
			var week2 = u.ae(page.div_prizes.ul, "li", {"class":"week2"});
			var week3 = u.ae(page.div_prizes.ul, "li", {"class":"week3"});
			var week4 = u.ae(page.div_prizes.ul, "li", {"class":"week4"});
			var week5 = u.ae(page.div_prizes.ul, "li", {"class":"week5"});

			// main prize
			var week6 = u.ae(page.div_prizes.ul, "li", {"class":"week6"});
			page.div_prizes.weeks = u.qsa("li", page.div_prizes.ul);



			page.div_prizes.bn_next = u.ae(page.overlay, "span", {"class":"next"});
			page.div_prizes.bn_next.div = page.div_prizes;
			page.div_prizes.bn_prev = u.ae(page.overlay, "span", {"class":"prev"});
			page.div_prizes.bn_prev.div = page.div_prizes;


			u.ce(page.div_prizes.bn_next);
			page.div_prizes.bn_next.clicked = function() {
				this.div.setWeek(this.div.week + 1);
			}

			u.ce(page.div_prizes.bn_prev);
			page.div_prizes.bn_prev.clicked = function() {
				this.div.setWeek(this.div.week - 1);
			}

			page.div_prizes.setWeek = function(week) {

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
				u.a.translate(this.ul, -week*this.item_width, 0);

				u.ass(this.h1, {
					"backgroundImage":"url(/img/assets/smartphone/prize_header_week"+week+".png)"
				});
				
			}

			page.resized();

			// go to correct week to avoid transition
			u.a.translate(page.div_prizes.ul, -week*this.item_width, 0);

			// officially set week
			page.div_prizes.setWeek(week);



			page.overlay.closed = function() {
				delete page.h1_prizes;
				delete page.div_prizes;
				delete page.overlay;
			}

		}

		page.initIntro = function() {
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



		// page.initAssets = function() {
		//
		// 	console.log("init assets controller");
		//
		// }

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
