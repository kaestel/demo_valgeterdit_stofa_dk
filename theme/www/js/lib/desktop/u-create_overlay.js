/**
* u.createOverlay
*
* Create overlay dialog window.
*
* @param _options JSON object with options for overlay creation
*  - width: Overlay width in pixels (default 600)
*  - height: Overlay height in pixels (default 600)
*  - class: Additional classname to add to overlay 
*
* @return Node reference to overlay div
*
* EXAMPLE
* var overlay = u.createOverlay({
*	"headline":"I'm an overlay",
*	"width":500,
*	"height":300
* });
*/
u.createOverlay = function (_options) {

	var width = 768;
	var height = 600;
	var classname = "";


	// Apply parameters
	if (typeof (_options) == "object") {
		var _argument;
		for (_argument in _options) {
			switch (_argument) {
				case "class": classname = _options[_argument]; break;

				case "width": width = _options[_argument]; break;
				case "height": height = _options[_argument]; break;
			}
		}
	}


	// Create overlay div (with tabindex -1 to make div focusable for keyevents)
	var overlay = u.ae(document.body, "div", { "class": "Overlay" + (classname ? " " + classname : ""), "tabindex":"-1" });
	// Set width and height and center on screen
	u.ass(overlay, {
		"width": width + "px",
		"height": height + "px",
		"left": Math.round((u.browserW() - width) / 2) + "px",
		"top": Math.round((u.browserH() - height) / 2) + "px",
	});


	// Add overlay "protection" div to cover the main page
	overlay.protection = u.ae(document.body, "div", { "class": "OverlayProtection" });


	// Prevent body scroll
	u.as(document.body, "overflow", "hidden");





	// Resize handler
	overlay._resized = function (event) {
		// u.bug("overlay.resized")

		// reposition overlay on screen
		u.ass(this, {
			"left": Math.round((u.browserW() - this.offsetWidth) / 2) + "px",
			"top": Math.round(((u.browserH() < 900 ? u.browserH() : 900) - this.offsetHeight) / 2) + "px",
		});


		if (typeof (this.resized) == "function") {
			this.resized(event);
		}
	}
	// add resize event listener
	u.e.addWindowEvent(overlay, "resize", "_resized");



	// Close overlay and make callback to overlay.closed
	overlay.close = function (event) {

		// restore original state
		u.as(document.body, "overflow", "auto");
		document.body.removeChild(this);
		document.body.removeChild(this.protection);
		document.body.removeChild(this.bn_close);

		// callback to invoker to notify about closing
		if (typeof (this.closed) == "function") {
			this.closed(event);
		}

	}


	// Add cancel and close buttons (always part of overlay UI)

	// Add "x"-close button to header
	overlay.bn_close = u.ae(document.body, "div", { "class": "overlayClose" });
	overlay.bn_close.overlay = overlay;
	u.ce(overlay.bn_close);

	// enable close/cancel buttons to close overlay
	overlay.bn_close.clicked = function (event) {
		this.overlay.close(event);

		page.playEventSound();
	}


	overlay._resized();


	u.a.transition(overlay.protection, "all 0.3s ease-in-out");
	u.ass(overlay.protection, {
		"opacity":1
	});

	u.a.transition(overlay, "all 0.3s ease-in-out 0.2s");
	u.ass(overlay, {
		"opacity":1
	});

	// return overlay
	return overlay;
}
