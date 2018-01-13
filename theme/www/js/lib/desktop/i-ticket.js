Util.Objects["ticket"] = new function() {

	// Creates canvases and loads assets
	this.init = function(node) {
//		u.bug("ticket.init:" + u.nodeId(node));

		node.ticket = u.createPIXIApp({"classname":"ticket", "height":180, "width":180});
		node.ticket.node = node;
		node.appendChild(node.ticket.renderer.view);

		// Load asses
		node.ticket.loadQueue = [
			"ticket_bg.png",
			"ticket_top.png",
		];


		// Will be invoked when assets have loaded
		node.ticket.ready = function() {
//			u.bug("node.ticket.ready");


			this.addTicket = function(tContainer,tNum){

				tContainer.ticket  = new PIXI.Container();
				tContainer.addChild(tContainer.ticket)
				var ticketTexture = PIXI.Texture.fromImage('/img/assets/desktop/ticket' + tNum +'.png');
				var ticket = new PIXI.Sprite(ticketTexture);
				tContainer.ticket.addChild(ticket);
				tContainer.ticket.rotation = -0.2;
				tContainer.ticket.x = 40;
				tContainer.ticket.y = 71;
				tContainer.ticket.scale.x = 0;
			}
	
			this.ticketIn = function(){
				var tSpeed = 2;
				Tween.to(this.ticketContainer.scale,tSpeed,{x:1,y:1, ease:Elastic.easeOut.config(0.6)});
				Tween.to(this.ticketContainer.ticket,0.4,{delay:.2, x:50, ease:Elastic.easeOut.config(0.9)});
				Tween.to(this.ticketContainer.ticket.scale,0.3,{delay:.2, x:1});
			}
			this.ticketOut = function(){
				var tSpeed = 0.4;
				Tween.to(this.ticketContainer.scale,tSpeed,{x:0,y:0, ease:Back.easeIn});
		
			}

			this.antalVundneLodder = this.node.scene.correct_answers;

			this.ticketContainer = new PIXI.Container();
			this.stage.addChild(this.ticketContainer);
			this.ticketContainer.pivot.set(this.renderer.width/2,this.renderer.width/2);
			this.ticketContainer.x = this.renderer.width/2;
			this.ticketContainer.y = this.renderer.width/2;
			this.ticketContainer.scale.x = this.ticketContainer.scale.y = 0;
		
			this.ticketContainer.addChild(this.assets.ticket_bg);
			this.addTicket(this.ticketContainer,this.antalVundneLodder);
			this.ticketContainer.addChild(this.assets.ticket_top);


			this.is_ready = true;

			this.node.game_receipt.readyCheck();

		}


		// Will be invoked from scene controller when it's time to start (scene could be waiting for other canvases)
		node.ticket.build = function() {
//			u.bug("node.ticket.build");

			this.ticketIn();
		}


		node.ticket._destroy = function() {
//			u.bug("node.ticket.destroy");


			this.destroyed = function() {

//				this.renderer.view.parentNode.removeChild(this.renderer.view);
				this.destroy(true);
				delete this.node.ticket;
			}


			this.ticketOut();

			u.t.setTimer(this, "destroyed", 400);

		}

		// start loading assets
		u.loadAssets(node.ticket);

	}


	// starts canvas playback
	this.build = function(node) {
//		u.bug("ticket.build:" + u.nodeId(node));

		node.ticket.build();

	}

}