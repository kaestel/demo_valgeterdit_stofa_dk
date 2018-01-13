
/*seg_desktop_include.js*/

/*seg_desktop.js*/
if(!u || !Util) {
	var u, Util = u = new function() {};
	u.version = "0.9.2";
	u.bug = u.nodeId = u.exception = function() {};
	u.stats = new function() {this.pageView = function(){};this.event = function(){};}
}
u.bug_console_only = true;
Util.debugURL = function(url) {
	if(u.bug_force) {
		return true;
	}
	return document.domain.match(/(\.local|\.proxy)$/);
}
Util.nodeId = function(node, include_path) {
	try {
		if(!include_path) {
			return node.id ? node.nodeName+"#"+node.id : (node.className ? node.nodeName+"."+node.className : (node.name ? node.nodeName + "["+node.name+"]" : node.nodeName));
		}
		else {
			if(node.parentNode && node.parentNode.nodeName != "HTML") {
				return u.nodeId(node.parentNode, include_path) + "->" + u.nodeId(node);
			}
			else {
				return u.nodeId(node);
			}
		}
	}
	catch(exception) {
		u.exception("u.nodeId", arguments, exception);
	}
	return "Unindentifiable node!";
}
Util.exception = function(name, _arguments, _exception) {
	u.bug("Exception in: " + name + " (" + _exception + ")");
	u.bug("Invoked with arguments:");
	u.xInObject(_arguments);
	u.bug("Called from:");
	if(_arguments.callee.caller.name) {
		u.bug("arguments.callee.caller.name:" + _arguments.callee.caller.name)
	}
	else {
		u.bug("arguments.callee.caller:" + _arguments.callee.caller.toString().substring(0, 250));
	}
}
Util.bug = function(message, corner, color) {
	if(u.debugURL()) {
		if(!u.bug_console_only) {
			var option, options = new Array([0, "auto", "auto", 0], [0, 0, "auto", "auto"], ["auto", 0, 0, "auto"], ["auto", "auto", 0, 0]);
			if(isNaN(corner)) {
				color = corner;
				corner = 0;
			}
			if(typeof(color) != "string") {
				color = "black";
			}
			option = options[corner];
			if(!document.getElementById("debug_id_"+corner)) {
				var d_target = u.ae(document.body, "div", {"class":"debug_"+corner, "id":"debug_id_"+corner});
				d_target.style.position = u.bug_position ? u.bug_position : "absolute";
				d_target.style.zIndex = 16000;
				d_target.style.top = option[0];
				d_target.style.right = option[1];
				d_target.style.bottom = option[2];
				d_target.style.left = option[3];
				d_target.style.backgroundColor = u.bug_bg ? u.bug_bg : "#ffffff";
				d_target.style.color = "#000000";
				d_target.style.textAlign = "left";
				if(d_target.style.maxWidth) {
					d_target.style.maxWidth = u.bug_max_width ? u.bug_max_width+"px" : "auto";
				}
				d_target.style.padding = "3px";
			}
			if(typeof(message) != "string") {
				message = message.toString();
			}
			var debug_div = document.getElementById("debug_id_"+corner);
			message = message ? message.replace(/\>/g, "&gt;").replace(/\</g, "&lt;").replace(/&lt;br&gt;/g, "<br>") : "Util.bug with no message?";
			u.ae(debug_div, "div", {"style":"color: " + color, "html": message});
		}
		if(typeof(console) == "object") {
			console.log(message);
		}
	}
}
Util.xInObject = function(object, _options) {
	if(u.debugURL()) {
		var return_string = false;
		var explore_objects = false;
		if(typeof(_options) == "object") {
			var _argument;
			for(_argument in _options) {
				switch(_argument) {
					case "return"     : return_string               = _options[_argument]; break;
					case "objects"    : explore_objects             = _options[_argument]; break;
				}
			}
		}
		var x, s = "--- start object ---\n";
		for(x in object) {
			if(explore_objects && object[x] && typeof(object[x]) == "object" && typeof(object[x].nodeName) != "string") {
				s += x + "=" + object[x]+" => \n";
				s += u.xInObject(object[x], true);
			}
			else if(object[x] && typeof(object[x]) == "object" && typeof(object[x].nodeName) == "string") {
				s += x + "=" + object[x]+" -> " + u.nodeId(object[x], 1) + "\n";
			}
			else if(object[x] && typeof(object[x]) == "function") {
				s += x + "=function\n";
			}
			else {
				s += x + "=" + object[x]+"\n";
			}
		}
		s += "--- end object ---\n";
		if(return_string) {
			return s;
		}
		else {
			u.bug(s);
		}
	}
}
Util.Animation = u.a = new function() {
	this.support3d = function() {
		if(this._support3d === undefined) {
			var node = u.ae(document.body, "div");
			try {
				u.as(node, "transform", "translate3d(10px, 10px, 10px)");
				if(u.gcs(node, "transform").match(/matrix3d\(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 10, 10, 1\)/)) {
					this._support3d = true;
				}
				else {
					this._support3d = false;
				}
			}
			catch(exception) {
				this._support3d = false;
			}
			document.body.removeChild(node);
		}
		return this._support3d;
	}
	this.transition = function(node, transition, callback) {
		try {
			var duration = transition.match(/[0-9.]+[ms]+/g);
			if(duration) {
				node.duration = duration[0].match("ms") ? parseFloat(duration[0]) : (parseFloat(duration[0]) * 1000);
				if(callback) {
					var transitioned;
					transitioned = (function(event) {
						u.e.removeEvent(event.target, u.a.transitionEndEventName(), transitioned);
						if(event.target == this) {
							u.a.transition(this, "none");
							if(typeof(callback) == "function") {
								var key = u.randomString(4);
								node[key] = callback;
								node[key].callback(event);
								node[key] = null;
								callback = null;
							}
							else if(typeof(this[callback]) == "function") {
								this[callback](event);
								this[callback] = null;
							}
						}
						else {
						}
					});
					u.e.addEvent(node, u.a.transitionEndEventName(), transitioned);
				}
				else {
					u.e.addEvent(node, u.a.transitionEndEventName(), this._transitioned);
				}
			}
			else {
				node.duration = false;
			}
			u.as(node, "transition", transition);
		}
		catch(exception) {
			u.exception("u.a.transition", arguments, exception);
		}
	}
	this.transitionEndEventName = function() {
		if(!this._transition_end_event_name) {
			this._transition_end_event_name = "transitionend";
			var transitions = {
				"transition": "transitionend",
				"MozTransition": "transitionend",
				"msTransition": "transitionend",
				"webkitTransition": "webkitTransitionEnd",
				"OTransition": "otransitionend"
			};
			var x, div = document.createElement("div");
			for(x in transitions){
				if(typeof(div.style[x]) !== "undefined") {
					this._transition_end_event_name = transitions[x];
					break;
				}
			}
		}
		return this._transition_end_event_name;
	}
	this._transitioned = function(event) {
		u.e.removeEvent(event.target, u.a.transitionEndEventName(), u.a._transitioned);
		u.a.transition(event.target, "none");
		if(event.target == this && typeof(this.transitioned) == "function") {
			this.transitioned(event);
			this.transitioned = null;
		}
	}
	this.removeTransform = function(node) {
		u.as(node, "transform", "none");
	}
	this.translate = function(node, x, y) {
		if(this.support3d()) {
			u.as(node, "transform", "translate3d("+x+"px, "+y+"px, 0)");
		}
		else {
			u.as(node, "transform", "translate("+x+"px, "+y+"px)");
		}
		node._x = x;
		node._y = y;
	}
	this.rotate = function(node, deg) {
		u.as(node, "transform", "rotate("+deg+"deg)");
		node._rotation = deg;
	}
	this.scale = function(node, scale) {
		u.as(node, "transform", "scale("+scale+")");
		node._scale = scale;
	}
	this.setOpacity = this.opacity = function(node, opacity) {
		u.as(node, "opacity", opacity);
		node._opacity = opacity;
	}
	this.setWidth = this.width = function(node, width) {
		width = width.toString().match(/\%|auto|px/) ? width : (width + "px");
		node.style.width = width;
		node._width = width;
		node.offsetHeight;
	}
	this.setHeight = this.height = function(node, height) {
		height = height.toString().match(/\%|auto|px/) ? height : (height + "px");
		node.style.height = height;
		node._height = height;
		node.offsetHeight;
	}
	this.setBgPos = this.bgPos = function(node, x, y) {
		x = x.toString().match(/\%|auto|px|center|top|left|bottom|right/) ? x : (x + "px");
		y = y.toString().match(/\%|auto|px|center|top|left|bottom|right/) ? y : (y + "px");
		node.style.backgroundPosition = x + " " + y;
		node._bg_x = x;
		node._bg_y = y;
		node.offsetHeight;
	}
	this.setBgColor = this.bgColor = function(node, color) {
		node.style.backgroundColor = color;
		node._bg_color = color;
		node.offsetHeight;
	}
	this._animationqueue = {};
	this.requestAnimationFrame = function(node, callback, duration) {
		if(!u.a.__animation_frame_start) {
			u.a.__animation_frame_start = Date.now();
		}
		var id = u.randomString();
		u.a._animationqueue[id] = {};
		u.a._animationqueue[id].id = id;
		u.a._animationqueue[id].node = node;
		u.a._animationqueue[id].callback = callback;
		u.a._animationqueue[id].duration = duration;
		u.t.setTimer(u.a, function() {u.a.finalAnimationFrame(id)}, duration);
		if(!u.a._animationframe) {
			window._requestAnimationFrame = eval(u.vendorProperty("requestAnimationFrame"));
			window._cancelAnimationFrame = eval(u.vendorProperty("cancelAnimationFrame"));
			u.a._animationframe = function(timestamp) {
				var id, animation;
				for(id in u.a._animationqueue) {
					animation = u.a._animationqueue[id];
					if(!animation["__animation_frame_start_"+id]) {
						animation["__animation_frame_start_"+id] = timestamp;
					}
					animation.node[animation.callback]((timestamp-animation["__animation_frame_start_"+id]) / animation.duration);
				}
				if(Object.keys(u.a._animationqueue).length) {
					u.a._requestAnimationId = window._requestAnimationFrame(u.a._animationframe);
				}
			}
		}
		if(!u.a._requestAnimationId) {
			u.a._requestAnimationId = window._requestAnimationFrame(u.a._animationframe);
		}
		return id;
	}
	this.finalAnimationFrame = function(id) {
		var animation = u.a._animationqueue[id];
		animation["__animation_frame_start_"+id] = false;
		animation.node[animation.callback](1);
		if(typeof(animation.node.transitioned) == "function") {
			animation.node.transitioned({});
		}
		delete u.a._animationqueue[id];
		if(!Object.keys(u.a._animationqueue).length) {
			this.cancelAnimationFrame(id);
		}
	}
	this.cancelAnimationFrame = function(id) {
		if(id && u.a._animationqueue[id]) {
			delete u.a._animationqueue[id];
		}
		if(u.a._requestAnimationId) {
			window._cancelAnimationFrame(u.a._requestAnimationId);
			u.a.__animation_frame_start = false;
			u.a._requestAnimationId = false;
		}
	}
}
Util.saveCookie = function(name, value, _options) {
	var expires = true;
	var path = false;
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "expires"	: expires	= _options[_argument]; break;
				case "path"		: path		= _options[_argument]; break;
			}
		}
	}
	if(expires === false) {
		expires = ";expires=Mon, 04-Apr-2020 05:00:00 GMT";
	}
	else if(typeof(expires) === "string") {
		expires = ";expires="+expires;
	}
	else {
		expires = "";
	}
	if(typeof(path) === "string") {
		path = ";path="+path;
	}
	else {
		path = "";
	}
	document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + path + expires;
}
Util.getCookie = function(name) {
	var matches;
	return (matches = document.cookie.match(encodeURIComponent(name) + "=([^;]+)")) ? decodeURIComponent(matches[1]) : false;
}
Util.deleteCookie = function(name, _options) {
	var path = false;
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "path"	: path	= _options[_argument]; break;
			}
		}
	}
	if(typeof(path) === "string") {
		path = ";path="+path;
	}
	else {
		path = "";
	}
	document.cookie = encodeURIComponent(name) + "=" + path + ";expires=Thu, 01-Jan-70 00:00:01 GMT";
}
Util.saveNodeCookie = function(node, name, value, _options) {
	var ref = u.cookieReference(node, _options);
	var mem = JSON.parse(u.getCookie("man_mem"));
	if(!mem) {
		mem = {};
	}
	if(!mem[ref]) {
		mem[ref] = {};
	}
	mem[ref][name] = (value !== false && value !== undefined) ? value : "";
	u.saveCookie("man_mem", JSON.stringify(mem), {"path":"/"});
}
Util.getNodeCookie = function(node, name, _options) {
	var ref = u.cookieReference(node, _options);
	var mem = JSON.parse(u.getCookie("man_mem"));
	if(mem && mem[ref]) {
		if(name) {
			return mem[ref][name] ? mem[ref][name] : "";
		}
		else {
			return mem[ref];
		}
	}
	return false;
}
Util.deleteNodeCookie = function(node, name, _options) {
	var ref = u.cookieReference(node, _options);
	var mem = JSON.parse(u.getCookie("man_mem"));
	if(mem && mem[ref]) {
		if(name) {
			delete mem[ref][name];
		}
		else {
			delete mem[ref];
		}
	}
	u.saveCookie("man_mem", JSON.stringify(mem), {"path":"/"});
}
Util.cookieReference = function(node, _options) {
	var ref;
	var ignore_classnames = false;
	var ignore_classvars = false;
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "ignore_classnames"	: ignore_classnames	= _options[_argument]; break;
				case "ignore_classvars" 	: ignore_classvars	= _options[_argument]; break;
			}
		}
	}
	if(node.id) {
		ref = node.nodeName + "#" + node.id;
	}
	else {
		var node_identifier = "";
		if(node.name) {
			node_identifier = node.nodeName + "["+node.name+"]";
		}
		else if(node.className) {
			var classname = node.className;
			if(ignore_classnames) {
				var regex = new RegExp("(^| )("+ignore_classnames.split(",").join("|")+")($| )", "g");
				classname = classname.replace(regex, " ").replace(/[ ]{2,4}/, " ");
			}
			if(ignore_classvars) {
				classname = classname.replace(/(^| )[a-zA-Z_]+\:[\?\=\w\/\\#~\:\.\,\+\&\%\@\!\-]+(^| )/g, " ").replace(/[ ]{2,4}/g, " ");
			}
			node_identifier = node.nodeName+"."+classname.trim().replace(/ /g, ".");
		}
		else {
			node_identifier = node.nodeName
		}
		var id_node = node;
		while(!id_node.id) {
			id_node = id_node.parentNode;
		}
		if(id_node.id) {
			ref = id_node.nodeName + "#" + id_node.id + " " + node_identifier;
		}
		else {
			ref = node_identifier;
		}
	}
	return ref;
}
Util.querySelector = u.qs = function(query, scope) {
	scope = scope ? scope : document;
	return scope.querySelector(query);
}
Util.querySelectorAll = u.qsa = function(query, scope) {
	try {
		scope = scope ? scope : document;
		return scope.querySelectorAll(query);
	}
	catch(exception) {
		u.exception("u.qsa", arguments, exception);
	}
	return [];
}
Util.getElement = u.ge = function(identifier, scope) {
	var node, i, regexp;
	if(document.getElementById(identifier)) {
		return document.getElementById(identifier);
	}
	scope = scope ? scope : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	for(i = 0; node = scope.getElementsByTagName("*")[i]; i++) {
		if(regexp.test(node.className)) {
			return node;
		}
	}
	return scope.getElementsByTagName(identifier).length ? scope.getElementsByTagName(identifier)[0] : false;
}
Util.getElements = u.ges = function(identifier, scope) {
	var node, i, regexp;
	var nodes = new Array();
	scope = scope ? scope : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	for(i = 0; node = scope.getElementsByTagName("*")[i]; i++) {
		if(regexp.test(node.className)) {
			nodes.push(node);
		}
	}
	return nodes.length ? nodes : scope.getElementsByTagName(identifier);
}
Util.parentNode = u.pn = function(node, _options) {
	var exclude = "";
	var include = "";
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "include"      : include       = _options[_argument]; break;
				case "exclude"      : exclude       = _options[_argument]; break;
			}
		}
	}
	var exclude_nodes = exclude ? u.qsa(exclude) : [];
	var include_nodes = include ? u.qsa(include) : [];
	node = node.parentNode;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || (exclude && (u.inNodeList(node, exclude_nodes))) || (include && (!u.inNodeList(node, include_nodes))))) {
		node = node.parentNode;
	}
	return node;
}
Util.previousSibling = u.ps = function(node, _options) {
	var exclude = "";
	var include = "";
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "include"      : include       = _options[_argument]; break;
				case "exclude"      : exclude       = _options[_argument]; break;
			}
		}
	}
	var exclude_nodes = exclude ? u.qsa(exclude, node.parentNode) : [];
	var include_nodes = include ? u.qsa(include, node.parentNode) : [];
	node = node.previousSibling;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || (exclude && (u.inNodeList(node, exclude_nodes))) || (include && (!u.inNodeList(node, include_nodes))))) {
		node = node.previousSibling;
	}
	return node;
}
Util.nextSibling = u.ns = function(node, _options) {
	var exclude = "";
	var include = "";
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "include"      : include       = _options[_argument]; break;
				case "exclude"      : exclude       = _options[_argument]; break;
			}
		}
	}
	var exclude_nodes = exclude ? u.qsa(exclude, node.parentNode) : [];
	var include_nodes = include ? u.qsa(include, node.parentNode) : [];
	node = node.nextSibling;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || (exclude && (u.inNodeList(node, exclude_nodes))) || (include && (!u.inNodeList(node, include_nodes))))) {
		node = node.nextSibling;
	}
	return node;
}
Util.childNodes = u.cn = function(node, _options) {
	var exclude = "";
	var include = "";
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "include"      : include       = _options[_argument]; break;
				case "exclude"      : exclude       = _options[_argument]; break;
			}
		}
	}
	var exclude_nodes = exclude ? u.qsa(exclude, node) : [];
	var include_nodes = include ? u.qsa(include, node) : [];
	var i, child;
	var children = new Array();
	for(i = 0; child = node.childNodes[i]; i++) {
		if(child && child.nodeType != 3 && child.nodeType != 8 && (!exclude || (!u.inNodeList(child, exclude_nodes))) && (!include || (u.inNodeList(child, include_nodes)))) {
			children.push(child);
		}
	}
	return children;
}
Util.appendElement = u.ae = function(_parent, node_type, attributes) {
	try {
		var node = (typeof(node_type) == "object") ? node_type : document.createElement(node_type);
		node = _parent.appendChild(node);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				if(attribute == "html") {
					node.innerHTML = attributes[attribute];
				}
				else {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
		}
		return node;
	}
	catch(exception) {
		u.exception("u.ae", arguments, exception);
	}
	return false;
}
Util.insertElement = u.ie = function(_parent, node_type, attributes) {
	try {
		var node = (typeof(node_type) == "object") ? node_type : document.createElement(node_type);
		node = _parent.insertBefore(node, _parent.firstChild);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				if(attribute == "html") {
					node.innerHTML = attributes[attribute];
				}
				else {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
		}
		return node;
	}
	catch(exception) {
		u.exception("u.ie", arguments, exception);
	}
	return false;
}
Util.wrapElement = u.we = function(node, node_type, attributes) {
	try {
		var wrapper_node = node.parentNode.insertBefore(document.createElement(node_type), node);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				wrapper_node.setAttribute(attribute, attributes[attribute]);
			}
		}	
		wrapper_node.appendChild(node);
		return wrapper_node;
	}
	catch(exception) {
		u.exception("u.we", arguments, exception);
	}
	return false;
}
Util.wrapContent = u.wc = function(node, node_type, attributes) {
	try {
		var wrapper_node = document.createElement(node_type);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				wrapper_node.setAttribute(attribute, attributes[attribute]);
			}
		}	
		while(node.childNodes.length) {
			wrapper_node.appendChild(node.childNodes[0]);
		}
		node.appendChild(wrapper_node);
		return wrapper_node;
	}
	catch(exception) {
		u.exception("u.wc", arguments, exception);
	}
	return false;
}
Util.textContent = u.text = function(node) {
	try {
		return node.textContent;
	}
	catch(exception) {
		u.exception("u.text", arguments, exception);
	}
	return "";
}
Util.clickableElement = u.ce = function(node, _options) {
	node._use_link = "a";
	node._click_type = "manual";
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "use"			: node._use_link		= _options[_argument]; break;
				case "type"			: node._click_type		= _options[_argument]; break;
			}
		}
	}
	var a = (node.nodeName.toLowerCase() == "a" ? node : u.qs(node._use_link, node));
	if(a) {
		u.ac(node, "link");
		if(a.getAttribute("href") !== null) {
			node.url = a.href;
			a.removeAttribute("href");
			node._a = a;
		}
	}
	else {
		u.ac(node, "clickable");
	}
	if(typeof(u.e) != "undefined" && typeof(u.e.click) == "function") {
		u.e.click(node, _options);
		if(node._click_type == "link") {
			node.clicked = function(event) {
				if(typeof(node.preClicked) == "function") {
					node.preClicked();
				}
				if(event && (event.metaKey || event.ctrlKey)) {
					window.open(this.url);
				}
				else {
					if(typeof(u.h) != "undefined" && u.h.is_listening) {
						u.h.navigate(this.url, this);
					}
					else {
						location.href = this.url;
					}
				}
			}
		}
	}
	return node;
}
Util.classVar = u.cv = function(node, var_name) {
	try {
		var regexp = new RegExp(var_name + ":[?=\\w/\\#~:.,?+=?&%@!\\-]*");
		if(node.className.match(regexp)) {
			return node.className.match(regexp)[0].replace(var_name + ":", "");
		}
	}
	catch(exception) {
		u.exception("u.cv", arguments, exception);
	}
	return false;
}
Util.setClass = u.sc = function(node, classname) {
	try {
		var old_class = node.className;
		node.className = classname;
		node.offsetTop;
		return old_class;
	}
	catch(exception) {
		u.exception("u.sc", arguments, exception);
	}
	return false;
}
Util.hasClass = u.hc = function(node, classname) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)(" + classname + ")(\\s|$)");
			if(regexp.test(node.className)) {
				return true;
			}
		}
	}
	catch(exception) {
		u.exception("u.hc", arguments, exception);
	}
	return false;
}
Util.addClass = u.ac = function(node, classname, dom_update) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$)");
			if(!regexp.test(node.className)) {
				node.className += node.className ? " " + classname : classname;
				dom_update === false ? false : node.offsetTop;
			}
			return node.className;
		}
	}
	catch(exception) {
		u.exception("u.ac", arguments, exception);
	}
	return false;
}
Util.removeClass = u.rc = function(node, classname, dom_update) {
	try {
		if(classname) {
			var regexp = new RegExp("(\\b)" + classname + "(\\s|$)", "g");
			node.className = node.className.replace(regexp, " ").trim().replace(/[\s]{2}/g, " ");
			dom_update === false ? false : node.offsetTop;
			return node.className;
		}
	}
	catch(exception) {
		u.exception("u.rc", arguments, exception);
	}
	return false;
}
Util.toggleClass = u.tc = function(node, classname, _classname, dom_update) {
	try {
		var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$|\:)");
		if(regexp.test(node.className)) {
			u.rc(node, classname, false);
			if(_classname) {
				u.ac(node, _classname, false);
			}
		}
		else {
			u.ac(node, classname, false);
			if(_classname) {
				u.rc(node, _classname, false);
			}
		}
		dom_update === false ? false : node.offsetTop;
		return node.className;
	}
	catch(exception) {
		u.exception("u.tc", arguments, exception);
	}
	return false;
}
Util.applyStyle = u.as = function(node, property, value, dom_update) {
	node.style[u.vendorProperty(property)] = value;
	dom_update === false ? false : node.offsetTop;
}
Util.applyStyles = u.ass = function(node, styles, dom_update) {
	if(styles) {
		var style;
		for(style in styles) {
			node.style[u.vendorProperty(style)] = styles[style];
		}
	}
	dom_update === false ? false : node.offsetTop;
}
Util.getComputedStyle = u.gcs = function(node, property) {
	node.offsetHeight;
	property = (u.vendorProperty(property).replace(/([A-Z]{1})/g, "-$1")).toLowerCase().replace(/^(webkit|ms)/, "-$1");
	if(window.getComputedStyle) {
		return window.getComputedStyle(node, null).getPropertyValue(property);
	}
	return false;
}
Util.hasFixedParent = u.hfp = function(node) {
	while(node.nodeName.toLowerCase() != "body") {
		if(u.gcs(node.parentNode, "position").match("fixed")) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}
Util.insertAfter = u.ia = function(after_node, insert_node) {
	var next_node = u.ns(after_node);
	if(next_node) {
		after_node.parentNode.insertBefore(next_node, insert_node);
	}
	else {
		after_node.parentNode.appendChild(insert_node);
	}
}
Util.selectText = function(node) {
	var selection = window.getSelection();
	var range = document.createRange();
	range.selectNodeContents(node);
	selection.removeAllRanges();
	selection.addRange(range);
}
Util.inNodeList = function(node, list) {
	var i, list_node;
	for(i = 0; list_node = list[i]; i++) {
		if(list_node === node) {
			return true;
		}
	}
	return false;
}
Util.nodeWithin = u.nw = function(node, scope) {
	var node_key = u.randomString(8);
	var scope_key = u.randomString(8);
	u.ac(node, node_key);
	u.ac(scope, scope_key);
	if(u.qs("."+scope_key+" ."+node_key)) {
		u.rc(node, node_key);
		u.rc(scope, scope_key);
		return true;
	}
	u.rc(node, node_key);
	u.rc(scope, scope_key);
	return false;
}
u.easings = new function() {
	this["ease-in"] = function(progress) {
		return Math.pow((progress*this.duration) / this.duration, 3);
	}
	this["linear"] = function(progress) {
		return progress;
	}
	this["ease-out"] = function(progress) {
		return 1 - Math.pow(1 - ((progress*this.duration) / this.duration), 3);
	}
	this["linear"] = function(progress) {
		return (progress*this.duration) / this.duration;
	}
	this["ease-in-out"] = function(progress) {
		if((progress*this.duration) > (this.duration / 2)) {
			return 1 - Math.pow(1 - ((progress*this.duration) / this.duration), 3);
		}
		return Math.pow((progress*this.duration) / this.duration, 3);
	}
}
Util.Events = u.e = new function() {
	this.event_pref = typeof(document.ontouchmove) == "undefined" || (navigator.maxTouchPoints > 1 && navigator.userAgent.match(/Windows/i)) ? "mouse" : "touch";
	if(navigator.maxTouchPoints > 1) {
		if(typeof(document.ontouchmove) == "undefined" && typeof(document.onmousemove) == "undefined") {
			this.event_support = "multi";
		}
	}
	if(!this.event_support) {
		if(typeof(document.ontouchmove) == "undefined") {
			this.event_support = "mouse";
		}
		else {
			this.event_support = "touch";
		}
	}
	this.events = {
		"mouse": {
			"start":"mousedown",
			"move":"mousemove",
			"end":"mouseup",
			"over":"mouseover",
			"out":"mouseout"
		},
		"touch": {
			"start":"touchstart",
			"move":"touchmove",
			"end":"touchend",
			"over":"touchstart",
			"out":"touchend"
		}
	}
	this.kill = function(event) {
		if(event) {
			event.preventDefault();
			event.stopPropagation();
		}
	}
	this.addEvent = function(node, type, action) {
		try {
			node.addEventListener(type, action, false);
		}
		catch(exception) {
			alert("exception in addEvent:" + node + "," + type + ":" + exception);
		}
	}
	this.removeEvent = function(node, type, action) {
		try {
			node.removeEventListener(type, action, false);
		}
		catch(exception) {
			u.bug("exception in removeEvent:" + node + "," + type + ":" + exception);
		}
	}
	this.addStartEvent = this.addDownEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.addEvent(node, this.events.mouse.start, action);
			u.e.addEvent(node, this.events.touch.start, action);
		}
		else {
			u.e.addEvent(node, this.events[this.event_support].start, action);
		}
	}
	this.removeStartEvent = this.removeDownEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.removeEvent(node, this.events.mouse.start, action);
			u.e.removeEvent(node, this.events.touch.start, action);
		}
		else {
			u.e.removeEvent(node, this.events[this.event_support].start, action);
		}
	}
	this.addMoveEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.addEvent(node, this.events.mouse.move, action);
			u.e.addEvent(node, this.events.touch.move, action);
		}
		else {
			u.e.addEvent(node, this.events[this.event_support].move, action);
		}
	}
	this.removeMoveEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.removeEvent(node, this.events.mouse.move, action);
			u.e.removeEvent(node, this.events.touch.move, action);
		}
		else {
			u.e.removeEvent(node, this.events[this.event_support].move, action);
		}
	}
	this.addEndEvent = this.addUpEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.addEvent(node, this.events.mouse.end, action);
			u.e.addEvent(node, this.events.touch.end, action);
		}
		else {
			u.e.addEvent(node, this.events[this.event_support].end, action);
		}
	}
	this.removeEndEvent = this.removeUpEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.removeEvent(node, this.events.mouse.end, action);
			u.e.removeEvent(node, this.events.touch.end, action);
		}
		else {
			u.e.removeEvent(node, this.events[this.event_support].end, action);
		}
	}
	this.addOverEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.addEvent(node, this.events.mouse.over, action);
			u.e.addEvent(node, this.events.touch.over, action);
		}
		else {
			u.e.addEvent(node, this.events[this.event_support].over, action);
		}
	}
	this.removeOverEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.removeEvent(node, this.events.mouse.over, action);
			u.e.removeEvent(node, this.events.touch.over, action);
		}
		else {
			u.e.removeEvent(node, this.events[this.event_support].over, action);
		}
	}
	this.addOutEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.addEvent(node, this.events.mouse.out, action);
			u.e.addEvent(node, this.events.touch.out, action);
		}
		else {
			u.e.addEvent(node, this.events[this.event_support].out, action);
		}
	}
	this.removeOutEvent = function(node, action) {
		if(this.event_support == "multi") {
			u.e.removeEvent(node, this.events.mouse.out, action);
			u.e.removeEvent(node, this.events.touch.out, action);
		}
		else {
			u.e.removeEvent(node, this.events[this.event_support].out, action);
		}
	}
	this.resetClickEvents = function(node) {
		u.t.resetTimer(node.t_held);
		u.t.resetTimer(node.t_clicked);
		this.removeEvent(node, "mouseup", this._dblclicked);
		this.removeEvent(node, "touchend", this._dblclicked);
		this.removeEvent(node, "mousemove", this._cancelClick);
		this.removeEvent(node, "touchmove", this._cancelClick);
		this.removeEvent(node, "mouseout", this._cancelClick);
		this.removeEvent(node, "mousemove", this._move);
		this.removeEvent(node, "touchmove", this._move);
	}
	this.resetEvents = function(node) {
		this.resetClickEvents(node);
		if(typeof(this.resetDragEvents) == "function") {
			this.resetDragEvents(node);
		}
	}
	this.resetNestedEvents = function(node) {
		while(node && node.nodeName != "HTML") {
			this.resetEvents(node);
			node = node.parentNode;
		}
	}
	this._inputStart = function(event) {
		this.event_var = event;
		this.input_timestamp = event.timeStamp;
		this.start_event_x = u.eventX(event);
		this.start_event_y = u.eventY(event);
		this.current_xps = 0;
		this.current_yps = 0;
		this.move_timestamp = event.timeStamp;
		this.move_last_x = 0;
		this.move_last_y = 0;
		this._moves_cancel = 0;
		this.swiped = false;
		if(this.e_click || this.e_dblclick || this.e_hold) {
			if(event.type.match(/mouse/)) {
				var node = this;
				while(node) {
					if(node.e_drag || node.e_swipe) {
						u.e.addMoveEvent(this, u.e._cancelClick);
						break;
					}
					else {
						node = node.parentNode;
					}
				}
				u.e.addEvent(this, "mouseout", u.e._cancelClick);
			}
			else {
				u.e.addMoveEvent(this, u.e._cancelClick);
			}
			u.e.addMoveEvent(this, u.e._move);
			u.e.addEndEvent(this, u.e._dblclicked);
		}
		if(this.e_hold) {
			this.t_held = u.t.setTimer(this, u.e._held, 750);
		}
		if(this.e_drag || this.e_swipe) {
			u.e.addMoveEvent(this, u.e._pick);
			u.e.addEndEvent(this, u.e._drop);
		}
		if(this.e_scroll) {
			u.e.addMoveEvent(this, u.e._scrollStart);
			u.e.addEndEvent(this, u.e._scrollEnd);
		}
		if(typeof(this.inputStarted) == "function") {
			this.inputStarted(event);
		}
	}
	this._cancelClick = function(event) {
		var offset_x = u.eventX(event) - this.start_event_x;
		var offset_y = u.eventY(event) - this.start_event_y;
		if(event.type.match(/mouseout/) || this._moves_cancel > 1 || (event.type.match(/move/) && (Math.abs(offset_x) > 15 || Math.abs(offset_y) > 15))) {
			u.e.resetClickEvents(this);
			if(typeof(this.clickCancelled) == "function") {
				this.clickCancelled(event);
			}
		}
		else if(event.type.match(/move/)) {
			this._moves_cancel++;
		}
	}
	this._move = function(event) {
		if(typeof(this.moved) == "function") {
			this.current_x = u.eventX(event) - this.start_event_x;
			this.current_y = u.eventY(event) - this.start_event_y;
			this.current_xps = Math.round(((this.current_x - this.move_last_x) / (event.timeStamp - this.move_timestamp)) * 1000);
			this.current_yps = Math.round(((this.current_y - this.move_last_y) / (event.timeStamp - this.move_timestamp)) * 1000);
			this.move_timestamp = event.timeStamp;
			this.move_last_x = this.current_x;
			this.move_last_y = this.current_y;
			this.moved(event);
		}
	}
	this.hold = function(node, _options) {
		node.e_hold_options = _options ? _options : {};
		node.e_hold_options.eventAction = u.stringOr(node.e_hold_options.eventAction, "Held");
		node.e_hold = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._held = function(event) {
		this.e_hold_options.event = event;
		u.stats.event(this, this.e_hold_options);
		u.e.resetNestedEvents(this);
		if(typeof(this.held) == "function") {
			this.held(event);
		}
	}
	this.click = this.tap = function(node, _options) {
		node.e_click_options = _options ? _options : {};
		node.e_click_options.eventAction = u.stringOr(node.e_click_options.eventAction, "Clicked");
		node.e_click = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._clicked = function(event) {
		if(this.e_click_options) {
			this.e_click_options.event = event;
			u.stats.event(this, this.e_click_options);
		}
		u.e.resetNestedEvents(this);
		if(typeof(this.clicked) == "function") {
			this.clicked(event);
		}
	}
	this.dblclick = this.doubletap = function(node, _options) {
		node.e_dblclick_options = _options ? _options : {};
		node.e_dblclick_options.eventAction = u.stringOr(node.e_dblclick_options.eventAction, "DblClicked");
		node.e_dblclick = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._dblclicked = function(event) {
		if(u.t.valid(this.t_clicked) && event) {
			this.e_dblclick_options.event = event;
			u.stats.event(this, this.e_dblclick_options);
			u.e.resetNestedEvents(this);
			if(typeof(this.dblclicked) == "function") {
				this.dblclicked(event);
			}
			return;
		}
		else if(!this.e_dblclick) {
			this._clicked = u.e._clicked;
			this._clicked(event);
		}
		else if(event.type == "timeout") {
			this._clicked = u.e._clicked;
			this._clicked(this.event_var);
		}
		else {
			u.e.resetNestedEvents(this);
			this.t_clicked = u.t.setTimer(this, u.e._dblclicked, 400);
		}
	}
	this.hover = function(node, _options) {
		node._hover_out_delay = 100;
		node._callback_out = "out";
		node._callback_over = "over";
		if(typeof(_options) == "object") {
			var argument;
			for(argument in _options) {
				switch(argument) {
					case "over"				: node._callback_over		= _options[argument]; break;
					case "out"				: node._callback_out		= _options[argument]; break;
					case "delay"			: node._hover_out_delay		= _options[argument]; break;
				}
			}
		}
		node.e_hover = true;
		u.e.addOverEvent(node, this._over);
		u.e.addOutEvent(node, this._out);
	}
	this._over = function(event) {
		u.t.resetTimer(this.t_out);
		if(typeof(this[this._callback_over]) == "function" && !this.is_hovered) {
			this[this._callback_over](event);
		}
		this.is_hovered = true;
	}
	this._out = function(event) {
		this.t_out = u.t.setTimer(this, u.e.__out, this._hover_out_delay, event);
	}
	this.__out = function(event) {
		this.is_hovered = false;
		if(typeof(this[this._callback_out]) == "function") {
			this[this._callback_out](event);
		}
	}
}
u.e.addDOMReadyEvent = function(action) {
	if(document.readyState && document.addEventListener) {
		if((document.readyState == "interactive" && !u.browser("ie")) || document.readyState == "complete" || document.readyState == "loaded") {
			action();
		}
		else {
			var id = u.randomString();
			window["DOMReady_" + id] = action;
			eval('window["_DOMReady_' + id + '"] = function() {window["DOMReady_'+id+'"](); u.e.removeEvent(document, "DOMContentLoaded", window["_DOMReady_' + id + '"])}');
			u.e.addEvent(document, "DOMContentLoaded", window["_DOMReady_" + id]);
		}
	}
	else {
		u.e.addOnloadEvent(action);
	}
}
u.e.addOnloadEvent = function(action) {
	if(document.readyState && (document.readyState == "complete" || document.readyState == "loaded")) {
		action();
	}
	else {
		var id = u.randomString();
		window["Onload_" + id] = action;
		eval('window["_Onload_' + id + '"] = function() {window["Onload_'+id+'"](); u.e.removeEvent(window, "load", window["_Onload_' + id + '"])}');
		u.e.addEvent(window, "load", window["_Onload_" + id]);
	}
}
u.e.addWindowEvent = function(node, type, action) {
	var id = u.randomString();
	window["_OnWindowEvent_node_"+ id] = node;
	if(typeof(action) == "function") {
		eval('window["_OnWindowEvent_callback_' + id + '"] = function(event) {window["_OnWindowEvent_node_'+ id + '"]._OnWindowEvent_callback_'+id+' = '+action+'; window["_OnWindowEvent_node_'+ id + '"]._OnWindowEvent_callback_'+id+'(event);};');
	} 
	else {
		eval('window["_OnWindowEvent_callback_' + id + '"] = function(event) {if(typeof(window["_OnWindowEvent_node_'+ id + '"]["'+action+'"]) == "function") {window["_OnWindowEvent_node_'+id+'"]["'+action+'"](event);}};');
	}
	u.e.addEvent(window, type, window["_OnWindowEvent_callback_" + id]);
	return id;
}
u.e.removeWindowEvent = function(node, type, id) {
	u.e.removeEvent(window, type, window["_OnWindowEvent_callback_"+id]);
	window["_OnWindowEvent_node_"+id] = null;
	window["_OnWindowEvent_callback_"+id] = null;
}
u.e.addWindowStartEvent = function(node, action) {
	var id = u.randomString();
	window["_Onstart_node_"+ id] = node;
	if(typeof(action) == "function") {
		eval('window["_Onstart_callback_' + id + '"] = function(event) {window["_Onstart_node_'+ id + '"]._Onstart_callback_'+id+' = '+action+'; window["_Onstart_node_'+ id + '"]._Onstart_callback_'+id+'(event);};');
	} 
	else {
		eval('window["_Onstart_callback_' + id + '"] = function(event) {if(typeof(window["_Onstart_node_'+ id + '"]["'+action+'"]) == "function") {window["_Onstart_node_'+id+'"]["'+action+'"](event);}};');
	}
	u.e.addStartEvent(window, window["_Onstart_callback_" + id]);
	return id;
}
u.e.removeWindowStartEvent = function(node, id) {
	u.e.removeStartEvent(window, window["_Onstart_callback_"+id]);
	window["_Onstart_node_"+id]["_Onstart_callback_"+id] = null;
	window["_Onstart_node_"+id] = null;
	window["_Onstart_callback_"+id] = null;
}
u.e.addWindowMoveEvent = function(node, action) {
	var id = u.randomString();
	window["_Onmove_node_"+ id] = node;
	if(typeof(action) == "function") {
		eval('window["_Onmove_callback_' + id + '"] = function(event) {window["_Onmove_node_'+ id + '"]._Onmove_callback_'+id+' = '+action+'; window["_Onmove_node_'+ id + '"]._Onmove_callback_'+id+'(event);};');
	} 
	else {
		eval('window["_Onmove_callback_' + id + '"] = function(event) {if(typeof(window["_Onmove_node_'+ id + '"]["'+action+'"]) == "function") {window["_Onmove_node_'+id+'"]["'+action+'"](event);}};');
	}
	u.e.addMoveEvent(window, window["_Onmove_callback_" + id]);
	return id;
}
u.e.removeWindowMoveEvent = function(node, id) {
	u.e.removeMoveEvent(window, window["_Onmove_callback_" + id]);
	window["_Onmove_node_"+ id]["_Onmove_callback_"+id] = null;
	window["_Onmove_node_"+ id] = null;
	window["_Onmove_callback_"+ id] = null;
}
u.e.addWindowEndEvent = function(node, action) {
	var id = u.randomString();
	window["_Onend_node_"+ id] = node;
	if(typeof(action) == "function") {
		eval('window["_Onend_callback_' + id + '"] = function(event) {window["_Onend_node_'+ id + '"]._Onend_callback_'+id+' = '+action+'; window["_Onend_node_'+ id + '"]._Onend_callback_'+id+'(event);};');
	} 
	else {
		eval('window["_Onend_callback_' + id + '"] = function(event) {if(typeof(window["_Onend_node_'+ id + '"]["'+action+'"]) == "function") {window["_Onend_node_'+id+'"]["'+action+'"](event);}};');
	}
	u.e.addEndEvent(window, window["_Onend_callback_" + id]);
	return id;
}
u.e.removeWindowEndEvent = function(node, id) {
	u.e.removeEndEvent(window, window["_Onend_callback_" + id]);
	window["_Onend_node_"+ id]["_Onend_callback_"+id] = null;
	window["_Onend_node_"+ id] = null;
	window["_Onend_callback_"+ id] = null;
}
u.e.addWindowResizeEvent = function(node, action) {
	var id = u.randomString();
	window["_Onresize_node_"+ id] = node;
	if(typeof(action) == "function") {
		eval('window["_Onresize_callback_' + id + '"] = function(event) {window["_Onresize_node_'+ id + '"]._Onresize_callback_'+id+' = '+action+'; window["_Onresize_node_'+ id + '"]._Onresize_callback_'+id+'(event);};');
	} 
	else {
		eval('window["_Onresize_callback_' + id + '"] = function(event) {if(typeof(window["_Onresize_node_'+ id + '"]["'+action+'"]) == "function") {window["_Onresize_node_'+id+'"]["'+action+'"](event);}};');
	}
	u.e.addEvent(window, "resize", window["_Onresize_callback_" + id]);
	return id;
}
u.e.removeWindowResizeEvent = function(node, id) {
	u.e.removeEvent(window, "resize", window["_Onresize_callback_"+id]);
	window["_Onresize_node_"+id]["_Onresize_callback_"+id] = null;
	window["_Onresize_node_"+id] = null;
	window["_Onresize_callback_"+id] = null;
}
u.e.addWindowScrollEvent = function(node, action) {
	var id = u.randomString();
	window["_Onscroll_node_"+ id] = node;
	if(typeof(action) == "function") {
		eval('window["_Onscroll_callback_' + id + '"] = function(event) {window["_Onscroll_node_'+ id + '"]._Onscroll_callback_'+id+' = '+action+'; window["_Onscroll_node_'+ id + '"]._Onscroll_callback_'+id+'(event);};');
	} 
	else {
		eval('window["_Onscroll_callback_' + id + '"] = function(event) {if(typeof(window["_Onscroll_node_'+ id + '"]["'+action+'"]) == "function") {window["_Onscroll_node_'+id+'"]["'+action+'"](event);}};');
	}
	u.e.addEvent(window, "scroll", window["_Onscroll_callback_" + id]);
	return id;
}
u.e.removeWindowScrollEvent = function(node, id) {
	u.e.removeEvent(window, "scroll", window["_Onscroll_callback_"+id]);
	window["_Onscroll_node_"+id]["_Onscroll_callback_"+id] = null;
	window["_Onscroll_node_"+id] = null;
	window["_Onscroll_callback_"+id] = null;
}
u.e.resetDragEvents = function(node) {
	node._moves_pick = 0;
	this.removeEvent(node, "mousemove", this._pick);
	this.removeEvent(node, "touchmove", this._pick);
	this.removeEvent(node, "mousemove", this._drag);
	this.removeEvent(node, "touchmove", this._drag);
	this.removeEvent(node, "mouseup", this._drop);
	this.removeEvent(node, "touchend", this._drop);
	this.removeEvent(node, "mouseout", this._drop_out);
	this.removeEvent(node, "mouseover", this._drop_over);
	this.removeEvent(node, "mousemove", this._scrollStart);
	this.removeEvent(node, "touchmove", this._scrollStart);
	this.removeEvent(node, "mousemove", this._scrolling);
	this.removeEvent(node, "touchmove", this._scrolling);
	this.removeEvent(node, "mouseup", this._scrollEnd);
	this.removeEvent(node, "touchend", this._scrollEnd);
}
u.e.overlap = function(node, boundaries, strict) {
	if(boundaries.constructor.toString().match("Array")) {
		var boundaries_start_x = Number(boundaries[0]);
		var boundaries_start_y = Number(boundaries[1]);
		var boundaries_end_x = Number(boundaries[2]);
		var boundaries_end_y = Number(boundaries[3]);
	}
	else if(boundaries.constructor.toString().match("HTML")) {
		var boundaries_start_x = u.absX(boundaries) - u.absX(node);
		var boundaries_start_y =  u.absY(boundaries) - u.absY(node);
		var boundaries_end_x = Number(boundaries_start_x + boundaries.offsetWidth);
		var boundaries_end_y = Number(boundaries_start_y + boundaries.offsetHeight);
	}
	var node_start_x = Number(node._x);
	var node_start_y = Number(node._y);
	var node_end_x = Number(node_start_x + node.offsetWidth);
	var node_end_y = Number(node_start_y + node.offsetHeight);
	if(strict) {
		if(node_start_x >= boundaries_start_x && node_start_y >= boundaries_start_y && node_end_x <= boundaries_end_x && node_end_y <= boundaries_end_y) {
			return true;
		}
		else {
			return false;
		}
	} 
	else if(node_end_x < boundaries_start_x || node_start_x > boundaries_end_x || node_end_y < boundaries_start_y || node_start_y > boundaries_end_y) {
		return false;
	}
	return true;
}
u.e.drag = function(node, boundaries, _options) {
	node.e_drag_options = _options ? _options : {};
	node.e_drag = true;
	node._moves_counted = 0;
	node._moves_required = (u.system("android, winphone")) ? 2 : 0;
	if(node.childNodes.length < 2 && node.innerHTML.trim() == "") {
		node.innerHTML = "&nbsp;";
	}
	node.drag_strict = true;
	node.drag_elastica = 0;
	node.drag_dropout = true;
	node.show_bounds = false;
	node.callback_picked = "picked";
	node.callback_moved = "moved";
	node.callback_dropped = "dropped";
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "strict"			: node.drag_strict			= _options[_argument]; break;
				case "elastica"			: node.drag_elastica		= Number(_options[_argument]); break;
				case "dropout"			: node.drag_dropout			= _options[_argument]; break;
				case "show_bounds"		: node.show_bounds			= _options[_argument]; break; 
				case "vertical_lock"	: node.vertical_lock		= _options[_argument]; break;
				case "horizontal_lock"	: node.horizontal_lock		= _options[_argument]; break;
				case "callback_picked"	: node.callback_picked		= _options[_argument]; break;
				case "callback_moved"	: node.callback_moved		= _options[_argument]; break;
				case "callback_dropped"	: node.callback_dropped		= _options[_argument]; break;
			}
		}
	}
	if((boundaries.constructor && boundaries.constructor.toString().match("Array")) || (boundaries.scopeName && boundaries.scopeName != "HTML")) {
		node.start_drag_x = Number(boundaries[0]);
		node.start_drag_y = Number(boundaries[1]);
		node.end_drag_x = Number(boundaries[2]);
		node.end_drag_y = Number(boundaries[3]);
	}
	else if((boundaries.constructor && boundaries.constructor.toString().match("HTML")) || (boundaries.scopeName && boundaries.scopeName == "HTML")) {
		node.start_drag_x = u.absX(boundaries) - u.absX(node);
		node.start_drag_y = u.absY(boundaries) - u.absY(node);
		node.end_drag_x = node.start_drag_x + boundaries.offsetWidth;
		node.end_drag_y = node.start_drag_y + boundaries.offsetHeight;
	}
	if(node.show_bounds) {
		var debug_bounds = u.ae(document.body, "div", {"class":"debug_bounds"})
		debug_bounds.style.position = "absolute";
		debug_bounds.style.background = "red"
		debug_bounds.style.left = (u.absX(node) + node.start_drag_x - 1) + "px";
		debug_bounds.style.top = (u.absY(node) + node.start_drag_y - 1) + "px";
		debug_bounds.style.width = (node.end_drag_x - node.start_drag_x) + "px";
		debug_bounds.style.height = (node.end_drag_y - node.start_drag_y) + "px";
		debug_bounds.style.border = "1px solid white";
		debug_bounds.style.zIndex = 9999;
		debug_bounds.style.opacity = .5;
		if(document.readyState && document.readyState == "interactive") {
			debug_bounds.innerHTML = "WARNING - injected on DOMLoaded"; 
		}
		u.bug("node: "+u.nodeId(node)+" in (" + u.absX(node) + "," + u.absY(node) + "), (" + (u.absX(node)+node.offsetWidth) + "," + (u.absY(node)+node.offsetHeight) +")");
		u.bug("boundaries: (" + node.start_drag_x + "," + node.start_drag_y + "), (" + node.end_drag_x + ", " + node.end_drag_y + ")");
	}
	node._x = node._x ? node._x : 0;
	node._y = node._y ? node._y : 0;
	node.locked = ((node.end_drag_x - node.start_drag_x == node.offsetWidth) && (node.end_drag_y - node.start_drag_y == node.offsetHeight));
	node.only_vertical = (node.vertical_lock || (!node.locked && node.end_drag_x - node.start_drag_x == node.offsetWidth));
	node.only_horizontal = (node.horizontal_lock || (!node.locked && node.end_drag_y - node.start_drag_y == node.offsetHeight));
	u.e.addStartEvent(node, this._inputStart);
}
u.e._pick = function(event) {
	var init_speed_x = Math.abs(this.start_event_x - u.eventX(event));
	var init_speed_y = Math.abs(this.start_event_y - u.eventY(event));
	if(
		(init_speed_x > init_speed_y && this.only_horizontal) || 
		(init_speed_x < init_speed_y && this.only_vertical) ||
		(!this.only_vertical && !this.only_horizontal)) {
		if(this._moves_counted >= this._moves_required) {
			this._moves_counted = 0;
			u.e.resetNestedEvents(this);
			u.e.kill(event);
			if(u.hasFixedParent(this)) {
				this.has_fixed_parent = true;
			}
			else {
				this.has_fixed_parent = false;
			}
			this.move_timestamp = event.timeStamp;
			this.move_last_x = this._x;
			this.move_last_y = this._y;
			if(u.hasFixedParent(this)) {
				this.start_input_x = u.eventX(event) - this._x - u.scrollX(); 
				this.start_input_y = u.eventY(event) - this._y - u.scrollY();
			}
			else {
				this.start_input_x = u.eventX(event) - this._x; 
				this.start_input_y = u.eventY(event) - this._y;
			}
			this.current_xps = 0;
			this.current_yps = 0;
			u.a.transition(this, "none");
			u.e.addMoveEvent(this, u.e._drag);
			u.e.addEndEvent(this, u.e._drop);
			if(typeof(this[this.callback_picked]) == "function") {
				this[this.callback_picked](event);
			}
			if(this.drag_dropout && event.type.match(/mouse/)) {
				this._dropOutDrag = u.e._drag;
				this._dropOutDrop = u.e._drop;
				u.e.addOutEvent(this, u.e._drop_out);
			}
		}
		else {
			this._moves_counted++;
		}
	}
}
u.e._drag = function(event) {
	if(this.has_fixed_parent) {
		this.current_x = u.eventX(event) - this.start_input_x - u.scrollX();
		this.current_y = u.eventY(event) - this.start_input_y - u.scrollY();
	}
	else {
		this.current_x = u.eventX(event) - this.start_input_x;
		this.current_y = u.eventY(event) - this.start_input_y;
	}
	this.current_xps = Math.round(((this.current_x - this.move_last_x) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.current_yps = Math.round(((this.current_y - this.move_last_y) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.move_timestamp = event.timeStamp;
	this.move_last_x = this.current_x;
	this.move_last_y = this.current_y;
	if(!this.locked && this.only_vertical) {
		this._y = this.current_y;
	}
	else if(!this.locked && this.only_horizontal) {
		this._x = this.current_x;
	}
	else if(!this.locked) {
		this._x = this.current_x;
		this._y = this.current_y;
	}
	u.bug("locked:" + this.locked);
	if(this.e_swipe) {
		if(this.only_horizontal) {
			if(this.current_xps < 0) {
				this.swiped = "left";
			}
			else {
				this.swiped = "right";
			}
		}
		else if(this.only_vertical) {
			if(this.current_yps < 0) {
				this.swiped = "up";
			}
			else {
				this.swiped = "down";
			}
		}
		else {
			if(Math.abs(this.current_xps) > Math.abs(this.current_yps)) {
				if(this.current_xps < 0) {
					this.swiped = "left";
				}
				else {
					this.swiped = "right";
				}
			}
			else if(Math.abs(this.current_xps) < Math.abs(this.current_yps)) {
				if(this.current_yps < 0) {
					this.swiped = "up";
				}
				else {
					this.swiped = "down";
				}
			}
		}
	}
	if(!this.locked) {
		if(u.e.overlap(this, [this.start_drag_x, this.start_drag_y, this.end_drag_x, this.end_drag_y], true)) {
			u.a.translate(this, this._x, this._y);
		}
		else if(this.drag_elastica) {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			var offset = false;
			if(!this.only_vertical && this._x < this.start_drag_x) {
				offset = this._x < this.start_drag_x - this.drag_elastica ? - this.drag_elastica : this._x - this.start_drag_x;
				this._x = this.start_drag_x;
				this.current_x = this._x + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.only_vertical && this._x + this.offsetWidth > this.end_drag_x) {
				offset = this._x + this.offsetWidth > this.end_drag_x + this.drag_elastica ? this.drag_elastica : this._x + this.offsetWidth - this.end_drag_x;
				this._x = this.end_drag_x - this.offsetWidth;
				this.current_x = this._x + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_x = this._x;
			}
			if(!this.only_horizontal && this._y < this.start_drag_y) {
				offset = this._y < this.start_drag_y - this.drag_elastica ? - this.drag_elastica : this._y - this.start_drag_y;
				this._y = this.start_drag_y;
				this.current_y = this._y + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.horizontal && this._y + this.offsetHeight > this.end_drag_y) {
				offset = (this._y + this.offsetHeight > this.end_drag_y + this.drag_elastica) ? this.drag_elastica : (this._y + this.offsetHeight - this.end_drag_y);
				this._y = this.end_drag_y - this.offsetHeight;
				this.current_y = this._y + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_y = this._y;
			}
			if(offset) {
				u.a.translate(this, this.current_x, this.current_y);
			}
		}
		else {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			if(this._x < this.start_drag_x) {
				this._x = this.start_drag_x;
			}
			else if(this._x + this.offsetWidth > this.end_drag_x) {
				this._x = this.end_drag_x - this.offsetWidth;
			}
			if(this._y < this.start_drag_y) {
				this._y = this.start_drag_y;
			}
			else if(this._y + this.offsetHeight > this.end_drag_y) { 
				this._y = this.end_drag_y - this.offsetHeight;
			}
			u.a.translate(this, this._x, this._y);
		}
	}
	if(typeof(this[this.callback_moved]) == "function") {
		this[this.callback_moved](event);
	}
}
u.e._drop = function(event) {
	u.e.resetEvents(this);
	if(this.e_swipe && this.swiped) {
		this.e_swipe_options.eventAction = "Swiped "+ this.swiped;
		u.stats.event(this, this.e_swipe_options);
		if(this.swiped == "left" && typeof(this.swipedLeft) == "function") {
			this.swipedLeft(event);
		}
		else if(this.swiped == "right" && typeof(this.swipedRight) == "function") {
			this.swipedRight(event);
		}
		else if(this.swiped == "down" && typeof(this.swipedDown) == "function") {
			this.swipedDown(event);
		}
		else if(this.swiped == "up" && typeof(this.swipedUp) == "function") {
			this.swipedUp(event);
		}
	}
	else if(!this.drag_strict && !this.locked) {
		this.current_x = Math.round(this._x + (this.current_xps/2));
		this.current_y = Math.round(this._y + (this.current_yps/2));
		if(this.only_vertical || this.current_x < this.start_drag_x) {
			this.current_x = this.start_drag_x;
		}
		else if(this.current_x + this.offsetWidth > this.end_drag_x) {
			this.current_x = this.end_drag_x - this.offsetWidth;
		}
		if(this.only_horizontal || this.current_y < this.start_drag_y) {
			this.current_y = this.start_drag_y;
		}
		else if(this.current_y + this.offsetHeight > this.end_drag_y) {
			this.current_y = this.end_drag_y - this.offsetHeight;
		}
		this.transitioned = function() {
			this.transitioned = null;
			u.a.transition(this, "none");
			if(typeof(this.projected) == "function") {
				this.projected(event);
			}
		}
		if(this.current_xps || this.current_yps) {
			u.a.transition(this, "all 1s cubic-bezier(0,0,0.25,1)");
		}
		else {
			u.a.transition(this, "all 0.2s cubic-bezier(0,0,0.25,1)");
		}
		u.a.translate(this, this.current_x, this.current_y);
	}
	if(this.e_drag && !this.e_swipe) {
		this.e_drag_options.eventAction = u.stringOr(this.e_drag_options.eventAction, "Dropped");
		u.stats.event(this, this.e_drag_options);
	}
	if(typeof(this[this.callback_dropped]) == "function") {
		this[this.callback_dropped](event);
	}
}
u.e._drop_out = function(event) {
	this._drop_out_id = u.randomString();
	document["_DroppedOutNode" + this._drop_out_id] = this;
	eval('document["_DroppedOutMove' + this._drop_out_id + '"] = function(event) {document["_DroppedOutNode' + this._drop_out_id + '"]._dropOutDrag(event);}');
	eval('document["_DroppedOutOver' + this._drop_out_id + '"] = function(event) {u.e.removeEvent(document, "mousemove", document["_DroppedOutMove' + this._drop_out_id + '"]);u.e.removeEvent(document, "mouseup", document["_DroppedOutEnd' + this._drop_out_id + '"]);u.e.removeEvent(document["_DroppedOutNode' + this._drop_out_id + '"], "mouseover", document["_DroppedOutOver' + this._drop_out_id + '"]);}');
	eval('document["_DroppedOutEnd' + this._drop_out_id + '"] = function(event) {u.e.removeEvent(document, "mousemove", document["_DroppedOutMove' + this._drop_out_id + '"]);u.e.removeEvent(document, "mouseup", document["_DroppedOutEnd' + this._drop_out_id + '"]);u.e.removeEvent(document["_DroppedOutNode' + this._drop_out_id + '"], "mouseover", document["_DroppedOutOver' + this._drop_out_id + '"]);document["_DroppedOutNode' + this._drop_out_id + '"]._dropOutDrop(event);}');
	u.e.addEvent(document, "mousemove", document["_DroppedOutMove" + this._drop_out_id]);
	u.e.addEvent(this, "mouseover", document["_DroppedOutOver" + this._drop_out_id]);
	u.e.addEvent(document, "mouseup", document["_DroppedOutEnd" + this._drop_out_id]);
}
u.e.swipe = function(node, boundaries, _options) {
	node.e_swipe_options = _options ? _options : {};
	node.e_swipe = true;
	u.e.drag(node, boundaries, _options);
}
Util.Form = u.f = new function() {
	this.customInit = {};
	this.customValidate = {};
	this.customSend = {};
	this.customHintPosition = {};
	this.init = function(_form, _options) {
		var i, j, field, action, input, hidden_field;
		if(_form.nodeName.toLowerCase() != "form") {
			_form.native_form = u.pn(_form, {"include":"form"});
			if(!_form.native_form) {
				u.bug("there is no form in this document??");
				return;
			}
		}
		else {
			_form.native_form = _form;
		}
		_form._focus_z_index = 50;
		_form._hover_z_index = 49;
		_form._validation = true;
		_form._debug_init = false;
		if(typeof(_options) == "object") {
			var _argument;
			for(_argument in _options) {
				switch(_argument) {
					case "validation"       : _form._validation      = _options[_argument]; break;
					case "focus_z"          : _form._focus_z_index   = _options[_argument]; break;
					case "debug"            : _form._debug_init      = _options[_argument]; break;
				}
			}
		}
		_form.native_form.onsubmit = function(event) {
			if(event.target._form) {
				return false;
			}
		}
		_form.native_form.setAttribute("novalidate", "novalidate");
		_form.DOMsubmit = _form.native_form.submit;
		_form.submit = this._submit;
		_form.DOMreset = _form.native_form.reset;
		_form.reset = this._reset;
		_form.fields = {};
		_form.actions = {};
		_form.error_fields = {};
		_form.labelstyle = u.cv(_form, "labelstyle");
		var fields = u.qsa(".field", _form);
		for(i = 0; field = fields[i]; i++) {
			field._base_z_index = u.gcs(field, "z-index");
			field._help = u.qs(".help", field);
			field._hint = u.qs(".hint", field);
			field._error = u.qs(".error", field);
			field._indicator = u.ae(field, "div", {"class":"indicator"});
			if(typeof(u.f.fixFieldHTML) == "function") {
				u.f.fixFieldHTML(field);
			}
			field._initialized = false;
			var custom_init;
			for(custom_init in this.customInit) {
				if(u.hc(field, custom_init)) {
					this.customInit[custom_init](_form, field);
					field._initialized = true;
				}
			}
			if(!field._initialized) {
				if(u.hc(field, "string|email|tel|number|integer|password|date|datetime")) {
					field._input = u.qs("input", field);
					field._input._form = _form;
					field._input.field = field;
					_form.fields[field._input.name] = field._input;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					field._input.val = this._value;
					u.e.addEvent(field._input, "keyup", this._updated);
					u.e.addEvent(field._input, "change", this._changed);
					this.inputOnEnter(field._input);
					this.activateInput(field._input);
					this.validate(field._input);
				}
				else if(u.hc(field, "text")) {
					field._input = u.qs("textarea", field);
					field._input._form = _form;
					field._input.field = field;
					_form.fields[field._input.name] = field._input;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					field._input.val = this._value;
					if(u.hc(field, "autoexpand")) {
						var current_height = parseInt(u.gcs(field._input, "height"));
						var current_value = field._input.val();
						field._input.value = "";
						u.as(field._input, "overflow", "hidden");
						field._input.autoexpand_offset = 0;
						if(parseInt(u.gcs(field._input, "height")) != field._input.scrollHeight) {
							field._input.autoexpand_offset = field._input.scrollHeight - parseInt(u.gcs(field._input, "height"));
						}
						field._input.value = current_value;
						field._input.setHeight = function() {
							var textarea_height = parseInt(u.gcs(this, "height"));
							if(this.val()) {
								if(u.browser("webkit") || u.browser("firefox", ">=29")) {
									if(this.scrollHeight - this.autoexpand_offset > textarea_height) {
										u.a.setHeight(this, this.scrollHeight);
									}
								}
								else if(u.browser("opera") || u.browser("explorer")) {
									if(this.scrollHeight > textarea_height) {
										u.a.setHeight(this, this.scrollHeight);
									}
								}
								else {
									u.a.setHeight(this, this.scrollHeight);
								}
							}
						}
						u.e.addEvent(field._input, "keyup", field._input.setHeight);
						field._input.setHeight();
					}
					u.e.addEvent(field._input, "keyup", this._updated);
					u.e.addEvent(field._input, "change", this._changed);
					this.activateInput(field._input);
					this.validate(field._input);
				}
				else if(u.hc(field, "select")) {
					field._input = u.qs("select", field);
					field._input._form = _form;
					field._input.field = field;
					_form.fields[field._input.name] = field._input;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					field._input.val = this._value_select;
					u.e.addEvent(field._input, "change", this._updated);
					u.e.addEvent(field._input, "keyup", this._updated);
					u.e.addEvent(field._input, "change", this._changed);
					this.activateInput(field._input);
					this.validate(field._input);
				}
				else if(u.hc(field, "checkbox|boolean")) {
					field._input = u.qs("input[type=checkbox]", field);
					field._input._form = _form;
					field._input.field = field;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					_form.fields[field._input.name] = field._input;
					field._input.val = this._value_checkbox;
					if(u.browser("explorer", "<=8")) {
						field._input.pre_state = field._input.checked;
						field._input._changed = this._changed;
						field._input._updated = this._updated;
						field._input._update_checkbox_field = this._update_checkbox_field;
						field._input._clicked = function(event) {
							if(this.checked != this.pre_state) {
								this._changed(window.event);
								this._updated(window.event);
								this._update_checkbox_field(window.event);
							}
							this.pre_state = this.checked;
						}
						u.e.addEvent(field._input, "click", field._input._clicked);
					}
					else {
						u.e.addEvent(field._input, "change", this._changed);
						u.e.addEvent(field._input, "change", this._updated);
						u.e.addEvent(field._input, "change", this._update_checkbox_field);
					}
					this.inputOnEnter(field._input);
					this.activateInput(field._input);
					this.validate(field._input);
				}
				else if(u.hc(field, "radiobuttons")) {
					field._inputs = u.qsa("input", field);
					field._input = field._inputs[0];
					_form.fields[field._input.name] = field._input;
					for(j = 0; input = field._inputs[j]; j++) {
						input.field = field;
						input._form = _form;
						input._label = u.qs("label[for='"+input.id+"']", field);
						input.val = this._value_radiobutton;
						if(u.browser("explorer", "<=8")) {
							input.pre_state = input.checked;
							input._changed = this._changed;
							input._updated = this._updated;
							input._clicked = function(event) {
								var i, input;
								if(this.checked != this.pre_state) {
									this._changed(window.event);
									this._updated(window.event);
								}
								for(i = 0; input = this.field._input[i]; i++) {
									input.pre_state = input.checked;
								}
							}
							u.e.addEvent(input, "click", input._clicked);
						}
						else {
							u.e.addEvent(input, "change", this._changed);
							u.e.addEvent(input, "change", this._updated);
						}
						this.inputOnEnter(input);
						this.activateInput(input);
					}
					this.validate(field._input);
				}
				else if(u.hc(field, "files")) {
					field._input = u.qs("input", field);
					field._input._form = _form;
					field._input.field = field;
					_form.fields[field._input.name] = field._input;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					u.e.addEvent(field._input, "change", this._updated);
					u.e.addEvent(field._input, "change", this._changed);
					u.e.addEvent(field._input, "focus", this._focus);
					u.e.addEvent(field._input, "blur", this._blur);
					if(u.e.event_pref == "mouse") {
						u.e.addEvent(field._input, "dragenter", this._focus);
						u.e.addEvent(field._input, "dragleave", this._blur);
						u.e.addEvent(field._input, "mouseenter", this._mouseenter);
						u.e.addEvent(field._input, "mouseleave", this._mouseleave);
					}
					u.e.addEvent(field._input, "blur", this._validate);
					field._input.val = this._value_file;
					this.validate(field._input);
				}
				else if(u.hc(field, "tags")) {
					field._input = u.qs("input", field);
					field._input._form = _form;
					field._input.field = field;
					_form.fields[field._input.name] = field._input;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					field._input.val = this._value;
					u.e.addEvent(field._input, "keyup", this._updated);
					u.e.addEvent(field._input, "change", this._changed);
					this.inputOnEnter(field._input);
					this.activateInput(field._input);
					this.validate(field._input);
				}
				else if(u.hc(field, "prices")) {
					field._input = u.qs("input", field);
					field._input._form = _form;
					field._input.field = field;
					_form.fields[field._input.name] = field._input;
					field._input._label = u.qs("label[for='"+field._input.id+"']", field);
					field._input.val = this._value;
					u.e.addEvent(field._input, "keyup", this._updated);
					u.e.addEvent(field._input, "change", this._changed);
					this.inputOnEnter(field._input);
					this.activateInput(field._input);
					this.validate(field._input);
				}
				else {
					u.bug("UNKNOWN FIELD IN FORM INITIALIZATION:" + u.nodeId(field));
				}
			}
		}
		var hidden_fields = u.qsa("input[type=hidden]", _form);
		for(i = 0; hidden_field = hidden_fields[i]; i++) {
			if(!_form.fields[hidden_field.name]) {
				_form.fields[hidden_field.name] = hidden_field;
				hidden_field.val = this._value;
			}
		}
		var actions = u.qsa(".actions li input[type=button],.actions li input[type=submit],.actions li input[type=reset],.actions li a.button", _form);
		for(i = 0; action = actions[i]; i++) {
				action._form = _form;
			this.activateButton(action);
		}
		if(_form._debug_init) {
			u.bug(u.nodeId(_form) + ", fields:");
			u.xInObject(_form.fields);
			u.bug(u.nodeId(_form) + ", actions:");
			u.xInObject(_form.actions);
		}
	}
	this._reset = function (event, iN) {
		for (name in this.fields) {
			if (this.fields[name] && this.fields[name].field && this.fields[name].type != "hidden" && !this.fields[name].getAttribute("readonly")) {
				this.fields[name].used = false;
				this.fields[name].val("");
			}
		}
	}
	this._submit = function(event, iN) {
		for(name in this.fields) {
			if(this.fields[name] && this.fields[name].field && typeof(this.fields[name].val) == "function") {
				this.fields[name].used = true;
				u.f.validate(this.fields[name]);
			}
		}
		if(!Object.keys(this.error_fields).length) {
			if(typeof(this.submitted) == "function") {
				this.submitted(iN);
			}
			else {
				for(name in this.fields) {
					if(this.fields[name] && this.fields[name].default_value && typeof(this.fields[name].val) == "function" && !this.fields[name].val()) {
						if(this.fields[name].nodeName.match(/^(input|textarea)$/i)) {
							this.fields[name].value = "";
						}
					}
				}
				this.DOMsubmit();
			}
		}
	}
	this._value = function(value) {
		if(value !== undefined) {
			this.value = value;
			if(value !== this.default_value) {
				u.rc(this, "default");
				if(this.pseudolabel) {
					u.as(this.pseudolabel, "display", "none");
				}
			}
			u.f.validate(this);
		}
		return (this.value != this.default_value) ? this.value : "";
	}
	this._value_radiobutton = function(value) {
		var i, option;
		if(value !== undefined) {
			for(i = 0; option = this.field._inputs[i]; i++) {
				if(option.value == value || (option.value == "true" && value) || (option.value == "false" && value === false)) {
					option.checked = true;
					u.f.validate(this);
				}
				else {
					option.checked = false;
				}
			}
		}
		else {
			for(i = 0; option = this.field._inputs[i]; i++) {
				if(option.checked) {
					return option.value;
				}
			}
		}
		return "";
	}
	this._value_checkbox = function(value) {
		if(value !== undefined) {
			if(value) {
				this.checked = true
				u.ac(this.field, "checked");
			}
			else {
				this.checked = false;
				u.rc(this.field, "checked");
			}
			u.f.validate(this);
		}
		else {
			if(this.checked) {
				return this.value;
			}
		}
		return "";
	}
	this._value_select = function(value) {
		if(value !== undefined) {
			var i, option;
			for(i = 0; option = this.options[i]; i++) {
				if(option.value == value) {
					this.selectedIndex = i;
					u.f.validate(this);
					return i;
				}
			}
			if (value === "") {
				this.selectedIndex = -1;
				u.f.validate(this);
				return -1;
			}
			return false;
		}
		else {
			return (this.selectedIndex >= 0 && this.default_value != this.options[this.selectedIndex].value) ? this.options[this.selectedIndex].value : "";
		}
	}
	this._value_file = function(value) {
		if(value !== undefined) {
			this.value = value;
			if (value === "") {
				this.value = null;
			}
		}
		else {
			if(this.value && this.files && this.files.length) {
				var i, file, files = [];
				for(i = 0; file = this.files[i]; i++) {
					files.push(file);
				}
				return files;
			}
			else if(this.value) {
				return this.value;
			}
			else if(u.hc(this, "uploaded")){
				return true;
			}
			return "";
		}
	}
	this.inputOnEnter = function(node) {
		node.keyPressed = function(event) {
			if(this.nodeName.match(/input/i) && (event.keyCode == 40 || event.keyCode == 38)) {
				this._submit_disabled = true;
			}
			else if(this.nodeName.match(/input/i) && this._submit_disabled && (
				event.keyCode == 46 || 
				(event.keyCode == 39 && u.browser("firefox")) || 
				(event.keyCode == 37 && u.browser("firefox")) || 
				event.keyCode == 27 || 
				event.keyCode == 13 || 
				event.keyCode == 9 ||
				event.keyCode == 8
			)) {
				this._submit_disabled = false;
			}
			else if(event.keyCode == 13 && !this._submit_disabled) {
				u.e.kill(event);
				this.blur();
				this._form.submitInput = this;
				this._form.submitButton = false;
				this._form.submit(event, this);
			}
		}
		u.e.addEvent(node, "keydown", node.keyPressed);
	}
	this.buttonOnEnter = function(node) {
		node.keyPressed = function(event) {
			if(event.keyCode == 13 && !u.hc(this, "disabled") && typeof(this.clicked) == "function") {
				u.e.kill(event);
				this.clicked(event);
			}
		}
		u.e.addEvent(node, "keydown", node.keyPressed);
	}
	this._changed = function(event) {
		this.used = true;
		if(typeof(this.changed) == "function") {
			this.changed(this);
		}
		else if(this.field._input && typeof(this.field._input.changed) == "function") {
			this.field._input.changed(this);
		}
		if(typeof(this.field.changed) == "function") {
			this.field.changed(this);
		}
		if(typeof(this._form.changed) == "function") {
			this._form.changed(this);
		}
	}
	this._updated = function(event) {
		if(event.keyCode != 9 && event.keyCode != 13 && event.keyCode != 16 && event.keyCode != 17 && event.keyCode != 18) {
			if(this.used || u.hc(this.field, "error")) {
				u.f.validate(this);
			}
			if(typeof(this.updated) == "function") {
				this.updated(this);
			}
			else if(this.field._input && typeof(this.field._input.updated) == "function") {
				this.field._input.updated(this);
			}
			if(typeof(this.field.updated) == "function") {
				this.field.updated(this);
			}
			if(typeof(this._form.updated) == "function") {
				this._form.updated(this);
			}
		}
	}
	this._update_checkbox_field = function(event) {
		if(this.checked) {
			u.ac(this.field, "checked");
		}
		else {
			u.rc(this.field, "checked");
		}
	}
	this._validate = function(event) {
		u.f.validate(this);
	}
	this._mouseenter = function(event) {
		u.ac(this.field, "hover");
		u.ac(this, "hover");
		u.as(this.field, "zIndex", this.field._input._form._hover_z_index);
		u.f.positionHint(this.field);
	}
	this._mouseleave = function(event) {
		u.rc(this.field, "hover");
		u.rc(this, "hover");
		u.as(this.field, "zIndex", this.field._base_z_index);
		u.f.positionHint(this.field);
	}
	this._focus = function(event) {
		this.field.is_focused = true;
		this.is_focused = true;
		u.ac(this.field, "focus");
		u.ac(this, "focus");
		u.as(this.field, "zIndex", this._form._focus_z_index);
		u.f.positionHint(this.field);
		if(typeof(this.focused) == "function") {
			this.focused();
		}
		else if(this.field._input && typeof(this.field._input.focused) == "function") {
			this.field._input.focused(this);
		}
		if(typeof(this._form.focused) == "function") {
			this._form.focused(this);
		}
	}
	this._blur = function(event) {
		this.field.is_focused = false;
		this.is_focused = false;
		u.rc(this.field, "focus");
		u.rc(this, "focus");
		u.as(this.field, "zIndex", this.field._base_z_index);
		u.f.positionHint(this.field);
		this.used = true;
		if(typeof(this.blurred) == "function") {
			this.blurred();
		}
		else if(this.field._input && typeof(this.field._input.blurred) == "function") {
			this.field._input.blurred(this);
		}
		if(typeof(this._form.blurred) == "function") {
			this._form.blurred(this);
		}
	}
	this._button_focus = function(event) {
		u.ac(this, "focus");
		if(typeof(this.focused) == "function") {
			this.focused();
		}
		if(typeof(this._form.focused) == "function") {
			this._form.focused(this);
		}
	}
	this._button_blur = function(event) {
		u.rc(this, "focus");
		if(typeof(this.blurred) == "function") {
			this.blurred();
		}
		if(typeof(this._form.blurred) == "function") {
			this._form.blurred(this);
		}
	}
	this._changed_state = function() {
		u.f.updateDefaultState(this);
	}
	this.positionHint = function(field) {
		if(field._help) {
			var custom_hint_position;
			for(custom_hint_position in this.customHintPosition) {
				if(u.hc(field, custom_hint_position)) {
					this.customHintPosition[custom_hint_position](field._form, field);
					return;
				}
			}
			var input_middle, help_top;
 			if(u.hc(field, "html")) {
				input_middle = field._editor.offsetTop + (field._editor.offsetHeight / 2);
			}
			else {
				input_middle = field._input.offsetTop + (field._input.offsetHeight / 2);
			}
			help_top = input_middle - field._help.offsetHeight / 2;
			u.as(field._help, "top", help_top + "px");
		}
	}
	this.activateInput = function(iN) {
		u.e.addEvent(iN, "focus", this._focus);
		u.e.addEvent(iN, "blur", this._blur);
		if(u.e.event_pref == "mouse") {
			u.e.addEvent(iN, "mouseenter", this._mouseenter);
			u.e.addEvent(iN, "mouseleave", this._mouseleave);
		}
		u.e.addEvent(iN, "blur", this._validate);
		if(iN._form.labelstyle == "inject") {
			if(!iN.type || !iN.type.match(/file|radio|checkbox/)) {
				iN.default_value = u.text(iN._label);
				u.e.addEvent(iN, "focus", this._changed_state);
				u.e.addEvent(iN, "blur", this._changed_state);
				if(iN.type.match(/number|integer/)) {
					iN.pseudolabel = u.ae(iN.parentNode, "span", {"class":"pseudolabel", "html":iN.default_value});
					iN.pseudolabel.iN = iN;
					u.as(iN.pseudolabel, "top", iN.offsetTop+"px");
					u.as(iN.pseudolabel, "left", iN.offsetLeft+"px");
					u.ce(iN.pseudolabel)
					iN.pseudolabel.inputStarted = function(event) {
						u.e.kill(event);
						this.iN.focus();
					}
				}
				u.f.updateDefaultState(iN);
			}
		}
		else {
			iN.default_value = "";
		}
	}
	this.activateButton = function(action) {
		if(action.type && action.type == "submit" || action.type == "reset") {
			action.onclick = function(event) {
				u.e.kill(event ? event : window.event);
			}
		}
		u.ce(action);
		if(!action.clicked) {
			action.clicked = function(event) {
				u.e.kill(event);
				if(!u.hc(this, "disabled")) {
					if(this.type && this.type.match(/submit/i)) {
						this._form._submit_button = this;
						this._form._submit_input = false;
						this._form.submit(event, this);
					}
					else if (this.type && this.type.match(/reset/i)) {
						this._form._submit_button = false;
						this._form._submit_input = false;
						this._form.reset(event, this);
					}
					else {
						location.href = this.url;
					}
				}
			}
		}
		this.buttonOnEnter(action);
		var action_name = action.name ? action.name : action.parentNode.className;
		if(action_name) {
			action._form.actions[action_name] = action;
		}
		if(typeof(u.k) == "object" && u.hc(action, "key:[a-z0-9]+")) {
			u.k.addKey(action, u.cv(action, "key"));
		}
		u.e.addEvent(action, "focus", this._button_focus);
		u.e.addEvent(action, "blur", this._button_blur);
	}
	this.updateDefaultState = function(iN) {
		if(iN.is_focused || iN.val() !== "") {
			u.rc(iN, "default");
			if(iN.val() === "") {
				iN.val("");
			}
			if(iN.pseudolabel) {
				u.as(iN.pseudolabel, "display", "none");
			}
		}
		else {
			if(iN.val() === "") {
				u.ac(iN, "default");
				if(iN.pseudolabel) {
					iN.val(iN.default_value);
					u.as(iN.pseudolabel, "display", "block");
				}
				else {
					iN.val(iN.default_value);
				}
			}
		}
	}
	this.fieldError = function(iN) {
		u.rc(iN, "correct");
		u.rc(iN.field, "correct");
		if(iN.used || iN.val() !== "") {
			u.ac(iN, "error");
			u.ac(iN.field, "error");
			this.positionHint(iN.field);
			iN._form.error_fields[iN.name] = true;
			this.updateFormValidationState(iN);
		}
	}
	this.fieldCorrect = function(iN) {
		if(iN.val() !== "") {
			u.ac(iN, "correct");
			u.ac(iN.field, "correct");
			u.rc(iN, "error");
			u.rc(iN.field, "error");
		}
		else {
			u.rc(iN, "correct");
			u.rc(iN.field, "correct");
			u.rc(iN, "error");
			u.rc(iN.field, "error");
		}
		delete iN._form.error_fields[iN.name];
		this.updateFormValidationState(iN);
	}
	this.checkFormValidation = function(form) {
		if(Object.keys(form.error_fields).length) {
			return false;
		}
		var x, field;
		for(x in form.fields) {
			input = form.fields[x];
			if(input.field && u.hc(form.fields[x].field, "required") && !u.hc(form.fields[x].field, "correct")) {
				return false;
			}
		}
		return true;
	}
	this.updateFormValidationState = function(iN) {
		if(this.checkFormValidation(iN._form)) {
			if(typeof(iN.validationPassed) == "function") {
				iN.validationPassed();
			}
			if(typeof(iN.field.validationPassed) == "function") {
				iN.field.validationPassed();
			}
			if(typeof(iN._form.validationPassed) == "function") {
				iN._form.validationPassed();
			}
			return true;
		}
		else {
			if(typeof(iN.validationFailed) == "function") {
				iN.validationFailed(iN._form.error_fields);
			}
			if(typeof(iN.field.validationFailed) == "function") {
				iN.field.validationFailed(iN._form.error_fields);
			}
			if(typeof(iN._form.validationFailed) == "function") {
				iN._form.validationFailed(iN._form.error_fields);
			}
			return false;
		}
	}
	this.validate = function(iN) {
		if(!iN._form._validation) {
			return true;
		}
		var min, max, pattern;
		var validated = false;
		if(!u.hc(iN.field, "required") && iN.val() === "") {
			this.fieldCorrect(iN);
			return true;
		}
		else if(u.hc(iN.field, "required") && iN.val() === "") {
			this.fieldError(iN);
			return false;
		}
		var custom_validate;
		for(custom_validate in u.f.customValidate) {
			if(u.hc(iN.field, custom_validate)) {
				u.f.customValidate[custom_validate](iN);
				validated = true;
			}
		}
		if(!validated) {
			if(u.hc(iN.field, "password")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 8;
				max = max ? max : 20;
				pattern = iN.getAttribute("pattern");
				if(
					iN.val().length >= min && 
					iN.val().length <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "number")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 0;
				max = max ? max : 99999999999999999999999999999;
				pattern = iN.getAttribute("pattern");
				if(
					!isNaN(iN.val()) && 
					iN.val() >= min && 
					iN.val() <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "integer")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 0;
				max = max ? max : 99999999999999999999999999999;
				pattern = iN.getAttribute("pattern");
				if(
					!isNaN(iN.val()) && 
					Math.round(iN.val()) == iN.val() && 
					iN.val() >= min && 
					iN.val() <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "tel")) {
				pattern = iN.getAttribute("pattern");
				if(
					!pattern && iN.val().match(/^([\+0-9\-\.\s\(\)]){5,18}$/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "email")) {
				if(
					!pattern && iN.val().match(/^([^<>\\\/%$])+\@([^<>\\\/%$])+\.([^<>\\\/%$]{2,20})$/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "text")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 1;
				max = max ? max : 10000000;
				pattern = iN.getAttribute("pattern");
				if(
					iN.val().length >= min && 
					iN.val().length <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "date")) {
				pattern = iN.getAttribute("pattern");
				if(
					!pattern && iN.val().match(/^([\d]{4}[\-\/\ ]{1}[\d]{2}[\-\/\ ][\d]{2})$/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "datetime")) {
				pattern = iN.getAttribute("pattern");
				if(
					!pattern && iN.val().match(/^([\d]{4}[\-\/\ ]{1}[\d]{2}[\-\/\ ][\d]{2} [\d]{2}[\-\/\ \:]{1}[\d]{2}[\-\/\ \:]{0,1}[\d]{0,2})$/) ||
					(pattern && iN.val().match(pattern))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "files")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 1;
				max = max ? max : 10000000;
				if(
					u.hc(iN, "uploaded") ||
					(iN.val().length >= min && 
					iN.val().length <= max)
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "select")) {
				if(iN.val() !== "") {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "checkbox|boolean|radiobuttons")) {
				if(iN.val() !== "") {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "string")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 1;
				max = max ? max : 255;
				pattern = iN.getAttribute("pattern");
				if(
					iN.val().length >= min &&
					iN.val().length <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "tags")) {
				if(
					!pattern && iN.val().match(/\:/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "prices")) {
				if(
					!isNaN(iN.val())
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
		}
		if(u.hc(iN.field, "error")) {
			return false;
		}
		else {
			return true;
		}
	}
}
u.f.getParams = function(_form, _options) {
	var send_as = "params";
	var ignore_inputs = "ignoreinput";
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "ignore_inputs"    : ignore_inputs     = _options[_argument]; break;
				case "send_as"          : send_as           = _options[_argument]; break;
			}
		}
	}
	var i, input, select, textarea, param, params;
	if(send_as == "formdata" && (typeof(window.FormData) == "function" || typeof(window.FormData) == "object")) {
		params = new FormData();
	}
	else {
		if(send_as == "formdata") {
			send_as == "params";
		}
		params = new Object();
		params.append = function(name, value, filename) {
			this[name] = value;
		}
	}
	if(_form._submit_button && _form._submit_button.name) {
		params.append(_form._submit_button.name, _form._submit_button.value);
	}
	var inputs = u.qsa("input", _form);
	var selects = u.qsa("select", _form)
	var textareas = u.qsa("textarea", _form)
	for(i = 0; input = inputs[i]; i++) {
		if(!u.hc(input, ignore_inputs)) {
			if((input.type == "checkbox" || input.type == "radio") && input.checked) {
				if(typeof(input.val) == "function") {
					params.append(input.name, input.val());
				}
				else {
					params.append(input.name, input.value);
				}
			}
			else if(input.type == "file") {
				var f, file, files;
				if(typeof(input.val) == "function") {
					files = input.val();
				}
				else {
					files = input.value;
				}
				if(files) {
					for(f = 0; file = files[f]; f++) {
						params.append(input.name, file, file.name);
					}
				}
				else {
					params.append(input.name, "");
				}
			}
			else if(!input.type.match(/button|submit|reset|file|checkbox|radio/i)) {
				if(typeof(input.val) == "function") {
					params.append(input.name, input.val());
				}
				else {
					params.append(input.name, input.value);
				}
			}
		}
	}
	for(i = 0; select = selects[i]; i++) {
		if(!u.hc(select, ignore_inputs)) {
			if(typeof(select.val) == "function") {
				params.append(select.name, select.val());
			}
			else {
				params.append(select.name, select.options[select.selectedIndex].value);
			}
		}
	}
	for(i = 0; textarea = textareas[i]; i++) {
		if(!u.hc(textarea, ignore_inputs)) {
			if(typeof(textarea.val) == "function") {
				params.append(textarea.name, textarea.val());
			}
			else {
				params.append(textarea.name, textarea.value);
			}
		}
	}
	if(send_as && typeof(this.customSend[send_as]) == "function") {
		return this.customSend[send_as](params, _form);
	}
	else if(send_as == "json") {
		return u.f.convertNamesToJsonObject(params);
	}
	else if(send_as == "formdata") {
		return params;
	}
	else if(send_as == "object") {
		delete params.append;
		return params;
	}
	else {
		var string = "";
		for(param in params) {
			if(typeof(params[param]) != "function") {
				string += (string ? "&" : "") + param + "=" + encodeURIComponent(params[param]);
			}
		}
		return string;
	}
}
u.f.convertNamesToJsonObject = function(params) {
 	var indexes, root, indexes_exsists, param;
	var object = new Object();
	for(param in params) {
	 	indexes_exsists = param.match(/\[/);
		if(indexes_exsists) {
			root = param.split("[")[0];
			indexes = param.replace(root, "");
			if(typeof(object[root]) == "undefined") {
				object[root] = new Object();
			}
			object[root] = this.recurseName(object[root], indexes, params[param]);
		}
		else {
			object[param] = params[param];
		}
	}
	return object;
}
u.f.recurseName = function(object, indexes, value) {
	var index = indexes.match(/\[([a-zA-Z0-9\-\_]+)\]/);
	var current_index = index[1];
	indexes = indexes.replace(index[0], "");
 	if(indexes.match(/\[/)) {
		if(object.length !== undefined) {
			var i;
			var added = false;
			for(i = 0; i < object.length; i++) {
				for(exsiting_index in object[i]) {
					if(exsiting_index == current_index) {
						object[i][exsiting_index] = this.recurseName(object[i][exsiting_index], indexes, value);
						added = true;
					}
				}
			}
			if(!added) {
				temp = new Object();
				temp[current_index] = new Object();
				temp[current_index] = this.recurseName(temp[current_index], indexes, value);
				object.push(temp);
			}
		}
		else if(typeof(object[current_index]) != "undefined") {
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
		else {
			object[current_index] = new Object();
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
	}
	else {
		object[current_index] = value;
	}
	return object;
}
u.f.customBuild = {};
u.f.addForm = function(node, _options) {
	var form_name = "js_form";
	var form_action = "#";
	var form_method = "post";
	var form_class = "";
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "name"			: form_name				= _options[_argument]; break;
				case "action"		: form_action			= _options[_argument]; break;
				case "method"		: form_method			= _options[_argument]; break;
				case "class"		: form_class			= _options[_argument]; break;
			}
		}
	}
	var form = u.ae(node, "form", {"class":form_class, "name": form_name, "action":form_action, "method":form_method});
	return form;
}
u.f.addFieldset = function(node, _options) {
	var fieldset_class = "";
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "class"			: fieldset_class			= _options[_argument]; break;
			}
		}
	}
	return u.ae(node, "fieldset", {"class":fieldset_class});
}
u.f.addField = function(node, _options) {
	var field_name = "js_name";
	var field_label = "Label";
	var field_type = "string";
	var field_value = "";
	var field_options = [];
	var field_checked = false;
	var field_class = "";
	var field_id = "";
	var field_max = false;
	var field_min = false;
	var field_disabled = false;
	var field_readonly = false;
	var field_required = false;
	var field_pattern = false;
	var field_error_message = "There is an error in your input";
	var field_hint_message = "";
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "name"					: field_name			= _options[_argument]; break;
				case "label"				: field_label			= _options[_argument]; break;
				case "type"					: field_type			= _options[_argument]; break;
				case "value"				: field_value			= _options[_argument]; break;
				case "options"				: field_options			= _options[_argument]; break;
				case "checked"				: field_checked			= _options[_argument]; break;
				case "class"				: field_class			= _options[_argument]; break;
				case "id"					: field_id				= _options[_argument]; break;
				case "max"					: field_max				= _options[_argument]; break;
				case "min"					: field_min				= _options[_argument]; break;
				case "disabled"				: field_disabled		= _options[_argument]; break;
				case "readonly"				: field_readonly		= _options[_argument]; break;
				case "required"				: field_required		= _options[_argument]; break;
				case "pattern"				: field_pattern			= _options[_argument]; break;
				case "error_message"		: field_error_message	= _options[_argument]; break;
				case "hint_message"			: field_hint_message	= _options[_argument]; break;
			}
		}
	}
	var custom_build;
	if(field_type in u.f.customBuild) {
		return u.f.customBuild[field_type](node, _options);
	}
	field_id = field_id ? field_id : "input_"+field_type+"_"+field_name;
	field_disabled = !field_disabled ? (field_class.match(/(^| )disabled( |$)/) ? "disabled" : false) : "disabled";
	field_readonly = !field_readonly ? (field_class.match(/(^| )readonly( |$)/) ? "readonly" : false) : "readonly";
	field_required = !field_required ? (field_class.match(/(^| )required( |$)/) ? true : false) : true;
	field_class += field_disabled ? (!field_class.match(/(^| )disabled( |$)/) ? " disabled" : "") : "";
	field_class += field_readonly ? (!field_class.match(/(^| )readonly( |$)/) ? " readonly" : "") : "";
	field_class += field_required ? (!field_class.match(/(^| )required( |$)/) ? " required" : "") : "";
	field_class += field_min ? (!field_class.match(/(^| )min:[0-9]+( |$)/) ? " min:"+field_min : "") : "";
	field_class += field_max ? (!field_class.match(/(^| )max:[0-9]+( |$)/) ? " max:"+field_max : "") : "";
	if (field_type == "hidden") {
		return u.ae(node, "input", {"type":"hidden", "name":field_name, "value":field_value, "id":field_id});
	}
	var field = u.ae(node, "div", {"class":"field "+field_type+" "+field_class});
	var attributes = {};
	if(field_type == "string") {
		field_max = field_max ? field_max : 255;
		attributes = {
			"type":"text", 
			"id":field_id, 
			"value":field_value, 
			"name":field_name, 
			"maxlength":field_max, 
			"minlength":field_min,
			"pattern":field_pattern,
			"readonly":field_readonly,
			"disabled":field_disabled
		};
		u.ae(field, "label", {"for":field_id, "html":field_label});
		u.ae(field, "input", u.f.verifyAttributes(attributes));
	}
	else if(field_type == "email" || field_type == "tel" || field_type == "password") {
		field_max = field_max ? field_max : 255;
		attributes = {
			"type":field_type, 
			"id":field_id, 
			"value":field_value, 
			"name":field_name, 
			"maxlength":field_max, 
			"minlength":field_min,
			"pattern":field_pattern,
			"readonly":field_readonly,
			"disabled":field_disabled
		};
		u.ae(field, "label", {"for":field_id, "html":field_label});
		u.ae(field, "input", u.f.verifyAttributes(attributes));
	}
	else if(field_type == "number" || field_type == "integer" || field_type == "date" || field_type == "datetime") {
		attributes = {
			"type":field_type, 
			"id":field_id, 
			"value":field_value, 
			"name":field_name, 
			"max":field_max, 
			"min":field_min,
			"pattern":field_pattern,
			"readonly":field_readonly,
			"disabled":field_disabled
		};
		u.ae(field, "label", {"for":field_id, "html":field_label});
		u.ae(field, "input", u.f.verifyAttributes(attributes));
	}
	else if(field_type == "checkbox") {
		attributes = {
			"type":field_type, 
			"id":field_id, 
			"value":field_value ? field_value : "true", 
			"name":field_name, 
			"disabled":field_disabled,
			"checked":field_checked
		};
		u.ae(field, "input", {"name":field_name, "value":"false", "type":"hidden"});
		u.ae(field, "input", u.f.verifyAttributes(attributes));
		u.ae(field, "label", {"for":field_id, "html":field_label});
	}
	else if(field_type == "text") {
		attributes = {
			"id":field_id, 
			"html":field_value, 
			"name":field_name, 
			"maxlength":field_max, 
			"minlength":field_min,
			"pattern":field_pattern,
			"readonly":field_readonly,
			"disabled":field_disabled
		};
		u.ae(field, "label", {"for":field_id, "html":field_label});
		u.ae(field, "textarea", u.f.verifyAttributes(attributes));
	}
	else if(field_type == "select") {
		attributes = {
			"id":field_id, 
			"name":field_name, 
			"disabled":field_disabled
		};
		u.ae(field, "label", {"for":field_id, "html":field_label});
		var select = u.ae(field, "select", u.f.verifyAttributes(attributes));
		if(field_options) {
			var i, option;
			for(i = 0; option = field_options[i]; i++) {
				if(option.value == field_value) {
					u.ae(select, "option", {"value":option.value, "html":option.text, "selected":"selected"});
				}
				else {
					u.ae(select, "option", {"value":option.value, "html":option.text});
				}
			}
		}
	}
	else if(field_type == "radiobuttons") {
		u.ae(field, "label", {"html":field_label});
		if(field_options) {
			var i, option;
			for(i = 0; option = field_options[i]; i++) {
				var div = u.ae(field, "div", {"class":"item"});
				if(option.value == field_value) {
					u.ae(div, "input", {"value":option.value, "id":field_id+"-"+i, "type":"radio", "name":field_name, "checked":"checked"});
					u.ae(div, "label", {"for":field_id+"-"+i, "html":option.text});
				}
				else {
					u.ae(div, "input", {"value":option.value, "id":field_id+"-"+i, "type":"radio", "name":field_name});
					u.ae(div, "label", {"for":field_id+"-"+i, "html":option.text});
				}
			}
		}
	}
	else if(field_type == "files") {
		u.ae(field, "label", {"for":field_id, "html":field_label});
		u.ae(field, "input", {"id":field_id, "name":field_name, "type":"file"});
	}
	else {
		u.bug("input type not implemented")
	}
	if(field_hint_message || field_error_message) {
		var help = u.ae(field, "div", {"class":"help"});
		if (field_hint_message) {
			u.ae(help, "div", { "class": "hint", "html": field_hint_message });
		}
		if(field_error_message) {
			u.ae(help, "div", { "class": "error", "html": field_error_message });
		}
	}
	return field;
}
u.f.verifyAttributes = function(attributes) {
	for(attribute in attributes) {
		if(attributes[attribute] === undefined || attributes[attribute] === false || attributes[attribute] === null) {
			delete attributes[attribute];
		}
	}
	return attributes;
}
u.f.addAction = function(node, _options) {
	var action_type = "submit";
	var action_name = "js_name";
	var action_value = "";
	var action_class = "";
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "type"			: action_type			= _options[_argument]; break;
				case "name"			: action_name			= _options[_argument]; break;
				case "value"		: action_value			= _options[_argument]; break;
				case "class"		: action_class			= _options[_argument]; break;
			}
		}
	}
	var p_ul = node.nodeName.toLowerCase() == "ul" ? node : u.pn(node, {"include":"ul"});
	if(!p_ul || !u.hc(p_ul, "actions")) {
		if(node.nodeName.toLowerCase() == "form") {
			p_ul = u.qs("ul.actions", node);
		}
		p_ul = p_ul ? p_ul : u.ae(node, "ul", {"class":"actions"});
	}
	var p_li = node.nodeName.toLowerCase() == "li" ? node : u.pn(node, {"include":"li"});
	if(!p_li || p_ul != p_li.parentNode) {
		p_li = u.ae(p_ul, "li", {"class":action_name});
	}
	else {
		p_li = node;
	}
	var action = u.ae(p_li, "input", {"type":action_type, "class":action_class, "value":action_value, "name":action_name})
	return action;
}
Util.absoluteX = u.absX = function(node) {
	if(node.offsetParent) {
		return node.offsetLeft + u.absX(node.offsetParent);
	}
	return node.offsetLeft;
}
Util.absoluteY = u.absY = function(node) {
	if(node.offsetParent) {
		return node.offsetTop + u.absY(node.offsetParent);
	}
	return node.offsetTop;
}
Util.relativeX = u.relX = function(node) {
	if(u.gcs(node, "position").match(/absolute/) == null && node.offsetParent && u.gcs(node.offsetParent, "position").match(/relative|absolute|fixed/) == null) {
		return node.offsetLeft + u.relX(node.offsetParent);
	}
	return node.offsetLeft;
}
Util.relativeY = u.relY = function(node) {
	if(u.gcs(node, "position").match(/absolute/) == null && node.offsetParent && u.gcs(node.offsetParent, "position").match(/relative|absolute|fixed/) == null) {
		return node.offsetTop + u.relY(node.offsetParent);
	}
	return node.offsetTop;
}
Util.actualWidth = u.actualW = function(node) {
	return parseInt(u.gcs(node, "width"));
}
Util.actualHeight = u.actualH = function(node) {
	return parseInt(u.gcs(node, "height"));
}
Util.eventX = function(event){
	return (event.targetTouches && event.targetTouches.length ? event.targetTouches[0].pageX : event.pageX);
}
Util.eventY = function(event){
	return (event.targetTouches && event.targetTouches.length ? event.targetTouches[0].pageY : event.pageY);
}
Util.browserWidth = u.browserW = function() {
	return document.documentElement.clientWidth;
}
Util.browserHeight = u.browserH = function() {
	return document.documentElement.clientHeight;
}
Util.htmlWidth = u.htmlW = function() {
	return document.body.offsetWidth + parseInt(u.gcs(document.body, "margin-left")) + parseInt(u.gcs(document.body, "margin-right"));
}
Util.htmlHeight = u.htmlH = function() {
	return document.body.offsetHeight + parseInt(u.gcs(document.body, "margin-top")) + parseInt(u.gcs(document.body, "margin-bottom"));
}
Util.pageScrollX = u.scrollX = function() {
	return window.pageXOffset;
}
Util.pageScrollY = u.scrollY = function() {
	return window.pageYOffset;
}
Util.History = u.h = new function() {
	this.popstate = ("onpopstate" in window);
	this.callbacks = [];
	this.is_listening = false;
	this.navigate = function(url, node) {
		if(this.popstate) {
			history.pushState({}, url, url);
			this.callback(url);
		}
		else {
			location.hash = u.h.getCleanUrl(url);
		}
	}
	this.callback = function(url) {
		var i, recipient;
		for(i = 0; recipient = this.callbacks[i]; i++) {
			if(typeof(recipient.node[recipient.callback]) == "function") {
				recipient.node[recipient.callback](url);
			}
		}
	}
	this.removeEvent = function(node, _options) {
		var callback_urlchange = "navigate";
		if(typeof(_options) == "object") {
			var argument;
			for(argument in _options) {
				switch(argument) {
					case "callback"		: callback_urlchange		= _options[argument]; break;
				}
			}
		}
		var i, recipient;
		for(i = 0; recipient = this.callbacks[i]; i++) {
			if(recipient.node == node && recipient.callback == callback_urlchange) {
				this.callbacks.splice(i, 1);
				break;
			}
		}
	}
	this.addEvent = function(node, _options) {
		var callback_urlchange = "navigate";
		if(typeof(_options) == "object") {
			var argument;
			for(argument in _options) {
				switch(argument) {
					case "callback"		: callback_urlchange		= _options[argument]; break;
				}
			}
		}
		if(!this.is_listening) {
			this.is_listening = true;
			if(this.popstate) {
				u.e.addEvent(window, "popstate", this._urlChanged);
			}
			else if("onhashchange" in window && !u.browser("explorer", "<=7")) {
				u.e.addEvent(window, "hashchange", this._hashChanged);
			}
			else {
				u.h._current_hash = window.location.hash;
				window.onhashchange = this._hashChanged;
				setInterval(
					function() {
						if(window.location.hash !== u.h._current_hash) {
							u.h._current_hash = window.location.hash;
							window.onhashchange();
						}
					}, 200
				);
			}
		}
		this.callbacks.push({"node":node, "callback":callback_urlchange});
	}
	this._urlChanged = function(event) {
		var url = u.h.getCleanUrl(location.href);
		if(event.state || (!event.state && event.path)) {
			u.h.callback(url);
		}
		else {
			history.replaceState({}, url, url);
		}
	}
	this._hashChanged = function(event) {
		if(!location.hash || !location.hash.match(/^#\//)) {
			location.hash = "#/"
			return;
		}
		var url = u.h.getCleanHash(location.hash);
		u.h.callback(url);
	}
	this.trail = [];
	this.addToTrail = function(url, node) {
		this.trail.push({"url":url, "node":node});
	}
	this.getCleanUrl = function(string, levels) {
		string = string.replace(location.protocol+"//"+document.domain, "").match(/[^#$]+/)[0];
		if(!levels) {
			return string;
		}
		else {
			var i, return_string = "";
			var path = string.split("/");
			levels = levels > path.length-1 ? path.length-1 : levels;
			for(i = 1; i <= levels; i++) {
				return_string += "/" + path[i];
			}
			return return_string;
		}
	}
	this.getCleanHash = function(string, levels) {
		string = string.replace("#", "");
		if(!levels) {
			return string;
		}
		else {
			var i, return_string = "";
			var hash = string.split("/");
			levels = levels > hash.length-1 ? hash.length-1 : levels;
			for(i = 1; i <= levels; i++) {
				return_string += "/" + hash[i];
			}
			return return_string;
		}
	}
	this.resolveCurrentUrl = function() {
		return !location.hash ? this.getCleanUrl(location.href) : this.getCleanHash(location.hash);
	}
}
Util.Objects = u.o = new Object();
Util.init = function(scope) {
	var i, node, nodes, object;
	scope = scope && scope.nodeName ? scope : document;
	nodes = u.ges("i\:([_a-zA-Z0-9])+", scope);
	for(i = 0; node = nodes[i]; i++) {
		while((object = u.cv(node, "i"))) {
			u.rc(node, "i:"+object);
			if(object && typeof(u.o[object]) == "object") {
				u.o[object].init(node);
			}
		}
	}
}
Util.Keyboard = u.k = new function() {
	this.shortcuts = {};
	this.onkeydownCatcher = function(event) {
		u.k.catchKey(event);
	}
	this.addKey = function(node, key, _options) {
		node.callback_keyboard = "clicked";
		node.metakey_required = true;
		if(typeof(_options) == "object") {
			var argument;
			for(argument in _options) {
				switch(argument) {
					case "callback"		: node.callback_keyboard	= _options[argument]; break;
					case "metakey"		: node.metakey_required		= _options[argument]; break;
				}
			}
		}
		if(!this.shortcuts.length) {
			u.e.addEvent(document, "keydown", this.onkeydownCatcher);
		}
		if(!this.shortcuts[key.toString().toUpperCase()]) {
			this.shortcuts[key.toString().toUpperCase()] = new Array();
		}
		this.shortcuts[key.toString().toUpperCase()].push(node);
	}
	this.catchKey = function(event) {
		event = event ? event : window.event;
		var key = String.fromCharCode(event.keyCode);
		if(event.keyCode == 27) {
			key = "ESC";
		}
		if(this.shortcuts[key]) {
			var nodes, node, i;
			nodes = this.shortcuts[key];
			for(i = 0; node = nodes[i]; i++) {
				if(u.nodeWithin(node, document.body)) {
					if(node.offsetHeight && ((event.ctrlKey || event.metaKey) || (!node.metakey_required || key == "ESC"))) {
						u.e.kill(event);
						if(typeof(node[node.callback_keyboard]) == "function") {
							node[node.callback_keyboard](event);
						}
					}
				}
				else {
					this.shortcuts[key].splice(i, 1);
					if(!this.shortcuts[key].length) {
						delete this.shortcuts[key];
						break;
					}
					else {
						i--;
					}
				}
			}
		}
	}
}
Util.random = function(min, max) {
	return Math.round((Math.random() * (max - min)) + min);
}
Util.numToHex = function(num) {
	return num.toString(16);
}
Util.hexToNum = function(hex) {
	return parseInt(hex,16);
}
Util.round = function(number, decimals) {
	var round_number = number*Math.pow(10, decimals);
	return Math.round(round_number)/Math.pow(10, decimals);
}
u.navigation = function(_options) {
	var navigation_node = page;
	var callback_navigate = "_navigate";
	var initialization_scope = page.cN;
	if(typeof(_options) == "object") {
		var argument;
		for(argument in _options) {
			switch(argument) {
				case "callback"       : callback_navigate           = _options[argument]; break;
				case "node"           : navigation_node             = _options[argument]; break;
				case "scope"          : initialization_scope        = _options[argument]; break;
			}
		}
	}
	window._man_nav_path = window._man_nav_path ? window._man_nav_path : u.h.getCleanUrl(location.href, 1);
	navigation_node._navigate = function(url) {
		url = u.h.getCleanUrl(url);
		u.stats.pageView(url);
		if(
			!window._man_nav_path || 
			(!u.h.popstate && window._man_nav_path != u.h.getCleanHash(location.hash, 1)) || 
			(u.h.popstate && window._man_nav_path != u.h.getCleanUrl(location.href, 1))
		) {
			if(this.cN && typeof(this.cN.navigate) == "function") {
				this.cN.navigate(url);
			}
		}
		else {
			if(this.cN.scene && this.cN.scene.parentNode && typeof(this.cN.scene.navigate) == "function") {
				this.cN.scene.navigate(url);
			}
			else if(this.cN && typeof(this.cN.navigate) == "function") {
				this.cN.navigate(url);
			}
		}
		if(!u.h.popstate) {
			window._man_nav_path = u.h.getCleanHash(location.hash, 1);
		}
		else {
			window._man_nav_path = u.h.getCleanUrl(location.href, 1);
		}
	}
	if(location.hash.length && location.hash.match(/^#!/)) {
		location.hash = location.hash.replace(/!/, "");
	}
	var callback_after_init = false;
	if(!this.is_initialized) {
		this.is_initialized = true;
		if(!u.h.popstate) {
			if(location.hash.length < 2) {
				window._man_nav_path = u.h.getCleanUrl(location.href);
				u.h.navigate(window._man_nav_path);
				u.init(initialization_scope);
			}
			else if(location.hash.match(/^#\//) && u.h.getCleanHash(location.hash) != u.h.getCleanUrl(location.href)) {
				callback_after_init = u.h.getCleanHash(location.hash);
			}
			else {
				u.init(initialization_scope);
			}
		}
		else {
			if(u.h.getCleanHash(location.hash) != u.h.getCleanUrl(location.href) && location.hash.match(/^#\//)) {
				window._man_nav_path = u.h.getCleanHash(location.hash);
				u.h.navigate(window._man_nav_path);
				callback_after_init = window._man_nav_path;
			}
			else {
				u.init(initialization_scope);
			}
		}
		var random_string = u.randomString(8);
		if(callback_after_init) {
			eval('navigation_node._initNavigation_'+random_string+' = function() {u.h.addEvent(this, {"callback":"'+callback_navigate+'"});u.h.callback("'+callback_after_init+'");}');
		}
		else {
			eval('navigation_node._initNavigation_'+random_string+' = function() {u.h.addEvent(this, {"callback":"'+callback_navigate+'"});}');
		}
		u.t.setTimer(navigation_node, "_initNavigation_"+random_string, 100);
	}
	else {
		u.h.callbacks.push({"node":navigation_node, "callback":callback_navigate});
	}
}
u.preloader = function(node, files, _options) {
	var callback_preloader_loaded = "loaded";
	var callback_preloader_loading = "loading";
	var callback_preloader_waiting = "waiting";
	node._callback_min_delay = 0;
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "loaded"               : callback_preloader_loaded       = _options[_argument]; break;
				case "loading"              : callback_preloader_loading      = _options[_argument]; break;
				case "waiting"              : callback_preloader_waiting      = _options[_argument]; break;
				case "callback_min_delay"   : node._callback_min_delay              = _options[_argument]; break;
			}
		}
	}
	if(!u._preloader_queue) {
		u._preloader_queue = document.createElement("div");
		u._preloader_processes = 0;
		if(u.e && u.e.event_pref == "touch") {
			u._preloader_max_processes = 1;
		}
		else {
			u._preloader_max_processes = 4;
		}
	}
	if(node && files) {
		var entry, file;
		var new_queue = u.ae(u._preloader_queue, "ul");
		new_queue._callback_loaded = callback_preloader_loaded;
		new_queue._callback_loading = callback_preloader_loading;
		new_queue._callback_waiting = callback_preloader_waiting;
		new_queue._node = node;
		new_queue._files = files;
		new_queue.nodes = new Array();
		new_queue._start_time = new Date().getTime();
		for(i = 0; file = files[i]; i++) {
			entry = u.ae(new_queue, "li", {"class":"waiting"});
			entry.i = i;
			entry._queue = new_queue
			entry._file = file;
		}
		u.ac(node, "waiting");
		if(typeof(node[new_queue._callback_waiting]) == "function") {
			node[new_queue._callback_waiting](new_queue.nodes);
		}
	}
	u._queueLoader();
	return u._preloader_queue;
}
u._queueLoader = function() {
	if(u.qs("li.waiting", u._preloader_queue)) {
		while(u._preloader_processes < u._preloader_max_processes) {
			var next = u.qs("li.waiting", u._preloader_queue);
			if(next) {
				if(u.hc(next._queue._node, "waiting")) {
					u.rc(next._queue._node, "waiting");
					u.ac(next._queue._node, "loading");
					if(typeof(next._queue._node[next._queue._callback_loading]) == "function") {
						next._queue._node[next._queue._callback_loading](next._queue.nodes);
					}
				}
				u._preloader_processes++;
				u.rc(next, "waiting");
				u.ac(next, "loading");
				next.loaded = function(event) {
					this.image = event.target;
					this._image = this.image;
					this._queue.nodes[this.i] = this;
					u.rc(this, "loading");
					u.ac(this, "loaded");
					u._preloader_processes--;
					if(!u.qs("li.waiting,li.loading", this._queue)) {
						u.rc(this._queue._node, "loading");
						if(typeof(this._queue._node[this._queue._callback_loaded]) == "function") {
							this._queue._node[this._queue._callback_loaded](this._queue.nodes);
						}
					}
					u._queueLoader();
				}
				u.loadImage(next, next._file);
			}
			else {
				break
			}
		}
	}
}
u.loadImage = function(node, src) {
	var image = new Image();
	image.node = node;
	u.ac(node, "loading");
    u.e.addEvent(image, 'load', u._imageLoaded);
	u.e.addEvent(image, 'error', u._imageLoadError);
	image.src = src;
}
u._imageLoaded = function(event) {
	u.rc(this.node, "loading");
	if(typeof(this.node.loaded) == "function") {
		this.node.loaded(event);
	}
}
u._imageLoadError = function(event) {
	u.rc(this.node, "loading");
	u.ac(this.node, "error");
	if(typeof(this.node.loaded) == "function" && typeof(this.node.failed) != "function") {
		this.node.loaded(event);
	}
	else if(typeof(this.node.failed) == "function") {
		this.node.failed(event);
	}
}
u._imageLoadProgress = function(event) {
	u.bug("progress")
	if(typeof(this.node.progress) == "function") {
		this.node.progress(event);
	}
}
u._imageLoadDebug = function(event) {
	u.bug("event:" + event.type);
	u.xInObject(event);
}
Util.createRequestObject = function() {
	return new XMLHttpRequest();
}
Util.request = function(node, url, _options) {
	var request_id = u.randomString(6);
	node[request_id] = {};
	node[request_id].request_url = url;
	node[request_id].request_method = "GET";
	node[request_id].request_async = true;
	node[request_id].request_data = "";
	node[request_id].request_headers = false;
	node[request_id].callback_response = "response";
	node[request_id].callback_error = "responseError";
	node[request_id].jsonp_callback = "callback";
	if(typeof(_options) == "object") {
		var argument;
		for(argument in _options) {
			switch(argument) {
				case "method"				: node[request_id].request_method		= _options[argument]; break;
				case "params"				: node[request_id].request_data			= _options[argument]; break;
				case "data"					: node[request_id].request_data			= _options[argument]; break;
				case "async"				: node[request_id].request_async		= _options[argument]; break;
				case "headers"				: node[request_id].request_headers		= _options[argument]; break;
				case "callback"				: node[request_id].callback_response	= _options[argument]; break;
				case "error_callback"		: node[request_id].callback_error		= _options[argument]; break;
				case "jsonp_callback"		: node[request_id].jsonp_callback		= _options[argument]; break;
			}
		}
	}
	if(node[request_id].request_method.match(/GET|POST|PUT|PATCH/i)) {
		node[request_id].HTTPRequest = this.createRequestObject();
		node[request_id].HTTPRequest.node = node;
		node[request_id].HTTPRequest.request_id = request_id;
		if(node[request_id].request_async) {
			node[request_id].HTTPRequest.statechanged = function() {
				if(this.readyState == 4 || this.IEreadyState) {
					u.validateResponse(this);
				}
			}
			if(typeof(node[request_id].HTTPRequest.addEventListener) == "function") {
				u.e.addEvent(node[request_id].HTTPRequest, "readystatechange", node[request_id].HTTPRequest.statechanged);
			}
		}
		try {
			if(node[request_id].request_method.match(/GET/i)) {
				var params = u.JSONtoParams(node[request_id].request_data);
				node[request_id].request_url += params ? ((!node[request_id].request_url.match(/\?/g) ? "?" : "&") + params) : "";
				node[request_id].HTTPRequest.open(node[request_id].request_method, node[request_id].request_url, node[request_id].request_async);
				node[request_id].HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node[request_id].HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				if(typeof(node[request_id].request_headers) == "object") {
					var header;
					for(header in node[request_id].request_headers) {
						node[request_id].HTTPRequest.setRequestHeader(header, node[request_id].request_headers[header]);
					}
				}
				node[request_id].HTTPRequest.send("");
			}
			else if(node[request_id].request_method.match(/POST|PUT|PATCH/i)) {
				var params;
				if(typeof(node[request_id].request_data) == "object" && node[request_id].request_data.constructor.toString().match(/function Object/i)) {
					params = JSON.stringify(node[request_id].request_data);
				}
				else {
					params = node[request_id].request_data;
				}
				node[request_id].HTTPRequest.open(node[request_id].request_method, node[request_id].request_url, node[request_id].request_async);
				if(!params.constructor.toString().match(/FormData/i)) {
					node[request_id].HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				}
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node[request_id].HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				if(typeof(node[request_id].request_headers) == "object") {
					var header;
					for(header in node[request_id].request_headers) {
						node[request_id].HTTPRequest.setRequestHeader(header, node[request_id].request_headers[header]);
					}
				}
				node[request_id].HTTPRequest.send(params);
			}
		}
		catch(exception) {
			node[request_id].HTTPRequest.exception = exception;
			u.validateResponse(node[request_id].HTTPRequest);
			return;
		}
		if(!node[request_id].request_async) {
			u.validateResponse(node[request_id].HTTPRequest);
		}
	}
	else if(node[request_id].request_method.match(/SCRIPT/i)) {
		var key = u.randomString();
		document[key] = new Object();
		document[key].node = node;
		document[key].request_id = request_id;
		document[key].responder = function(response) {
			var response_object = new Object();
			response_object.node = this.node;
			response_object.request_id = this.request_id;
			response_object.responseText = response;
			u.validateResponse(response_object);
		}
		var params = u.JSONtoParams(node[request_id].request_data);
		node[request_id].request_url += params ? ((!node[request_id].request_url.match(/\?/g) ? "?" : "&") + params) : "";
		node[request_id].request_url += (!node[request_id].request_url.match(/\?/g) ? "?" : "&") + node[request_id].jsonp_callback + "=document."+key+".responder";
		u.ae(u.qs("head"), "script", ({"type":"text/javascript", "src":node[request_id].request_url}));
	}
	return request_id;
}
Util.JSONtoParams = function(json) {
	if(typeof(json) == "object") {
		var params = "", param;
		for(param in json) {
			params += (params ? "&" : "") + param + "=" + json[param];
		}
		return params
	}
	var object = u.isStringJSON(json);
	if(object) {
		return u.JSONtoParams(object);
	}
	return json;
}
Util.isStringJSON = function(string) {
	if(string.trim().substr(0, 1).match(/[\{\[]/i) && string.trim().substr(-1, 1).match(/[\}\]]/i)) {
		try {
			var test = JSON.parse(string);
			if(typeof(test) == "object") {
				test.isJSON = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.isStringHTML = function(string) {
	if(string.trim().substr(0, 1).match(/[\<]/i) && string.trim().substr(-1, 1).match(/[\>]/i)) {
		try {
			var test = document.createElement("div");
			test.innerHTML = string;
			if(test.childNodes.length) {
				var body_class = string.match(/<body class="([a-z0-9A-Z_: ]+)"/);
				test.body_class = body_class ? body_class[1] : "";
				var head_title = string.match(/<title>([^$]+)<\/title>/);
				test.head_title = head_title ? head_title[1] : "";
				test.isHTML = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.evaluateResponseText = function(responseText) {
	var object;
	if(typeof(responseText) == "object") {
		responseText.isJSON = true;
		return responseText;
	}
	else {
		var response_string;
		if(responseText.trim().substr(0, 1).match(/[\"\']/i) && responseText.trim().substr(-1, 1).match(/[\"\']/i)) {
			response_string = responseText.trim().substr(1, responseText.trim().length-2);
		}
		else {
			response_string = responseText;
		}
		var json = u.isStringJSON(response_string);
		if(json) {
			return json;
		}
		var html = u.isStringHTML(response_string);
		if(html) {
			return html;
		}
		return responseText;
	}
}
Util.validateResponse = function(response){
	var object = false;
	if(response) {
		try {
			if(response.status && !response.status.toString().match(/403|404|500/)) {
				object = u.evaluateResponseText(response.responseText);
			}
			else if(response.responseText) {
				object = u.evaluateResponseText(response.responseText);
			}
		}
		catch(exception) {
			response.exception = exception;
		}
	}
	if(object) {
		if(typeof(response.node[response.request_id].callback_response) == "function") {
			response.node[response.request_id].callback_response(object, response.request_id);
		}
		else if(typeof(response.node[response.node[response.request_id].callback_response]) == "function") {
			response.node[response.node[response.request_id].callback_response](object, response.request_id);
		}
	}
	else {
		if(typeof(response.node[response.request_id].callback_error) == "function") {
			response.node[response.request_id].callback_error(response, response.request_id);
		}
		else if(typeof(response.node[response.node[response.request_id].callback_error]) == "function") {
			response.node[response.node[response.request_id].callback_error](response, response.request_id);
		}
		else if(typeof(response.node[response.request_id].callback_response) == "function") {
			response.node[response.request_id].callback_response(response, response.request_id);
		}
		else if(typeof(response.node[response.node[response.request_id].callback_response]) == "function") {
			response.node[response.node[response.request_id].callback_response](response, response.request_id);
		}
	}
}
u.scrollTo = function(node, _options) {
	node.callback_scroll_to = "scrolledTo";
	node.callback_scroll_cancelled = "scrolledToCancelled";
	var offset_y = 0;
	var offset_x = 0;
	var scroll_to_x = 0;
	var scroll_to_y = 0;
	var to_node = false;
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "callback"             : node.callback_scroll_to           = _options[_argument]; break;
				case "callback_cancelled"   : node.callback_scroll_cancelled    = _options[_argument]; break;
				case "offset_y"             : offset_y                           = _options[_argument]; break;
				case "offset_x"             : offset_x                           = _options[_argument]; break;
				case "node"              : to_node                               = _options[_argument]; break;
				case "x"                    : scroll_to_x                        = _options[_argument]; break;
				case "y"                    : scroll_to_y                        = _options[_argument]; break;
				case "scrollIn"             : scrollIn                           = _options[_argument]; break;
			}
		}
	}
	if(to_node) {
		node._to_x = u.absX(to_node);
		node._to_y = u.absY(to_node);
	}
	else {
		node._to_x = scroll_to_x;
		node._to_y = scroll_to_y;
	}
	node._to_x = offset_x ? node._to_x - offset_x : node._to_x;
	node._to_y = offset_y ? node._to_y - offset_y : node._to_y;
	if(node._to_y > (node == window ? document.body.scrollHeight : node.scrollHeight)-u.browserH()) {
		node._to_y = (node == window ? document.body.scrollHeight : node.scrollHeight)-u.browserH();
	}
	if(node._to_x > (node == window ? document.body.scrollWidth : node.scrollWidth)-u.browserW()) {
		node._to_x = (node == window ? document.body.scrollWidth : node.scrollWidth)-u.browserW();
	}
	node._to_x = node._to_x < 0 ? 0 : node._to_x;
	node._to_y = node._to_y < 0 ? 0 : node._to_y;
	node._x_scroll_direction = node._to_x - u.scrollX();
	node._y_scroll_direction = node._to_y - u.scrollY();
	node._scroll_to_x = u.scrollX();
	node._scroll_to_y = u.scrollY();
	node.scrollToHandler = function(event) {
		u.t.resetTimer(this.t_scroll);
		this.t_scroll = u.t.setTimer(this, this._scrollTo, 50);
	}
	u.e.addEvent(node, "scroll", node.scrollToHandler);
	node.cancelScrollTo = function() {
		u.t.resetTimer(this.t_scroll);
		u.e.removeEvent(this, "scroll", this.scrollToHandler);
		this._scrollTo = null;
	}
	node.IEScrollFix = function(s_x, s_y) {
		if(!u.browser("ie")) {
			return false;
		}
		else if((s_y == this._scroll_to_y && (s_x == this._scroll_to_x+1 || s_x == this._scroll_to_x-1)) ||	(s_x == this._scroll_to_x && (s_y == this._scroll_to_y+1 || s_y == this._scroll_to_y-1))) {
			return true;
		}
	}
	node._scrollTo = function(start) {
		var s_x = u.scrollX();
		var s_y = u.scrollY();
		if((s_y == this._scroll_to_y && s_x == this._scroll_to_x) || this.IEScrollFix(s_x, s_y)) {
			if(this._x_scroll_direction > 0 && this._to_x > s_x) {
				this._scroll_to_x = Math.ceil(s_x + (this._to_x - s_x)/4);
			}
			else if(this._x_scroll_direction < 0 && this._to_x < s_x) {
				this._scroll_to_x = Math.floor(s_x - (s_x - this._to_x)/4);
			}
			else {
				this._scroll_to_x = this._to_x;
			}
			if(this._y_scroll_direction > 0 && this._to_y > s_y) {
				this._scroll_to_y = Math.ceil(s_y + (this._to_y - s_y)/4);
			}
			else if(this._y_scroll_direction < 0 && this._to_y < s_y) {
				this._scroll_to_y = Math.floor(s_y - (s_y - this._to_y)/4);
			}
			else {
				this._scroll_to_y = this._to_y;
			}
			if(this._scroll_to_x == this._to_x && this._scroll_to_y == this._to_y) {
				this.cancelScrollTo();
				this.scrollTo(this._to_x, this._to_y);
				if(typeof(this[this.callback_scroll_to]) == "function") {
					this[this.callback_scroll_to]();
				}
				return;
			}
			this.scrollTo(this._scroll_to_x, this._scroll_to_y);
		}
		else {
			this.cancelScrollTo();
			if(typeof(this[this.callback_scroll_cancelled]) == "function") {
				this[this.callback_scroll_cancelled]();
			}
		}	
	}
	node._scrollTo();
}
Util.cutString = function(string, length) {
	var matches, match, i;
	if(string.length <= length) {
		return string;
	}
	else {
		length = length-3;
	}
	matches = string.match(/\&[\w\d]+\;/g);
	if(matches) {
		for(i = 0; match = matches[i]; i++){
			if(string.indexOf(match) < length){
				length += match.length-1;
			}
		}
	}
	return string.substring(0, length) + (string.length > length ? "..." : "");
}
Util.prefix = function(string, length, prefix) {
	string = string.toString();
	prefix = prefix ? prefix : "0";
	while(string.length < length) {
		string = prefix + string;
	}
	return string;
}
Util.randomString = function(length) {
	var key = "", i;
	length = length ? length : 8;
	var pattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
	for(i = 0; i < length; i++) {
		key += pattern[u.random(0,35)];
	}
	return key;
}
Util.uuid = function() {
	var chars = '0123456789abcdef'.split('');
	var uuid = [], rnd = Math.random, r, i;
	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	uuid[14] = '4';
	for(i = 0; i < 36; i++) {
		if(!uuid[i]) {
			r = 0 | rnd()*16;
			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
		}
 	}
	return uuid.join('');
}
Util.stringOr = u.eitherOr = function(value, replacement) {
	if(value !== undefined && value !== null) {
		return value;
	}
	else {
		return replacement ? replacement : "";
	}	
}
Util.getMatches = function(string, regex) {
	var match, matches = [];
	while(match = regex.exec(string)) {
		matches.push(match[1]);
	}
	return matches;
}
Util.upperCaseFirst = u.ucfirst = function(string) {
	return string.replace(/^(.){1}/, function($1) {return $1.toUpperCase()});
}
Util.lowerCaseFirst = u.lcfirst = function(string) {
	return string.replace(/^(.){1}/, function($1) {return $1.toLowerCase()});
}
Util.normalize = function(string) {
	string = string.toLowerCase();
	string = string.replace(/[^a-z0-9\_]/g, '-');
	string = string.replace(/-+/g, '-');
	string = string.replace(/^-|-$/g, '');
	return string;
}
Util.pluralize = function(count, singular, plural) {
	if(count != 1) {
		return count + " " + plural;
	}
	return count + " " + singular;
}
Util.svg = function(svg_object) {
	var svg, shape, svg_shape;
	if(svg_object.name && u._svg_cache && u._svg_cache[svg_object.name]) {
		svg = u._svg_cache[svg_object.name].cloneNode(true);
	}
	if(!svg) {
		svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		for(shape in svg_object.shapes) {
			Util.svgShape(svg, svg_object.shapes[shape]);
		}
		if(svg_object.name) {
			if(!u._svg_cache) {
				u._svg_cache = {};
			}
			u._svg_cache[svg_object.name] = svg.cloneNode(true);
		}
	}
	if(svg_object.title) {
		svg.setAttributeNS(null, "title", svg_object.title);
	}
	if(svg_object["class"]) {
		svg.setAttributeNS(null, "class", svg_object["class"]);
	}
	if(svg_object.width) {
		svg.setAttributeNS(null, "width", svg_object.width);
	}
	if(svg_object.height) {
		svg.setAttributeNS(null, "height", svg_object.height);
	}
	if(svg_object.id) {
		svg.setAttributeNS(null, "id", svg_object.id);
	}
	if(svg_object.node) {
		svg.node = svg_object.node;
	}
	if(svg_object.node) {
		svg_object.node.appendChild(svg);
	}
	return svg;
}
Util.svgShape = function(svg, svg_object) {
	svg_shape = document.createElementNS("http://www.w3.org/2000/svg", svg_object["type"]);
	svg_object["type"] = null;
	delete svg_object["type"];
	for(detail in svg_object) {
		svg_shape.setAttributeNS(null, detail, svg_object[detail]);
	}
	return svg.appendChild(svg_shape);
}
Util.browser = function(model, version) {
	var current_version = false;
	if(model.match(/\bedge\b/i)) {
		if(navigator.userAgent.match(/Windows[^$]+Gecko[^$]+Edge\/(\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/Edge\/(\d+)/i)[1];
		}
	}
	if(model.match(/\bexplorer\b|\bie\b/i)) {
		if(window.ActiveXObject && navigator.userAgent.match(/MSIE (\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/MSIE (\d+.\d)/i)[1];
		}
		else if(navigator.userAgent.match(/Trident\/[\d+]\.\d[^$]+rv:(\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/Trident\/[\d+]\.\d[^$]+rv:(\d+.\d)/i)[1];
		}
	}
	if(model.match(/\bfirefox\b|\bgecko\b/i) && !u.browser("ie,edge")) {
		if(navigator.userAgent.match(/Firefox\/(\d+\.\d+)/i)) {
			current_version = navigator.userAgent.match(/Firefox\/(\d+\.\d+)/i)[1];
		}
	}
	if(model.match(/\bwebkit\b/i)) {
		if(navigator.userAgent.match(/WebKit/i) && !u.browser("ie,edge")) {
			current_version = navigator.userAgent.match(/AppleWebKit\/(\d+.\d)/i)[1];
		}
	}
	if(model.match(/\bchrome\b/i)) {
		if(window.chrome && !u.browser("ie,edge")) {
			current_version = navigator.userAgent.match(/Chrome\/(\d+)(.\d)/i)[1];
		}
	}
	if(model.match(/\bsafari\b/i)) {
		if(!window.chrome && document.body.style.webkitTransform != undefined && !u.browser("ie,edge")) {
			current_version = navigator.userAgent.match(/Version\/(\d+)(.\d)/i)[1];
		}
	}
	if(model.match(/\bopera\b/i)) {
		if(window.opera) {
			if(navigator.userAgent.match(/Version\//)) {
				current_version = navigator.userAgent.match(/Version\/(\d+)(.\d)/i)[1];
			}
			else {
				current_version = navigator.userAgent.match(/Opera[\/ ]{1}(\d+)(.\d)/i)[1];
			}
		}
	}
	if(current_version) {
		if(!version) {
			return current_version;
		}
		else {
			if(!isNaN(version)) {
				return current_version == version;
			}
			else {
				return eval(current_version + version);
			}
		}
	}
	else {
		return false;
	}
}
Util.segment = function(segment) {
	if(!u.current_segment) {
		var scripts = document.getElementsByTagName("script");
		var script, i, src;
		for(i = 0; script = scripts[i]; i++) {
			seg_src = script.src.match(/\/seg_([a-z_]+)/);
			if(seg_src) {
				u.current_segment = seg_src[1];
			}
		}
	}
	if(segment) {
		return segment == u.current_segment;
	}
	return u.current_segment;
}
Util.system = function(os, version) {
	var current_version = false;
	if(os.match(/\bwindows\b/i)) {
		if(navigator.userAgent.match(/(Windows NT )(\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/(Windows NT )(\d+.\d)/i)[2];
		}
	}
	else if(os.match(/\bmac\b/i)) {
		if(navigator.userAgent.match(/(Macintosh; Intel Mac OS X )(\d+[._]{1}\d)/i)) {
			current_version = navigator.userAgent.match(/(Macintosh; Intel Mac OS X )(\d+[._]{1}\d)/i)[2].replace("_", ".");
		}
	}
	else if(os.match(/\blinux\b/i)) {
		if(navigator.userAgent.match(/linux|x11/i) && !navigator.userAgent.match(/android/i)) {
			current_version = true;
		}
	}
	else if(os.match(/\bios\b/i)) {
		if(navigator.userAgent.match(/(OS )(\d+[._]{1}\d+[._\d]*)( like Mac OS X)/i)) {
			current_version = navigator.userAgent.match(/(OS )(\d+[._]{1}\d+[._\d]*)( like Mac OS X)/i)[2].replace(/_/g, ".");
		}
	}
	else if(os.match(/\bandroid\b/i)) {
		if(navigator.userAgent.match(/Android[ ._]?(\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/Android[ ._]?(\d+.\d)/i)[1];
		}
	}
	else if(os.match(/\bwinphone\b/i)) {
		if(navigator.userAgent.match(/Windows[ ._]?Phone[ ._]?(\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/Windows[ ._]?Phone[ ._]?(\d+.\d)/i)[1];
		}
	}
	if(current_version) {
		if(!version) {
			return current_version;
		}
		else {
			if(!isNaN(version)) {
				return current_version == version;
			}
			else {
				return eval(current_version + version);
			}
		}
	}
	else {
		return false;
	}
}
Util.support = function(property) {
	if(document.documentElement) {
		var style_property = u.lcfirst(property.replace(/^(-(moz|webkit|ms|o)-|(Moz|webkit|Webkit|ms|O))/, "").replace(/(-\w)/g, function(word){return word.replace(/-/, "").toUpperCase()}));
		if(style_property in document.documentElement.style) {
			return true;
		}
		else if(u.vendorPrefix() && (u.vendorPrefix()+u.ucfirst(style_property)) in document.documentElement.style) {
			return true;
		}
	}
	return false;
}
Util.vendor_properties = {};
Util.vendorProperty = function(property) {
	if(!Util.vendor_properties[property]) {
		Util.vendor_properties[property] = property.replace(/(-\w)/g, function(word){return word.replace(/-/, "").toUpperCase()});
		if(document.documentElement) {
			var style_property = u.lcfirst(property.replace(/^(-(moz|webkit|ms|o)-|(Moz|webkit|Webkit|ms|O))/, "").replace(/(-\w)/g, function(word){return word.replace(/-/, "").toUpperCase()}));
			if(style_property in document.documentElement.style) {
				Util.vendor_properties[property] = style_property;
			}
			else if(u.vendorPrefix() && (u.vendorPrefix()+u.ucfirst(style_property)) in document.documentElement.style) {
				Util.vendor_properties[property] = u.vendorPrefix()+u.ucfirst(style_property);
			}
		}
	}
	return Util.vendor_properties[property];
}
Util.vendor_prefix = false;
Util.vendorPrefix = function() {
	if(Util.vendor_prefix === false) {
		Util.vendor_prefix = "";
		if(document.documentElement && typeof(window.getComputedStyle) == "function") {
			var styles = window.getComputedStyle(document.documentElement, "");
			if(styles.length) {
				var i, style, match;
				for(i = 0; style = styles[i]; i++) {
					match = style.match(/^-(moz|webkit|ms)-/);
					if(match) {
						Util.vendor_prefix = match[1];
						if(Util.vendor_prefix == "moz") {
							Util.vendor_prefix = "Moz";
						}
						break;
					}
				}
			}
			else {
				var x, match;
				for(x in styles) {
					match = x.match(/^(Moz|webkit|ms|OLink)/);
					if(match) {
						Util.vendor_prefix = match[1];
						if(Util.vendor_prefix === "OLink") {
							Util.vendor_prefix = "O";
						}
						break;
					}
				}
			}
		}
	}
	return Util.vendor_prefix;
}
u.textscaler = function(node, _settings) {
	if(typeof(_settings) != "object") {
		_settings = {
			"*":{
				"unit":"rem",
				"min_size":1,
				"min_width":200,
				"min_height":200,
				"max_size":40,
				"max_width":3000,
				"max_height":2000
			}
		};
	}
	node.text_key = u.randomString(8);
	u.ac(node, node.text_key);
	node.text_settings = JSON.parse(JSON.stringify(_settings));
	node.scaleText = function() {
		var tag;
		for(tag in this.text_settings) {
			var settings = this.text_settings[tag];
			var width_wins = false;
			var height_wins = false;
			if(settings.width_factor && settings.height_factor) {
				if(window._man_text._height - settings.min_height < window._man_text._width - settings.min_width) {
					height_wins = true;
				}
				else {
					width_wins = true;
				}
			}
			if(settings.width_factor && !height_wins) {
				if(settings.min_width <= window._man_text._width && settings.max_width >= window._man_text._width) {
					var font_size = settings.min_size + (settings.size_factor * (window._man_text._width - settings.min_width) / settings.width_factor);
					settings.css_rule.style.setProperty("font-size", font_size + settings.unit, "important");
				}
				else if(settings.max_width < window._man_text._width) {
					settings.css_rule.style.setProperty("font-size", settings.max_size + settings.unit, "important");
				}
				else if(settings.min_width > window._man_text._width) {
					settings.css_rule.style.setProperty("font-size", settings.min_size + settings.unit, "important");
				}
			}
			else if(settings.height_factor) {
				if(settings.min_height <= window._man_text._height && settings.max_height >= window._man_text._height) {
					var font_size = settings.min_size + (settings.size_factor * (window._man_text._height - settings.min_height) / settings.height_factor);
					settings.css_rule.style.setProperty("font-size", font_size + settings.unit, "important");
				}
				else if(settings.max_height < window._man_text._height) {
					settings.css_rule.style.setProperty("font-size", settings.max_size + settings.unit, "important");
				}
				else if(settings.min_height > window._man_text._height) {
					settings.css_rule.style.setProperty("font-size", settings.min_size + settings.unit, "important");
				}
			}
		}
	}
	node.cancelTextScaling = function() {
		u.e.removeEvent(window, "resize", window._man_text.scale);
	}
	if(!window._man_text) {
		var man_text = {};
		man_text.nodes = [];
		var style_tag = document.createElement("style");
		style_tag.setAttribute("media", "all")
		style_tag.setAttribute("type", "text/css")
		man_text.style_tag = u.ae(document.head, style_tag);
		man_text.style_tag.appendChild(document.createTextNode(""))
		window._man_text = man_text;
		window._man_text._width = u.browserW();
		window._man_text._height = u.browserH();
		window._man_text.scale = function() {
			window._man_text._width = u.browserW();
			window._man_text._height = u.browserH();
			var i, node;
			for(i = 0; node = window._man_text.nodes[i]; i++) {
				if(node.parentNode) { 
					node.scaleText();
				}
				else {
					window._man_text.nodes.splice(window._man_text.nodes.indexOf(node), 1);
					if(!window._man_text.nodes.length) {
						u.e.removeEvent(window, "resize", window._man_text.scale);
						window._man_text = false;
						break;
					}
				}
			}
		}
		u.e.addEvent(window, "resize", window._man_text.scale);
		window._man_text.precalculate = function() {
			var i, node, tag;
			for(i = 0; node = window._man_text.nodes[i]; i++) {
				if(node.parentNode) { 
					var settings = node.text_settings;
					for(tag in settings) {
						if(settings[tag].max_width && settings[tag].min_width) {
							settings[tag].width_factor = settings[tag].max_width-settings[tag].min_width;
						}
						else if(node._man_text.max_width && node._man_text.min_width) {
							settings[tag].max_width = node._man_text.max_width;
							settings[tag].min_width = node._man_text.min_width;
							settings[tag].width_factor = node._man_text.max_width-node._man_text.min_width;
						}
						else {
							settings[tag].width_factor = false;
						}
						if(settings[tag].max_height && settings[tag].min_height) {
							settings[tag].height_factor = settings[tag].max_height-settings[tag].min_height;
						}
						else if(node._man_text.max_height && node._man_text.min_height) {
							settings[tag].max_height = node._man_text.max_height;
							settings[tag].min_height = node._man_text.min_height;
							settings[tag].height_factor = node._man_text.max_height-node._man_text.min_height;
						}
						else {
							settings[tag].height_factor = false;
						}
						settings[tag].size_factor = settings[tag].max_size-settings[tag].min_size;
						if(!settings[tag].unit) {
							settings[tag].unit = node._man_text.unit;
						}
					}
				}
			}
		}
	}
	var tag;
	node._man_text = {};
	for(tag in node.text_settings) {
		if(tag == "min_height" || tag == "max_height" || tag == "min_width" || tag == "max_width" || tag == "unit") {
			node._man_text[tag] = node.text_settings[tag];
			node.text_settings[tag] = null;
			delete node.text_settings[tag];
		}
		else {
			selector = "."+node.text_key + ' ' + tag + ' ';
			node.css_rules_index = window._man_text.style_tag.sheet.insertRule(selector+'{}', 0);
			node.text_settings[tag].css_rule = window._man_text.style_tag.sheet.cssRules[0];
		}
	}
	window._man_text.nodes.push(node);
	window._man_text.precalculate();
	node.scaleText();
}
Util.Timer = u.t = new function() {
	this._timers = new Array();
	this.setTimer = function(node, action, timeout, param) {
		var id = this._timers.length;
		param = param ? param : {"target":node, "type":"timeout"};
		this._timers[id] = {"_a":action, "_n":node, "_p":param, "_t":setTimeout("u.t._executeTimer("+id+")", timeout)};
		return id;
	}
	this.resetTimer = function(id) {
		if(this._timers[id]) {
			clearTimeout(this._timers[id]._t);
			this._timers[id] = false;
		}
	}
	this._executeTimer = function(id) {
		var timer = this._timers[id];
		this._timers[id] = false;
		var node = timer._n;
		if(typeof(timer._a) == "function") {
			node._timer_action = timer._a;
			node._timer_action(timer._p);
			node._timer_action = null;
		}
		else if(typeof(node[timer._a]) == "function") {
			node[timer._a](timer._p);
		}
	}
	this.setInterval = function(node, action, interval, param) {
		var id = this._timers.length;
		param = param ? param : {"target":node, "type":"timeout"};
		this._timers[id] = {"_a":action, "_n":node, "_p":param, "_i":setInterval("u.t._executeInterval("+id+")", interval)};
		return id;
	}
	this.resetInterval = function(id) {
		if(this._timers[id]) {
			clearInterval(this._timers[id]._i);
			this._timers[id] = false;
		}
	}
	this._executeInterval = function(id) {
		var node = this._timers[id]._n;
		if(typeof(this._timers[id]._a) == "function") {
			node._interval_action = this._timers[id]._a;
			node._interval_action(this._timers[id]._p);
			node._interval_action = null;
		}
		else if(typeof(node[this._timers[id]._a]) == "function") {
			node[this._timers[id]._a](this._timers[id]._p);
		}
	}
	this.valid = function(id) {
		return this._timers[id] ? true : false;
	}
	this.resetAllTimers = function() {
		var i, t;
		for(i = 0; i < this._timers.length; i++) {
			if(this._timers[i] && this._timers[i]._t) {
				this.resetTimer(i);
			}
		}
	}
	this.resetAllIntervals = function() {
		var i, t;
		for(i = 0; i < this._timers.length; i++) {
			if(this._timers[i] && this._timers[i]._i) {
				this.resetInterval(i);
			}
		}
	}
}
Util.getVar = function(param, url) {
	var string = url ? url.split("#")[0] : location.search;
	var regexp = new RegExp("[\&\?\b]{1}"+param+"\=([^\&\b]+)");
	var match = string.match(regexp);
	if(match && match.length > 1) {
		return match[1];
	}
	else {
		return "";
	}
}
if(false && document.documentMode <= 10) {
	Util.appendElement = u.ae = function(_parent, node_type, attributes) {
		try {
			var node = (typeof(node_type) == "object") ? node_type : document.createElement(node_type);
			if(attributes) {
				var attribute;
				for(attribute in attributes) {
					if(!attribute.match(/^(value|html)$/)) {
						node.setAttribute(attribute, attributes[attribute]);
					}
				}
			}
			node = _parent.appendChild(node);
			if(attributes) {
				if(attributes["value"]) {
					node.value = attributes["value"];
				}
				if(attributes["html"]) {
					node.innerHTML = attributes["html"];
				}
			}
			return node;
		}
		catch(exception) {
			u.exception("u.ae (desktop_ie10)", arguments, exception);
		}
	}
	Util.insertElement = u.ie = function(_parent, node_type, attributes) {
		try {
			var node = (typeof(node_type) == "object") ? node_type : document.createElement(node_type);
			if(attributes) {
				var attribute;
				for(attribute in attributes) {
					if(!attribute.match(/^(value|html)$/)) {
						node.setAttribute(attribute, attributes[attribute]);
					}
				}
			}
			node = _parent.insertBefore(node, _parent.firstChild);
			if(attributes) {
				if(attributes["value"]) {
					node.value = attributes["value"];
				}
				if(attributes["html"]) {
					node.innerHTML = attributes["html"];
				}
			}
			return node;
		}
		catch(exception) {
			u.exception("u.ie (desktop_ie10)", arguments, exception);
		}
	}
}


/*u-settings.js*/
u.ga_account = 'UA-91951821-1';
u.ga_domain = '';
u.gapi_key = '';


/*u-googleanalytics.js*/
if(u.ga_account) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.defer=true;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', u.ga_account, u.ga_domain);
    ga('send', 'pageview');
	u.stats = new function() {
		this.pageView = function(url) {
			ga('send', 'pageview', url);
		}
		this.event = function(node, _options) {
			var event = false;
			var eventCategory = "Uncategorized";
			var eventAction = null;
			var eventLabel = null;
			var eventValue = null;
			var nonInteraction = false;
			var hitCallback = null;
			if(typeof(_options) == "object") {
				var _argument;
				for(_argument in _options) {
					switch(_argument) {
						case "event"				: event					= _options[_argument]; break;
						case "eventCategory"		: eventCategory			= _options[_argument]; break;
						case "eventAction"			: eventAction			= _options[_argument]; break;
						case "eventLabel"			: eventLabel			= _options[_argument]; break;
						case "eventValue"			: eventValue			= _options[_argument]; break;
						case "nonInteraction"		: nonInteraction		= _options[_argument]; break;
						case "hitCallback"			: hitCallback			= _options[_argument]; break;
					}
				}
			}
			if(!eventAction && event && event.type) {
				eventAction = event.type;
			}
			else if(!eventAction) {
				eventAction = "Unknown";
			}
			if(!eventLabel && event && event.currentTarget && event.currentTarget.url) {
				eventLabel = event.currentTarget.url;
			}
			else if(!eventLabel) {
				eventLabel = this.nodeSnippet(node);
			}
			ga('send', 'event', {
				"eventCategory": eventCategory, 
				"eventAction": eventAction,
				"eventLabel": eventLabel,
				"eventValue": eventValue,
				"nonInteraction": nonInteraction,
				"hitCallback": hitCallback
			});
		}
		// 	
		// 	//       slot,		
		// 	//       name,		
		// 	//       value,	
		// 	//       scope		
		// 	
		this.nodeSnippet = function(node) {
			return u.cutString(u.text(node).trim(), 20) + "(<"+node.nodeName+">)";
		}
	}
}


/*u-audio.js*/
Util.audioPlayer = function(_options) {
	var player = document.createElement("div");
	u.ac(player, "audioplayer");
	player._autoplay = false;
	player._controls = false;
	player._controls_playpause = false;
	player._controls_volume = false;
	player._controls_search = false;
	player._ff_skip = 2;
	player._rw_skip = 2;
	if(typeof(_options) == "object") {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "autoplay"     : player._autoplay               = _options[_argument]; break;
				case "controls"     : player._controls               = _options[_argument]; break;
				case "playpause"    : player._controls_playpause     = _options[_argument]; break;
				case "volume"       : player._controls_volume        = _options[_argument]; break;
				case "search"       : player._controls_search        = _options[_argument]; break;
				case "ff_skip"      : player._ff_skip                = _options[_argument]; break;
				case "rw_skip"      : player._rw_skip                = _options[_argument]; break;
			}
		}
	}
	player.audio = u.ae(player, "audio");
	if(typeof(player.audio.play) == "function") {
		player.load = function(src, _options) {
			if(typeof(_options) == "object") {
				var _argument;
				for(_argument in _options) {
					switch(_argument) {
						case "autoplay"     : this._autoplay               = _options[_argument]; break;
						case "controls"     : this._controls               = _options[_argument]; break;
						case "playpause"    : this._controls_playpause     = _options[_argument]; break;
						case "volume"       : this._controls_volume        = _options[_argument]; break;
						case "search"       : this._controls_search        = _options[_argument]; break;
						case "ff_skip"      : this._ff_skip                = _options[_argument]; break;
						case "rw_skip"      : this._rw_skip                = _options[_argument]; break;
					}
				}
			}
			if(u.hc(this, "playing")) {
				this.stop();
			}
			this.setup();
			if(src) {
				this.audio.src = this.correctSource(src);
				this.audio.load();
				this.audio.controls = player._controls;
				this.audio.autoplay = player._autoplay;
			}
		}
		player.play = function(position) {
			if(this.audio.currentTime && position !== undefined) {
				this.audio.currentTime = position;
			}
			if(this.audio.src) {
				this.audio.play();
			}
		}
		player.loadAndPlay = function(src, _options) {
			var position = 0;
			if(typeof(_options) == "object") {
				var _argument;
				for(_argument in _options) {
					switch(_argument) {
						case "position"		: position		= _options[_argument]; break;
					}
				}
			}
			this.load(src, _options);
			this.play(position);
		}
		player.pause = function() {
			this.audio.pause();
		}
		player.stop = function() {
			this.audio.pause();
			if(this.audio.currentTime) {
				this.audio.currentTime = 0;
			}
		}
		player.ff = function() {
			if(this.audio.src && this.audio.currentTime && this.audioLoaded) {
				this.audio.currentTime = (this.audio.duration - this.audio.currentTime >= this._ff_skip) ? (this.audio.currentTime + this._ff_skip) : this.audio.duration;
				this.audio._timeupdate();
			}
		}
		player.rw = function() {
			if(this.audio.src && this.audio.currentTime && this.audioLoaded) {
				this.audio.currentTime = (this.audio.currentTime >= this._rw_skip) ? (this.audio.currentTime - this._rw_skip) : 0;
				this.audio._timeupdate();
			}
		}
		player.togglePlay = function() {
			if(u.hc(this, "playing")) {
				this.pause();
			}
			else {
				this.play();
			}
		}
		player.setup = function() {
			if(this.audio) {
				var audio = this.removeChild(this.audio);
				delete audio;
			}
			this.audio = u.ie(this, "audio");
			this.audio.player = this;
			this.setControls();
			this.currentTime = 0;
			this.duration = 0;
			this.audioLoaded = false;
			this.metaLoaded = false;
			this.audio._loadstart = function(event) {
				u.ac(this.player, "loading");
				if(typeof(this.player.loading) == "function") {
					this.player.loading(event);
				}
			}
			u.e.addEvent(this.audio, "loadstart", this.audio._loadstart);
			this.audio._canplaythrough = function(event) {
				u.rc(this.player, "loading");
				if(typeof(this.player.canplaythrough) == "function") {
					this.player.canplaythrough(event);
				}
			}
			u.e.addEvent(this.audio, "canplaythrough", this.audio._canplaythrough);
			this.audio._playing = function(event) {
				u.rc(this.player, "loading|paused");
				u.ac(this.player, "playing");
				if(typeof(this.player.playing) == "function") {
					this.player.playing(event);
				}
			}
			u.e.addEvent(this.audio, "playing", this.audio._playing);
			this.audio._paused = function(event) {
				u.rc(this.player, "playing|loading");
				u.ac(this.player, "paused");
				if(typeof(this.player.paused) == "function") {
					this.player.paused(event);
				}
			}
			u.e.addEvent(this.audio, "pause", this.audio._paused);
			this.audio._stalled = function(event) {
				u.rc(this.player, "playing|paused");
				u.ac(this.player, "loading");
				if(typeof(this.player.stalled) == "function") {
					this.player.stalled(event);
				}
			}
			u.e.addEvent(this.audio, "stalled", this.audio._paused);
			this.audio._ended = function(event) {
				u.rc(this.player, "playing|paused");
				if(typeof(this.player.ended) == "function") {
					this.player.ended(event);
				}
			}
			u.e.addEvent(this.audio, "ended", this.audio._ended);
			this.audio._loadedmetadata = function(event) {
				this.player.duration = this.duration;
				this.player.currentTime = this.currentTime;
				this.player.metaLoaded = true;
				if(typeof(this.player.loadedmetadata) == "function") {
					this.player.loadedmetadata(event);
				}
			}
			u.e.addEvent(this.audio, "loadedmetadata", this.audio._loadedmetadata);
			this.audio._loadeddata = function(event) {
				this.player.audioLoaded = true;
				if(typeof(this.player.loadeddata) == "function") {
					this.player.loadeddata(event);
				}
			}
			u.e.addEvent(this.audio, "loadeddata", this.audio._loadeddata);
			this.audio._timeupdate = function(event) {
				this.player.currentTime = this.currentTime;
				if(typeof(this.player.timeupdate) == "function") {
					this.player.timeupdate(event);
				}
			}
			u.e.addEvent(this.audio, "timeupdate", this.audio._timeupdate);
		}
	}
	else if(typeof(u.audioPlayerFallback) == "function") {
		player.removeChild(player.video);
		player = u.audioPlayerFallback(player);
	}
	else {
		player.load = function() {}
		player.play = function() {}
		player.loadAndPlay = function() {}
		player.pause = function() {}
		player.stop = function() {}
		player.ff = function() {}
		player.rw = function() {}
		player.togglePlay = function() {}
	}
	player.correctSource = function(src) {
		var param = src.match(/\?[^$]+/) ? src.match(/(\?[^$]+)/)[1] : "";
		src = src.replace(/\?[^$]+/, "");
		src = src.replace(/.mp3|.ogg|.wav/, "");
		if(this.flash) {
			return src+".mp3"+param;
		}
		if(this.audio.canPlayType("audio/mpeg")) {
			return src+".mp3"+param;
		}
		else if(this.audio.canPlayType("audio/ogg")) {
			return src+".ogg"+param;
		}
		else {
			return src+".wav"+param;
		}
	}
	player.setControls = function() {
		if(this.showControls) {
			if(u.e.event_pref == "mouse") {
				u.e.removeEvent(this, "mousemove", this.showControls);
				u.e.removeEvent(this.controls, "mouseenter", this._keepControls);
				u.e.removeEvent(this.controls, "mouseleave", this._unkeepControls);
			}
			else {
				u.e.removeEvent(this, "touchstart", this.showControls);
			}
		}
		if(this._controls_playpause || this._controls_zoom || this._controls_volume || this._controls_search) {
			if(!this.controls) {
				this.controls = u.ae(this, "div", {"class":"controls"});
				this.controls.player = this;
				this.controls._default_display = u.gcs(this.controls, "display");
				this.hideControls = function() {
					if(!this._keep) {
						this.t_controls = u.t.resetTimer(this.t_controls);
						u.a.transition(this.controls, "all 0.3s ease-out");
						u.a.setOpacity(this.controls, 0);
					}
				}
				this.showControls = function() {
					if(this.t_controls) {
						this.t_controls = u.t.resetTimer(this.t_controls);
					}
					else {
						u.a.transition(this.controls, "all 0.5s ease-out");
						u.a.setOpacity(this.controls, 1);
					}
					this.t_controls = u.t.setTimer(this, this.hideControls, 1500);
				}
				this._keepControls = function() {
					this.player._keep = true;
				}
				this._unkeepControls = function() {
					this.player._keep = false;
				}
			}
			else {
				u.as(this.controls, "display", this.controls._default_display);
			}
			if(this._controls_playpause) {
				if(!this.controls.playpause) {
					this.controls.playpause = u.ae(this.controls, "a", {"class":"playpause"});
					this.controls.playpause._default_display = u.gcs(this.controls.playpause, "display");
					this.controls.playpause.player = this;
					u.e.click(this.controls.playpause);
					this.controls.playpause.clicked = function(event) {
						this.player.togglePlay();
					}
				}
				else {
					u.as(this.controls.playpause, "display", this.controls.playpause._default_display);
				}
			}
			else if(this.controls.playpause) {
				u.as(this.controls.playpause, "display", "none");
			}
			if(this._controls_search) {
				if(!this.controls.search) {
					this.controls.search_ff = u.ae(this.controls, "a", {"class":"ff"});
					this.controls.search_ff._default_display = u.gcs(this.controls.search_ff, "display");
					this.controls.search_ff.player = this;
					this.controls.search_rw = u.ae(this.controls, "a", {"class":"rw"});
					this.controls.search_rw._default_display = u.gcs(this.controls.search_rw, "display");
					this.controls.search_rw.player = this;
					u.e.click(this.controls.search_ff);
					this.controls.search_ff.ffing = function() {
						this.t_ffing = u.t.setTimer(this, this.ffing, 100);
						this.player.ff();
					}
					this.controls.search_ff.inputStarted = function(event) {
						this.ffing();
					}
					this.controls.search_ff.clicked = function(event) {
						u.t.resetTimer(this.t_ffing);
					}
					u.e.click(this.controls.search_rw);
					this.controls.search_rw.rwing = function() {
						this.t_rwing = u.t.setTimer(this, this.rwing, 100);
						this.player.rw();
					}
					this.controls.search_rw.inputStarted = function(event) {
						this.rwing();
					}
					this.controls.search_rw.clicked = function(event) {
						u.t.resetTimer(this.t_rwing);
						this.player.rw();
					}
					this.controls.search = true;
				}
				else {
					u.as(this.controls.search_ff, "display", this.controls.search_ff._default_display);
					u.as(this.controls.search_rw, "display", this.controls.search_rw._default_display);
				}
			}
			else if(this.controls.search) {
				u.as(this.controls.search_ff, "display", "none");
				u.as(this.controls.search_rw, "display", "none");
			}
			if(this._controls_zoom && !this.controls.zoom) {}
			else if(this.controls.zoom) {}
			if(this._controls_volume && !this.controls.volume) {}
			else if(this.controls.volume) {}
			if(u.e.event_pref == "mouse") {
				u.e.addEvent(this.controls, "mouseenter", this._keepControls);
				u.e.addEvent(this.controls, "mouseleave", this._unkeepControls);
				u.e.addEvent(this, "mousemove", this.showControls);
			}
			else {
				u.e.addEvent(this, "touchstart", this.showControls);
			}
		}
		else if(this.controls) {
			u.as(this.controls, "display", "none");
		}
	}
	return player;
}

/*i-page.js*/
Util.Objects["page"] = new function() {
	this.init = function(page) {
		page.hN = u.qs("#header");
		page.hN.service = u.qs("ul.servicenavigation", page.hN);
		page.cN = u.qs("#content", page);
		page.nN = u.qs("#navigation", page);
		page.fN = u.qs("#footer");
		page.resized = function() {
			page.browser_h = u.browserH();
			page.browser_w = u.browserW();
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
		page.scrolled = function() {
			if(page.cN && page.cN.scene && typeof(page.cN.scene.scrolled) == "function") {
				page.cN.scene.scrolled();
			}
		}
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
		page.ready = function() {
			if(!this.is_ready) {
				this.is_ready = true;
				this.cN.scene = u.qs(".scene", this);
				u.e.addEvent(window, "resize", this.resized);
				u.e.addEvent(window, "scroll", this.scrolled);
				u.e.addEvent(window, "orientationchange", page.orientationchanged);
				page.orientationchanged();
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
				this.initHeader();
				this.acceptCookies();
				this.initIntro();
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
		page.initNavigation = function() {
			page.nN.list = u.qs("ul.navigation", page.nN);
			page.nN.bn_prices = u.ae(page.nN.list, "li", {"class":"prizes", "html":"Præmier"});
			u.ce(page.nN.bn_prices);
			page.nN.bn_prices.clicked = function() {
				page.playEventSound();
				page.openPrizes();
			}
			u.a.transition(page.nN.bn_prices, "all 0.3s ease-in-out");
			u.ass(page.nN.bn_prices, {
				"opacity":1
			});
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
				week = week < 0 ? 0 : (week > 6 ? 6 : week);
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
				u.a.transition(this.ul, "all 0.4s ease-in-out");
				u.a.translate(this.ul, -week*620, 0);
				u.ass(this.h1, {
					"backgroundImage":"url(/img/assets/desktop/prize_header_week"+week+".png)"
				});
			}
			u.a.translate(div_prizes.ul, -week*620, 0);
			div_prizes.setWeek(week);
			page.overlay.closed = function() {
				delete page.overlay;
			}
		}
		page.initIntro = function() {
			page.playBgSound();
			u.o.intro.init(page.cN.scene);
		}
		page.acceptCookies = function() {
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
				u.a.transition(terms, "all 0.5s ease-in");
				u.ass(terms, {
					"opacity": 1
				});
			}
		}
		page.updateAssets = function() {
			if(this.assetsActive && this.current_jan) {
				this.showJan(this.current_jan)
			}
			else if(!this.assetsActive) {
				this.hideJan();
			}
		}
		page.showJan = function(which) {
			this.old_jan = this.current_jan;
			this.current_jan = which;
			if(this.assetsActive && (this.old_jan != this.current_jan || !this.div_jan)) {
				if(!this.div_jan) {
					this.div_jan = u.ae(page, "div", {"class":"jan"});
					u.a.translate(this.div_jan, -(this.div_jan.offsetWidth), 0);
				}
				this.div_jan.janReady = function() {
					u.ass(this, {
						"backgroundImage":"url(/img/assets/desktop/jan_"+page.current_jan+".png)"
					})
					u.a.transition(this, "all 0.2s ease-out");
					u.ass(this, {
						"opacity":1,
						"transform":"translate(0, 0)"
					});
				}
				if(this.old_jan && this.old_jan != this.current_jan) {
					u.a.transition(this.div_jan, "all 0.3 ease-in", "janReady");
					u.a.translate(this.div_jan, -this.div_jan.offsetWidth, 0);
				}
				else if(this.current_jan) {
					delete this.div_jan.removeJan;
					this.div_jan.janReady();
				}
			}
		}
		page.hideJan = function(clear) {
			clear = clear || false;
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
			if(clear) {
				this.current_jan = false;
			}
		}
		page.openOverlay = function(url) {
			if(page.overlay) {
				u.bug("overlay already open");
				page._overlay_queued_url = url;
				page.overlay.closed = function() {
					if(page._overlay_queued_url) {
						page.openOverlay(page._overlay_queued_url);
						page._overlay_queued_url = false;
					}
				}
				page.overlay.close();
			}
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
		page.ready();
	}
}
u.e.addDOMReadyEvent(u.init);


/*i-intro.js*/
Util.Objects["intro"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
			if(this.intro.intro_scene) {
				u.ass(this.intro.intro_scene.renderer.view, {
					"margin-top": "-200px"
				})
			}
		}
		scene.scrolled = function() {
		}
		scene.ready = function() {
			this.intro = u.ae(this, "div", {"class":"intro"});
			this.intro.scene = this;
			u.o.IntroScene.init(this.intro);
		}
		scene.build = function() {
			this.resized();
			u.a.transition(this.intro, "none");
			u.ass(this.intro, {
				"opacity":1
			});
			u.o.IntroScene.build(this.intro);
		}
		scene.destroy = function() {
			if(this.intro) {
				this.intro.parentNode.removeChild(this.intro);
			}
			u.o.front.init(this);
		}
		scene.ready();
	}
}


/*i-front.js*/
Util.Objects["front"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
			if(this.front.start_scene) {
				u.ass(this.front.start_scene.renderer.view, {
					"margin-top": "-200px"
				});
			}
		}
		scene.scrolled = function() {
		}
		scene.ready = function() {
			this.front = u.ae(this, "div", {"class":"front"});
			this.front.scene = this;
			u.o.StartScene.init(this.front);
		}
		scene.build = function() {
			this.resized();
			u.a.transition(this.front, "none");
			u.ass(this.front, {
				"opacity":1
			});
			u.o.StartScene.build(this.front);
			page.initNavigation();
		}
		scene.destroy = function() {
			if(this.front) {
				this.front.parentNode.removeChild(this.front);
			}
			u.o.game.init(this);
		}
		scene.ready();
	}
}


/*i-game.js*/
Util.Objects["game"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
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
		}
		scene.scrolled = function() {
		}
		scene.ready = function() {
			this.game = u.ae(this, "div", {"class":"game"});
			this.game.scene = this;
			this.game.game_bricks = false;
			this.game.game_screen = false;
			this.game.game_selector = false;
			this.game.game_already_played = false;
			page.showVedLogo();
			this.game.response = function(response) {
				var game_timestamp = new Date(page.getAttribute("data-date")).getTime();
				this.scene.current_round_index = false;
				if(response && response.rounds) {
					this.scene.quiz = response;
					this.scene.quiz_answers = JSON.parse(u.getCookie("stofa_ved_answers")) || {};
					var i, round;
					for(i = 0; round = this.scene.quiz.rounds[i]; i++) {
						if(new Date(round.start).getTime() <= game_timestamp && new Date(round.end).getTime() >= game_timestamp) {
							this.scene.current_round_index = i;
							break;
						}
					}
					u.o.GameScreen.init(this);
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
							u.o.GameBricks.init(this, "first");
						}
						else {
							u.o.GameAlreadyPlayed.init(this);
						}
					}
					else {
						this.scene.all_rounds_over = true;
						u.o.GameSelector.init(this, "first");
					}
				}
				else {
					page.error("general");
				}
			}
			u.request(this.game, "/quiz/quiz.json?rev=4");
		}
		scene.build = function() {
			if(this.quiz && this.game.game_screen.is_ready && ((this.game.game_bricks && this.game.game_bricks.is_ready) || (this.game.game_selector && this.game.game_selector.is_ready) || (this.game.game_already_played && this.game.game_already_played.is_ready))) {
				this.resized();
				u.a.transition(this.game, "none");
				u.ass(this.game, {
					"opacity":1
				});
				if(!this.game.game_screen.is_built) {
					u.o.GameScreen.build(this.game);
				}
				if(this.game.game_bricks.is_ready) {
					u.o.GameBricks.build(this.game);
				}
				else if(this.game.game_already_played.is_ready) {
					u.o.GameAlreadyPlayed.build(this.game);
				}
				else if(this.game.game_selector.is_ready) {
					u.o.GameSelector.build(this.game);
				}
			}
		}
		scene.destroy = function() {
			if(this.game) {
				this.game.transitioned = function() {
					this.parentNode.removeChild(this);
					delete this.scene.game;
				}
				u.a.transition(this.game, "all 0.5s ease-in-out");
				u.ass(this.game, {
					"opacity":0
				});
			}
			else {
			}
		}
		scene.ready();
	}
}


/*i-introscene.js*/
Util.Objects["IntroScene"] = new function() {
	this.init = function(node) {
		node.intro_scene = u.createPIXIApp({"classname":"intro_scene", "height":900, "webgl":true});
		node.intro_scene.node = node;
		node.appendChild(node.intro_scene.renderer.view);
		node.intro_scene.loadQueue = [
			"prize_appletv.png",
			"prize_bg.png",
			"prize_dropshadow.png",
			"prize_gavekort.png",
			"prize_gavekort_shadow.png",
			"prize_glow.png",
			"prize_header.png",
			"prize_header_dropshadow.png",
			"prize_header_glow.png",
			"prize_island.png",
			"prize_mac.png",
			"prize_mac_dropshadow.png",
			"prize_nespresso.png",
			"prize_sand_toplayer.png",
			"prize_tablet.png",
			"prize_tv.png",
			"prize_tile.jpg",
		];
		node.intro_scene.ready = function() {
			this.prizeObjIn = function(prizeObj){
				prizeObj.x = prizeObj.xPos;
				Tween.to(prizeObj.scale,.8,{x:1,y:1, ease:Quad.easeOut});
				Tween.fromTo(prizeObj,0.3,{y:prizeObj.yPos-20},{y:prizeObj.yPos-180, ease:Quad.easeOut});
				Tween.to(prizeObj,.3,{delay:0.3, y:prizeObj.yPos, ease:Quad.easeIn});
				if(prizeObj.shadow){
					Tween.to(prizeObj.shadow,0.2,{delay:0.6, alpha:1});
				}
			}
			this.headerIn = function(){
				Tween.to(this.introHeader.scale,0.5,{x:1, y:1, ease:Elastic.easeOut.config(.3)});
			}
			this.headerOut = function(){
				Tween.to(this.introHeader.scale,0.5,{x:0, y:0, ease:Elastic.easeIn.config(.15)});
			}
			this.tvIn = function(){
				this.assets.prize_tv.scale.x = 0.3;
				Tween.to(this.assets.prize_tv.scale,0.5,{x:1, ease:Quad.easeOut});
			}
			this.onIntroIn = function(){
				this.isHovering = true;
				this.introHover();
			}
			this.introHover = function(){
				if(this.isHovering){
					this.hoverDiff*=-1;
					var tSpeed = 3;
					Tween.to(this.introContainer,tSpeed,{y:this.startY + this.hoverDiff, ease:Quad.easeInOut});
					Tween.delayedCall(tSpeed, this.introHover.bind(this));
				}
			}
			this.introIn = function(){
				var tSpeed = 3;
				Tween.to(this.introContainer,tSpeed, {y:this.startY, ease:Elastic.easeOut.config(0.15)});
			}
			this.introOut = function(){
				this.isHovering = false;
				var tSpeed = 0.5;
				Tween.to(this.introContainer,tSpeed, {y:this.introContainer.height*-1, ease:Quad.easeIn, 
					onComplete:this._destroy.bind(this)
				});
			}
			this.powerUp = function(){
				this.makeSplashBlast();
				TweenLite.to(this.vedPowered, 1.3, {
					alpha: 1,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 20,
						points: 35,
						randomize: true,
						clamp: true,
						taper: "out"
					}),
				});
			}
			this.changeDisplacementPosition = function () {
				this.displacementSprite.y -= 1.4;
				Tween.delayedCall(0.04, this.changeDisplacementPosition.bind(this));
			}
			this.stageHeightDiff = 200;
			this.introContainer = new PIXI.Container();
			this.stage.addChild(this.introContainer);
			this.startY = this.stageHeightDiff;
			this.introContainer.y = -400;
			this.introHeader = new PIXI.Container();
			this.introHeader.addChild(this.assets.prize_header_dropshadow);
			this.introHeader.addChild(this.assets.prize_header_glow);
			this.introHeader.addChild(this.assets.prize_header);
			this.stage.addChild(this.introHeader);
			this.introHeader.pivot.set(this.assets.prize_header.width/2,this.assets.prize_header.height/2);
			this.introHeader.y = (this.assets.prize_header.height/2) + this.stageHeightDiff;
			this.introHeader.x = this.assets.prize_header.width/2;
			this.introHeader.scale.x = this.introHeader.scale.y = 0;
			this.introContainer.addChild(this.assets.prize_dropshadow);
			this.introContainer.addChild(this.assets.prize_glow);
			this.introContainer.addChild(this.assets.prize_bg);
			this.introContainer.addChild(this.assets.prize_tv);
			this.assets.prize_tv.x = 363;
			this.assets.prize_tv.y = 250;
			this.assets.prize_tv.scale.x = 0;
			this.introContainer.addChild(this.assets.prize_tablet);
			this.assets.prize_tablet.anchor.set(0.5);
			this.assets.prize_tablet.xPos = 363 + (this.assets.prize_tablet.width/2);
			this.assets.prize_tablet.yPos = 250 + (this.assets.prize_tablet.height/2);
			this.assets.prize_tablet.scale.x = this.assets.prize_tablet.scale.y = 0;
			this.introContainer.addChild(this.assets.prize_island);
			this.introContainer.addChild(this.assets.prize_nespresso);
			this.assets.prize_nespresso.anchor.set(0.5);
			this.assets.prize_nespresso.xPos = 590 + (this.assets.prize_nespresso.width/2);
			this.assets.prize_nespresso.yPos = 325 + (this.assets.prize_nespresso.height/2);
			this.assets.prize_nespresso.scale.x = this.assets.prize_nespresso.scale.y = 0;
			this.introContainer.addChild(this.assets.prize_mac_dropshadow);
			this.assets.prize_mac_dropshadow.anchor.set(0.5);
			this.assets.prize_mac_dropshadow.x = 500 + (this.assets.prize_mac_dropshadow.width/2);
			this.assets.prize_mac_dropshadow.y = 316 + (this.assets.prize_mac_dropshadow.height/2);
			this.assets.prize_mac_dropshadow.alpha = 0;
			this.introContainer.addChild(this.assets.prize_mac);
			this.assets.prize_mac.anchor.set(0.5);
			this.assets.prize_mac.xPos = 500 + (this.assets.prize_mac.width/2);
			this.assets.prize_mac.yPos = 316 + (this.assets.prize_mac.height/2);
			this.assets.prize_mac.scale.x = this.assets.prize_mac.scale.y = 0;
			this.assets.prize_mac.shadow = this.assets.prize_mac_dropshadow;
			this.introContainer.addChild(this.assets.prize_gavekort_shadow);
			this.assets.prize_gavekort_shadow.anchor.set(0.5);
			this.assets.prize_gavekort_shadow.x = 590 + (this.assets.prize_gavekort_shadow.width/2);
			this.assets.prize_gavekort_shadow.y = 283 + (this.assets.prize_gavekort_shadow.height/2);
			this.assets.prize_gavekort_shadow.alpha = 0;
			this.introContainer.addChild(this.assets.prize_gavekort);
			this.assets.prize_gavekort.anchor.set(0.5);
			this.assets.prize_gavekort.xPos = 590 + (this.assets.prize_gavekort.width/2);
			this.assets.prize_gavekort.yPos = 290 + (this.assets.prize_gavekort.height/2);
			this.assets.prize_gavekort.scale.x = this.assets.prize_gavekort.scale.y = 0;
			this.assets.prize_gavekort.shadow = this.assets.prize_gavekort_shadow;
			this.introContainer.addChild(this.assets.prize_appletv);
			this.assets.prize_appletv.anchor.set(0.5);
			this.assets.prize_appletv.xPos = 348 + (this.assets.prize_appletv.width/2);
			this.assets.prize_appletv.yPos = 435 + (this.assets.prize_appletv.height/2);
			this.assets.prize_appletv.scale.x = this.assets.prize_appletv.scale.y = 0;
			this.introContainer.addChild(this.assets.prize_sand_toplayer);
			this.displacementSprite = this.assets.prize_tile;
			this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
			this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
			this.displacementFilter.scale.x = this.displacementFilter.scale.y = 6;
			this.assets.prize_glow.filters = [this.displacementFilter];
			this.assets.prize_header_glow.filters = [this.displacementFilter];
			this.introContainer.addChild(this.displacementSprite);
			this.changeDisplacementPosition();
			this.hoverDiff = 5;
			this.introContainer.x = (this.renderer.width/2) - (this.introContainer.width/2);
			this.startX = this.introContainer.x;
			this.is_ready = true;
			page.cN.scene.build();
		}
		node.intro_scene.build = function() {
			Tween.delayedCall(0,this.introIn.bind(this));
			Tween.delayedCall(1,this.headerIn.bind(this));
			Tween.delayedCall(0.6,this.prizeObjIn.bind(this),[this.assets.prize_appletv]);
			Tween.delayedCall(.7,this.prizeObjIn.bind(this),[this.assets.prize_tablet]);
			Tween.delayedCall(1.3,this.tvIn.bind(this));
			Tween.delayedCall(.8,this.prizeObjIn.bind(this),[this.assets.prize_mac]);
			Tween.delayedCall(.9,this.prizeObjIn.bind(this),[this.assets.prize_gavekort]);
			Tween.delayedCall(1,this.prizeObjIn.bind(this),[this.assets.prize_nespresso]);
			Tween.delayedCall(4,this.introOut.bind(this));
			Tween.delayedCall(3.7,this.headerOut.bind(this));
		}
		node.intro_scene._destroy = function() {
			this.destroy(true);
			delete this.node.intro_scene
			page.cN.scene.destroy();
		}
		u.loadAssets(node.intro_scene);
	}
	this.build = function(node) {
		node.intro_scene.build();
	}
}


/*i-startscene.js*/
Util.Objects["StartScene"] = new function() {
	this.init = function(node) {
		node.start_scene = u.createPIXIApp({"classname":"start_scene", "height":900, "webgl":true});
		node.start_scene.node = node;
		node.appendChild(node.start_scene.renderer.view);
		node.start_scene.loadQueue = [
			"ved_dropshadow.png",
			"ved_glow.png",
			"ved_powered.png",
			"ved_unpowered.png",
			"ved_tile.jpg",
			"startbtn.png",
			"startbtn_rollover.png",
			"startbtn_hitarea.png",
			"startbtn_glow.png",
			"ved_spark.png"
		];
		node.start_scene.ready = function() {
			this.stageHeightDiff = 200;
			this.addBtn = function(){
				this.startBtnContainer = new PIXI.Container();
				this.stage.addChild(this.startBtnContainer);
				this.startBtnContainer.pivot.set(this.assets.startbtn.width/2,this.assets.startbtn.height/2);
				this.startBtnContainer.x = this.renderer.width/2;
				this.startBtnContainer.y = 500 + this.stageHeightDiff;
				this.stage.addChild(this.startBtnContainer);
				this.startBtnContainer.addChild(this.assets.startbtn_glow);
				this.startBtnContainer.addChild(this.assets.startbtn);
				this.startBtnContainer.addChild(this.assets.startbtn_rollover);
				this.assets.startbtn_rollover.alpha = 0;
				this.startBtnContainer.addChild(this.assets.startbtn_hitarea);
				this.assets.startbtn_hitarea.x = 59;
				this.assets.startbtn_hitarea.y = 46;
				this.assets.startbtn_hitarea.alpha = 0.001;
				this.startBtnContainer.scale.x = this.startBtnContainer.scale.y = 0;  
				this.btnHoverDiff = 1;
				this.btnStartY = this.startBtnContainer.y;
				this.assets.startbtn_glow.filters = [this.displacementFilter];
				this.startBtnIn();
				Tween.delayedCall(1.2,this.startBtnHover.bind(this));
			}
			this.startBtnHover = function(){
				this.btnHoverDiff*=-1;
				var tSpeed = 2;
				Tween.to(this.startBtnContainer,tSpeed,{y:this.btnStartY + this.btnHoverDiff, ease:Quad.easeInOut});
				Tween.delayedCall(tSpeed, this.startBtnHover.bind(this));
			}
			this.startBtnIn = function(){
				var tSpeed = .8;
				Tween.to(this.startBtnContainer.scale,tSpeed,{x:1,y:1, ease:Elastic.easeOut.config(0.2)});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.startBtnOut = function(){
				page.playEventSound();
				this.vedOut();
				var tSpeed = .2;
				this.assets.startbtn_rollover.alpha = 0;
				Tween.to(this.assets.startbtn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
				Tween.to(this.startBtnContainer.scale,tSpeed,{x:0,y:0, ease:Quad.easeIn});
				this.assets.startbtn_hitarea.interactive = false;
			}
			this.onStartBtnOut = function(){
				this._destroy();
			}
			this.changeDisplacementPositionBtn = function () {
				this.displacementSpriteBtn.y -= 1;
				Tween.delayedCall(0.04, this.changeDisplacementPositionBtn.bind(this));
			}
			this.setupInteractionEvents = function(){
				this.assets.startbtn_hitarea.interactive = true;
				this.assets.startbtn_hitarea.buttonMode = true;
				this.assets.startbtn_hitarea.on('click', this.startBtnOut.bind(this));
				this.assets.startbtn_hitarea.on('mouseover', this.onMouseOver.bind(this));
				this.assets.startbtn_hitarea.on('mouseout', this.onMouseOut.bind(this));
			}
			this.onMouseOver = function(){
				if(!this.startBtnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.startbtn_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
				}
			}
			this.onMouseOut = function(){
				if(!this.startBtnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.startbtn_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
				}
			}
			this.setstartBtnToActive = function(){
				var tSpeed = 0.3;
				if(!this.startBtnBtnIsActive){
					this.startBtnBtnIsActive = true;
					Tween.to(this.assets.startBtn_btn_active,tSpeed*.2,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.startBtn_btn_glow,tSpeed,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.startBtn,tSpeed,{y:-18, ease:Quad.easeInOut});
				} else {
					this.startBtnBtnIsActive = false;
					Tween.to(this.assets.startBtn_btn_active,tSpeed*.2,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.startBtn_btn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.startBtn,tSpeed,{y:0, ease:Quad.easeInOut});
				}
			}
			this.vedHover = function(){
				if(this.isHovering) {
					this.hoverDiff*=-1;
					var tSpeed = 3;
					Tween.to(this.vedContainer,tSpeed,{y:this.startY + this.hoverDiff, ease:Quad.easeInOut});
					Tween.delayedCall(tSpeed, this.vedHover.bind(this));
				}
			}
			this.vedIn = function(){
				var tSpeed = 4;
				this.isHovering = true;
				Tween.to(this.vedContainer,tSpeed, {y:this.startY, ease:Elastic.easeOut.config(0.15)});
				Tween.delayedCall(tSpeed,function(){this.vedHover();}.bind(this));
			}
			this.vedOut = function(){
				this.isHovering = false;
				var tSpeed = 0.5;
				Tween.to(this.vedContainer,tSpeed, {y:this.vedContainer.height*-1, ease:Quad.easeIn, onComplete:this.onStartBtnOut.bind(this)});
			}
			this.powerUp = function(){
				this.makeSplashBlast();
				TweenLite.to(this.vedPowered, 1.3, {
					alpha: 1,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 20,
						points: 35,
						randomize: true,
						clamp: true,
						taper: "out"
					}),
				});
			}
			this.makeSplashBlast = function (){
				for(var i=0;i<this.sparks.length;i++){
					var sparkObj = this.sparks[i];
					var dNum = u.random(0,400)/600;
					this.tw_sb = Tween.delayedCall(dNum, this.doSpark.bind(this),[sparkObj]);
				}
			}
			this.doSpark = function(sparkObj){
				var diff = 1;
				if(this.vedContainer.scale.x == 1){
					diff = 1;
				} else {
					diff = 4;
				}
				sparkObj.x = this.vedContainer.x + (u.random(50,600))/diff;
				sparkObj.y = this.vedContainer.y + (u.random(100,150))/diff;
				sparkObj.ySpeed = u.random(-7,0)/1;
				sparkObj.xSpeed = u.random(-12,12)/2.5;
				sparkObj.active = true;
				var tSpeed = u.random(70,130)/100;
				sparkObj.anchorPoint = u.random(0,15)/2;
				Tween.to(sparkObj,tSpeed,{rotation:u.random(-3,3), ease:Quad.easeOut});
				Tween.to(sparkObj.anchor,tSpeed,{x:sparkObj.anchorPoint, ease:Quad.easeOut});
				sparkObj.alpha = 1;
				Tween.to(sparkObj, tSpeed, {
					alpha: 0,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 50,
						points: 50,
						randomize: true,
						clamp: true,
						taper: "out",
						onComplete:this.deActivateSparkObj.bind(this),
						onCompleteParams:[sparkObj],
					}),
				});
			}
			this.deActivateSparkObj = function(){
				sparkObj.active = false;
			}
			this.handleSparks = function(){
				for(i=0;i<this.sparks.length;i++){
					var sparkObj = this.sparks[i];
					if(sparkObj.active){
						this.sparkMove(sparkObj);
					}
				}
			}
			this.sparkMove = function(sparkObj){
				sparkObj.xSpeed*=0.99;
				sparkObj.ySpeed*=0.99;
				sparkObj.x += sparkObj.xSpeed;
				sparkObj.y += sparkObj.ySpeed + this.sparkGravity;
			}
			this.insertSparks = function(){
				this.sparkGravity = 5;
				this.sparkContainer = new PIXI.Container();
				this.stage.addChild(this.sparkContainer);
				this.sparks = [];
				var totalSparks = 5;
				for(var i = 0; i < totalSparks; i++) {
					this.drawSpark();
				}
			}
			this.drawSpark = function() {
				this.assets.ved_spark.anchor.set(0.5, 0.5);
				this.assets.ved_spark.scale.x = this.assets.ved_spark.scale.y = u.random(70,100)/100;
				this.sparkContainer.addChild(this.assets.ved_spark);
				this.sparks.push(this.assets.ved_spark);
			}
			this.doSingleSpark = function(){
				if(this.vedContainer.scale.x == 1){
					Tween.delayedCall(u.random(0,100)/10, this.doSingleSpark.bind(this));
				}
				this.vedPowered.alpha = 0.4;
				this.tw_sp = Tween.to(this.vedPowered, 0.3, {
					alpha: 1,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 50,
						points: 5,
						randomize: true,
						clamp: true,
						taper: "out",
						onComplete:this.deActivateSparkObj.bind(this),
						onCompleteParams:[sparkObj],
					}),
				});
				var rNum = u.random(1,3);
				for(var i=0;i<rNum;i++){
					var sparkObj = this.sparks[i];
					this.doSpark(sparkObj);
				}
			}
			this.changeDisplacementPosition = function () {
				this.displacementSprite.y -= 1;
				Tween.delayedCall(0.04, this.changeDisplacementPosition.bind(this));
			}
			this.insertSparks();
			this.vedContainer = new PIXI.Container();
			this.stage.addChild(this.vedContainer);
			this.startY = 120 + this.stageHeightDiff;
			this.vedContainer.y = -400;
			this.vedContainer.addChild(this.assets.ved_dropshadow);
			this.vedContainer.addChild(this.assets.ved_unpowered);
			this.vedPowered = new PIXI.Container();
			this.vedContainer.addChild(this.vedPowered);
			this.vedPowered.addChild(this.assets.ved_glow);
			this.vedPowered.addChild(this.assets.ved_powered);
			this.vedPowered.alpha = 0;
			this.displacementSprite = this.assets.ved_tile;
			this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
			this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
			this.displacementFilter.scale.x = this.displacementFilter.scale.y = 15;
			this.assets.ved_glow.filters = [this.displacementFilter];
			this.vedContainer.addChild(this.displacementSprite);
			this.changeDisplacementPosition();
			this.hoverDiff = 5;
			this.vedContainer.x = (this.renderer.width/2) - (this.vedContainer.width/2);
			this.startX = this.vedContainer.x;
			this.is_ready = true;
			page.cN.scene.build();
		}
		node.start_scene.build = function() {
			Tween.delayedCall(0,this.vedIn.bind(this));
			Tween.delayedCall(.8,this.powerUp.bind(this));
			Tween.delayedCall(2.5,this.doSingleSpark.bind(this));
			Tween.delayedCall(1.8,this.addBtn.bind(this));
			page.showJan("start");
		}
		node.start_scene._destroy = function() {
			page.hideJan(true);
			this.destroy(true);
			delete this.node.start_scene
			page.cN.scene.destroy();
		}
		u.loadAssets(node.start_scene);
	}
	this.build = function(node) {
		node.start_scene.build();
	}
}


/*i-gamescreen.js*/
Util.Objects["GameScreen"] = new function() {
	this.init = function(node) {
		node.game_screen = u.createPIXIApp({"classname":"game_screen", "height":900});
		node.game_screen.node = node;
		node.appendChild(node.game_screen.renderer.view);
		node.game_screen.loadQueue = [
			"screen.png",
			"screen_glow.png",
			"screen_tile.jpg",
		];
		node.game_screen.ready = function() {
			this.stageHeightDiff = 200;
			this.setHeader = function(round) {
				if(this.header_asset) {
					this.screenContainer.removeChild(this.header_asset);
					delete this.header_asset;
				}
				if(round !== false) {
					var texture = PIXI.Texture.fromImage('/img/assets/desktop/' + round + '.png');
					this.header_asset = new PIXI.Sprite(texture);
					this.screenContainer.addChild(this.header_asset);
					this.header_asset.x = (this.renderer.width/2)-(210/2);
					this.header_asset.y = 100;
				}
			}
			this.screenContainer = new PIXI.Container();
			this.stage.addChild(this.screenContainer);
			this.screenContainer.x = (this.renderer.width/2)-(this.assets.screen.width/2);
			this.screenContainer.y = this.assets.screen.height*-1;
			this.screenContainer.addChild(this.assets.screen_glow);
			this.assets.screen_glow.alpha = 0.2;
			this.screenContainer.addChild(this.assets.screen);
			this.startY = this.stageHeightDiff;
			this.is_ready = true;
			page.cN.scene.build();
		}
		node.game_screen.build = function() {
			var tSpeed = 3;
			Tween.to(this.screenContainer,tSpeed,{y:this.startY, ease:Elastic.easeOut.config(0.2)});
			this.is_built = true;
		}
		node.game_screen._destroy = function() {
			this.destroy(true);
			delete this.node.game_screen
			// 
		}
		u.loadAssets(node.game_screen);
	}
	this.build = function(node) {
		node.game_screen.build();
	}
}


/*i-gamealreadyplayed.js*/
Util.Objects["GameAlreadyPlayed"] = new function() {
	this.init = function(node) {
		node.game_already_played = u.createPIXIApp({"classname":"game_already_played", "height":900});
		node.game_already_played.node = node;
		node.appendChild(node.game_already_played.renderer.view);
		node.game_already_played.loadQueue = [
			"btn_hitarea.png",
			"txt_already_played.png",
			"btn_se_naeste_uges_praemie.png",
			"btn_se_naeste_uges_praemie_rollover.png",
		];
		node.game_already_played.ready = function() {
			this.addBtn = function(){
				this.btnContainer = new PIXI.Container();
				this.screenContainer.addChild(this.btnContainer);
				this.btnContainer.pivot.set(this.assets.btn_se_naeste_uges_praemie.width/2,(this.assets.btn_se_naeste_uges_praemie.height/2)-16);
				this.btnContainer.x = this.renderer.width/2;
				this.btnContainer.y = 230 + this.stageHeightDiff;
				this.screenContainer.addChild(this.btnContainer);
				this.btnContainer.addChild(this.assets.btn_se_naeste_uges_praemie);
				this.btnContainer.addChild(this.assets.btn_se_naeste_uges_praemie_rollover);
				this.assets.btn_se_naeste_uges_praemie_rollover.alpha = 0;
				this.btnContainer.addChild(this.assets.btn_hitarea);
				this.assets.btn_hitarea.x = 35;
				this.assets.btn_hitarea.y = 30;
				this.assets.btn_hitarea.alpha = 0.001;
				this.btnContainer.alpha = 0;
			}
			this.btnIn = function(){
				var tSpeed = .3;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){
				page.playEventSound();
				page.openPrizes(this.node.scene.current_round_index+1);
			}
			this.onBtnOut = function(){
			}
			this.setupInteractionEvents = function(){
				this.assets.btn_hitarea.interactive = true;
				this.assets.btn_hitarea.buttonMode = true;
				this.assets.btn_hitarea.on('click', this.btnOut.bind(this));
				this.assets.btn_hitarea.on('mouseover', this.onMouseOver.bind(this));
				this.assets.btn_hitarea.on('mouseout', this.onMouseOut.bind(this));
			}
			this.onMouseOver = function(){
				var tSpeed = 0.15;
				Tween.to(this.assets.btn_se_naeste_uges_praemie_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
			}
			this.onMouseOut = function(){
				var tSpeed = 0.15;
				Tween.to(this.assets.btn_se_naeste_uges_praemie_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
			}
			this.screenEnterFromTop = function(){
				var tSpeed = 3;
				Tween.to(this.screenContainer,tSpeed,{y:this.startY, ease:Elastic.easeOut.config(0.2)});
				Tween.fromTo(this.assets.txt_already_played,0.5,{alpha:0},{delay:1.2, alpha:1});
				Tween.delayedCall(1.4,this.btnIn.bind(this))
			}
			this.stageHeightDiff = 200;
			this.screenContainer = new PIXI.Container();
			this.stage.addChild(this.screenContainer);
			this.startY = this.stageHeightDiff;
			this.screenContainer.x = (this.renderer.width/2)-(1024/2);
			this.screenContainer.y = -600;
			this.assets.txt_already_played.alpha = 0;
			this.screenContainer.addChild(this.assets.txt_already_played);
			this.assets.txt_already_played.x = (this.renderer.width/2)-(this.assets.txt_already_played.width/2);
			this.assets.txt_already_played.y = 220;
			this.addBtn();
			this.is_ready = true;
			page.cN.scene.build();
		}
		node.game_already_played.build = function() {
			page.showJan("already_played");
			this.screenEnterFromTop();
		}
		node.game_already_played._destroy = function() {
			page.hideJan(true);
			this.destroy(true);
			this.node.game_already_played = false;
		}
		u.loadAssets(node.game_already_played);
	}
	// 
	this.build = function(node) {
		u.bug("GameAlreadyPlayed.build");
		node.game_already_played.build();
	}
}


/*i-gameselector.js*/
Util.Objects["GameSelector"] = new function() {
	this.init = function(node, state) {
		node.game_selector = u.createPIXIApp({"classname":"game_selector", "height":900});
		node.game_selector.node = node;
		node.game_selector.state = state;
		node.appendChild(node.game_selector.renderer.view);
		node.game_selector.loadQueue = [
			"round_header.png",
			"round_back0.png",
			"round_back1.png",
			"round_back2.png",
			"round_back3.png",
			"round_back4.png",
			"round_back5.png",
			"round_btn.png",
			"round_btn_rollover.png",
			"round_hitarea.png",
			"round_week0.png",
			"round_week1.png",
			"round_week2.png",
			"round_week3.png",
			"round_week4.png",
			"round_week5.png",
		];
		node.game_selector.ready = function() {
			this.createBtn = function(round){
				var roundBtnContainer = new PIXI.Container();
				roundBtnContainer.app = this;
				roundBtnContainer.round_index = round;
				this.screenContainer.addChild(roundBtnContainer);
				this.setupBtn(roundBtnContainer,round);
				return roundBtnContainer;
			}
			this.setupBtn = function(roundBtnContainer,round){
				var texture, asset;
				roundBtnContainer.roundBack  = new PIXI.Container();
				roundBtnContainer.addChild(roundBtnContainer.roundBack)
				texture = PIXI.Texture.fromImage('/img/assets/desktop/round_back' + round +'.png');
				asset = new PIXI.Sprite(texture);
				roundBtnContainer.roundBack.addChild(asset);
				roundBtnContainer.roundBtn  = new PIXI.Container();
				roundBtnContainer.addChild(roundBtnContainer.roundBtn)
				texture = PIXI.Texture.fromImage('/img/assets/desktop/round_btn.png');
				asset = new PIXI.Sprite(texture);
				roundBtnContainer.roundBtn.addChild(asset);
				roundBtnContainer.rollover = new PIXI.Container();
				roundBtnContainer.addChild(roundBtnContainer.rollover)
				texture = PIXI.Texture.fromImage('/img/assets/desktop/round_btn_rollover.png');
				asset = new PIXI.Sprite(texture);
				roundBtnContainer.rollover.addChild(asset);
				roundBtnContainer.rollover.alpha = 0;
				roundBtnContainer.hitarea = new PIXI.Container();
				roundBtnContainer.addChild(roundBtnContainer.hitarea)
				texture = PIXI.Texture.fromImage('/img/assets/desktop/round_hitarea.png');
				asset = new PIXI.Sprite(texture);
				roundBtnContainer.hitarea.addChild(asset);
				roundBtnContainer.hitarea.x = 33;
				roundBtnContainer.hitarea.y = 21;
				roundBtnContainer.hitarea.alpha = 0.001;
				roundBtnContainer.roundBtn_week = new PIXI.Container();
				roundBtnContainer.addChild(roundBtnContainer.roundBtn_week)
				texture = PIXI.Texture.fromImage('/img/assets/desktop/round_week'+ round + '.png');
				asset = new PIXI.Sprite(texture);
				roundBtnContainer.roundBtn_week.addChild(asset);
				roundBtnContainer.hitarea.interactive = true
				roundBtnContainer.hitarea.buttonMode = true;
				roundBtnContainer.hitarea.on('mouseover', this.onMouseOver.bind(roundBtnContainer));
				roundBtnContainer.hitarea.on('mouseout', this.onMouseOut.bind(roundBtnContainer));
				roundBtnContainer.hitarea.on('click', this._onBrickSelected.bind(roundBtnContainer));
			}
			this.onMouseOver = function(){
				var tSpeed = 0.15;
				Tween.to(this.rollover ,tSpeed,{alpha:1, ease:Quad.easeInOut});
			}
			this.onMouseOut = function(){
				var tSpeed = 0.15;
				Tween.to(this.rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
			}
			this.selectorEnterFromTop = function(){
				var tSpeed = 3;
				Tween.to(this.screenContainer,tSpeed,{y:this.startY, ease:Elastic.easeOut.config(0.2)});
			}
			this._onBrickSelected = function(){
				page.playEventSound();
				this.app.node.scene.current_round_index = this.round_index;
				Tween.to(this.app.assets.round_header,0.2,{delay:0.3,alpha:0});
				for(var i=1;i<=6;i++){
					var btnObj = this.app["btn" + i];
					btnObj.hitarea.interactive = false;
					btnObj.hitarea.buttonMode = false;
					if(i!=this.round_index){
						Tween.to(btnObj,0.1,{delay:u.random(0,10)/100,alpha:0});
					} else {
						Tween.to(btnObj,0.2,{delay:.3,alpha:0});
					}
				}
				Tween.delayedCall(.5, this.app.onRoundBtnsOut.bind(this.app));
			}
			this.onRoundBtnsOut = function(){
				this._destroy();
			}
			this.showBtns = function(){
				Tween.fromTo(this.assets.round_header,0.2,{alpha:0},{delay:0,alpha:1});
				this.screenContainer.y = this.startY;
				for(var i=1;i<=6;i++){
					var btnObj = this["btn" + i];
					btnObj.alpha = 0;
					TweenLite.to(btnObj, .3, {
						delay:u.round(0,20)/100,
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
			this.stageHeightDiff = 200;
			this.startY = this.stageHeightDiff;
			this.screenContainer = new PIXI.Container();
			this.stage.addChild(this.screenContainer);
			this.screenContainer.x = (this.renderer.width/2)-(1024/2);
			this.screenContainer.y = -600;
			var btnStackX = 192;
			var btnStackY = 186;
			var btnMargin = 15;
			var btnWidth = 184;
			var btnHeight = 175;
			this.btn4 = this.createBtn(3);
			this.btn4.x = btnStackX + (btnWidth*0);
			this.btn4.y = btnStackY + (btnHeight*1);
			this.btn5 = this.createBtn(4);
			this.btn5.x = btnStackX +  btnMargin + (btnWidth*1);
			this.btn5.y = btnStackY + (btnHeight*1);
			this.btn6 = this.createBtn(5);
			this.btn6.x = btnStackX +  (btnMargin*2) + (btnWidth*2);
			this.btn6.y = btnStackY + (btnHeight*1);
			this.btn1 = this.createBtn(0);
			this.btn1.x = btnStackX + (btnWidth*0);
			this.btn1.y = btnStackY + (btnHeight*0);
			this.btn2 = this.createBtn(1);
			this.btn2.x = btnStackX +  btnMargin + (btnWidth*1);
			this.btn2.y = btnStackY + (btnHeight*0);
			this.btn3 = this.createBtn(2);
			this.btn3.x = btnStackX +  (btnMargin*2) + (btnWidth*2);
			this.btn3.y = btnStackY + (btnHeight*0);
			this.node.game_screen.setHeader("round_header");
			this.is_ready = true;
			page.cN.scene.build();
		}
		node.game_selector.build = function() {
			if(this.state == "first") {
				this.selectorEnterFromTop();
			}
			else {
				this.showBtns();
			}
		}
		node.game_selector._destroy = function() {
			this.destroy(true);
			this.node.game_selector = false;
			u.o.GameBricks.init(this.node);
		}
		u.loadAssets(node.game_selector);
	}
	this.build = function(node) {
		node.game_selector.build();
	}
}


/*i-gamebricks.js*/
Util.Objects["GameBricks"] = new function() {
	this.init = function(node, state) {
		node.game_bricks = u.createPIXIApp({"classname":"game_bricks", "height":900});
		node.game_bricks.node = node;
		node.game_bricks.state = state;
		node.appendChild(node.game_bricks.renderer.view);
		node.scene.current_category_index = false;
		node.scene.current_question_index = false;
		node.game_bricks.loadQueue = [
			"screen.png",
			"categories_header_"+node.scene.current_round_index+"_1.png",
			"categories_header_"+node.scene.current_round_index+"_2.png",
			"categories_header_"+node.scene.current_round_index+"_3.png",
			"categories_brick.png",
			"categories_brick_back_0_0.png",
			"categories_brick_back_0_1.png",
			"categories_brick_back_0_2.png",
			"categories_brick_back_1_0.png",
			"categories_brick_back_1_1.png",
			"categories_brick_back_1_2.png",
			"categories_brick_back_2_0.png",
			"categories_brick_back_2_1.png",
			"categories_brick_back_2_2.png",
			"categories_brick_rollover.png",
			"categories_brick_hitarea.png"
		];
		node.game_bricks.ready = function() {
			this.assets.categories_header_1 = this.assets["categories_header_"+ this.node.scene.current_round_index + "_1"];
			this.assets.categories_header_2 = this.assets["categories_header_"+ this.node.scene.current_round_index + "_2"];
			this.assets.categories_header_3 = this.assets["categories_header_"+ this.node.scene.current_round_index + "_3"];
			this.createBrick = function(category, question) {
				var brickStackY = 254;
				var brickMargin = 9;
				var brickWidth = 204;
				var brickHeight = 89;
				var brickContainer = new PIXI.Container();
				brickContainer.category_index = category;
				brickContainer.question_index = question;
				brickContainer.question = this.node.scene.quiz.rounds[this.node.scene.current_round_index].categories[brickContainer.category_index].questions[brickContainer.question_index];
				brickContainer.app = this;
				this.screenContainer.addChild(brickContainer);
				if(typeof(this.node.scene.quiz_answers["r"+this.node.scene.current_round_index+"c"+category+"q"+question]) !== "undefined"){
					this.setupInactiveBrick(brickContainer);
				}
				else {
					this.setupActiveBrick(brickContainer);
				}
				brickContainer.x = 134 + (brickWidth*category) + brickMargin;
				brickContainer.y = brickStackY + (brickHeight*question);
				return brickContainer;
			}
			this.setupActiveBrick = function(brickContainer){
				var texture, asset;
				brickContainer.brick  = new PIXI.Container();
				brickContainer.addChild(brickContainer.brick);
				texture = PIXI.Texture.fromImage('/img/assets/desktop/categories_brick.png');
				asset = new PIXI.Sprite(texture);
				brickContainer.brick.addChild(asset);
				brickContainer.brick_rollover = new PIXI.Container();
				brickContainer.addChild(brickContainer.brick_rollover);
				texture = PIXI.Texture.fromImage('/img/assets/desktop/categories_brick_rollover.png');
				asset = new PIXI.Sprite(texture);
				brickContainer.brick_rollover.addChild(asset);
				brickContainer.brick_rollover.alpha = 0;
				brickContainer.brickBrick = new PIXI.Container();
				brickContainer.addChild(brickContainer.brickBrick);
				texture = PIXI.Texture.fromImage('/img/assets/desktop/categories_brick_'+brickContainer.question.stake+'.png');
				asset = new PIXI.Sprite(texture);
				brickContainer.brickBrick.addChild(asset);
				brickContainer.brick_hitarea = new PIXI.Container();
				brickContainer.addChild(brickContainer.brick_hitarea);
				texture = PIXI.Texture.fromImage('/img/assets/desktop/categories_brick_hitarea.png');
				asset = new PIXI.Sprite(texture);
				brickContainer.brick_hitarea.addChild(asset);
				brickContainer.brick_hitarea.x = 71;
				brickContainer.brick_hitarea.y = 31;
				brickContainer.brick_hitarea.alpha = 0.001;
				brickContainer.brick_hitarea.interactive = false;
				brickContainer.brick_hitarea.buttonMode = false;
				brickContainer.brick_hitarea.on('mouseover', this.onMouseOver.bind(brickContainer));
				brickContainer.brick_hitarea.on('mouseout', this.onMouseOut.bind(brickContainer));
				brickContainer.brick_hitarea.on('click', this._onBrickSelected.bind(brickContainer));
			}
			this.setupInactiveBrick = function(brickContainer) {
				var brickBack = new PIXI.Container();
				brickContainer.addChild(brickBack)
				var texture = PIXI.Texture.fromImage('/img/assets/desktop/categories_brick_back_' + brickContainer.category_index +'_'+ brickContainer.question_index + '.png');
				var asset = new PIXI.Sprite(texture);
				brickBack.addChild(asset);
			}
			this.onMouseOver = function(){
		        if(!this.startBtnBtnIsActive){
		            var tSpeed = 0.15;
		            Tween.to(this.brick_rollover ,tSpeed,{alpha:1, ease:Quad.easeInOut});
		        }
		    }
			this.onMouseOut = function(){
		        if(!this.startBtnBtnIsActive){
		            var tSpeed = 0.15;
		            Tween.to(this.brick_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
		        }
		    }
			this.showBricksAndObjects = function(){
				this.screenContainer.y = this.startY;
				for(var i=1;i<=9;i++){
					var brickObj = this["brick" + i];
					brickObj.alpha = 0;
					TweenLite.to(brickObj, .3, {
						delay:u.random(0,20)/100,
						alpha: 1,
						ease: RoughEase.ease.config({
							template: Power0.easeNone,
							strength: 5,
							points: 5,
							randomize: true,
							clamp: true,
							taper: "out"
						}),
					});
				}
				TweenLite.fromTo(this.assets.categories_header_1, .3, {alpha:0},{
					delay:u.random(0,20)/100,
					alpha: 1,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 20,
						points: 5,
						randomize: true,
						clamp: true,
						taper: "out"
					}),
				});
				TweenLite.fromTo(this.assets.categories_header_2, .3, {alpha:0},{
					delay:u.random(0,20)/100,
					alpha: 1,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 20,
						points: 5,
						randomize: true,
						clamp: true,
						taper: "out"
					}),
				});
				TweenLite.fromTo(this.assets.categories_header_3, .3, {alpha:0},{
					delay:u.random(0,20)/100,
					alpha: 1,
					ease: RoughEase.ease.config({
						template: Power0.easeNone,
						strength: 20,
						points: 5,
						randomize: true,
						clamp: true,
						taper: "out"
					}),
				});
				Tween.delayedCall(0.3, this.onScreenContainerIn.bind(this));
			}
			this.brickContainerEnterFromTop = function(){
				var tSpeed = 3;
				Tween.to(this.screenContainer,tSpeed,{y:this.startY, ease:Elastic.easeOut.config(0.2)});
				Tween.delayedCall(2,this.onScreenContainerIn.bind(this));
			}
			this.onScreenContainerIn = function(){
				for(var i=1;i<=9;i++){
					var brickObj = this["brick" + i];
					if(brickObj.brick_hitarea) {
						brickObj.brick_hitarea.interactive = true;
						brickObj.brick_hitarea.buttonMode = true;
					}
				}
			}
			this.brickContainerOut = function(){
				var tSpeed = 0.5;
				Tween.to(this.screenContainer,tSpeed, {y:-600, ease:Quad.easeIn});
			}
			this._onBrickSelected = function(){
				page.playEventSound();
				this.app.node.scene.current_category_index = this.category_index;
				this.app.node.scene.current_question_index = this.question_index;
				for(var i=1;i<=9;i++){
					var brickObj = this.app["brick" + i];
					if(brickObj.brick_hitarea) {
						brickObj.brick_hitarea.interactive = false;
						brickObj.brick_hitarea.buttonMode = false;
					}
					Tween.to(brickObj,0.2,{delay:u.random(0,20)/100,alpha:0});
				}
				Tween.to(this.app.assets.categories_header_1,0.2,{delay:u.random(0,20)/100,alpha:0});
				Tween.to(this.app.assets.categories_header_2,0.2,{delay:u.random(0,20)/100,alpha:0});
				Tween.to(this.app.assets.categories_header_3,0.2,{delay:u.random(0,20)/100,alpha:0});
				Tween.delayedCall(0.5, this.app.onBrickScreenOut.bind(this.app));
			}
			this.onBrickScreenOut = function(){
				this._destroy();
			}
			this.stageHeightDiff = 200;
			this.startY = this.stageHeightDiff;
			this.screenContainer = new PIXI.Container();
			this.stage.addChild(this.screenContainer);
			this.screenContainer.x = (this.renderer.width/2)-(this.assets.screen.width/2);
			this.screenContainer.y = -600;
			var headerXPos = 197;
			var headerYPos = 184;
			var headerWidth = 204;
			this.screenContainer.addChild(this.assets.categories_header_1);
			this.assets.categories_header_1.x = headerXPos;
			this.assets.categories_header_1.y = headerYPos;
			this.screenContainer.addChild(this.assets.categories_header_2);
			this.assets.categories_header_2.x = headerXPos + headerWidth;
			this.assets.categories_header_2.y = headerYPos;
			this.screenContainer.addChild(this.assets.categories_header_3);
			this.assets.categories_header_3.x = headerXPos + (headerWidth*2)
			this.assets.categories_header_3.y = headerYPos;
			this.brick7 = this.createBrick(0, 2);
			this.brick8 = this.createBrick(1, 2);
			this.brick9 = this.createBrick(2, 2);
			this.brick4 = this.createBrick(0, 1);
			this.brick5 = this.createBrick(1, 1);
			this.brick6 = this.createBrick(2, 1);
			this.brick3 = this.createBrick(0, 0);
			this.brick2 = this.createBrick(1, 0);
			this.brick1 = this.createBrick(2, 0);
			this.node.game_screen.setHeader("round_header_"+this.node.scene.current_round_index);
			this.is_ready = true;
			page.cN.scene.build();
		}
		node.game_bricks.build = function() {
			if(this.state == "first") {
				this.brickContainerEnterFromTop();
			}
			else {
				this.showBricksAndObjects();
			}
			page.showJan("game");
		}
		node.game_bricks._destroy = function() {
			page.hideJan(true);
			this.destroy(true);
			this.node.game_bricks = false;
			u.o.GameQuestion.init(this.node);
		}
		u.loadAssets(node.game_bricks);
	}
	this.build = function(node) {
		node.game_bricks.build();
	}
}


/*i-gamequestion.js*/
Util.Objects["GameQuestion"] = new function() {
	this.init = function(node) {
		node.game_question = u.createPIXIApp({"classname":"game_question", "height":600});
		node.game_question.node = node;
		node.appendChild(node.game_question.renderer.view);
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
		node.game_question.ready = function() {
			this.torkild = false;
			if(this.node.scene.current_round_index !== false && this.node.scene.current_category_index !== false && this.node.scene.current_question_index !== false) {
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
					answerBtnContainer.answerBtn_rollover = new PIXI.Container();
					answerBtnContainer.addChild(answerBtnContainer.answerBtn_rollover)
					texture = PIXI.Texture.fromImage('/img/assets/desktop/answer_rollover_'+ answerBtnNum + '.png');
					asset = new PIXI.Sprite(texture);
					answerBtnContainer.answerBtn_rollover.addChild(asset);
					answerBtnContainer.answerBtn_rollover.alpha = 0;
					answerBtnContainer.hitarea = new PIXI.Container();
					answerBtnContainer.addChild(answerBtnContainer.hitarea)
					texture = PIXI.Texture.fromImage('/img/assets/desktop/answer_hitarea.png');
					asset = new PIXI.Sprite(texture);
					answerBtnContainer.hitarea.addChild(asset);
					answerBtnContainer.hitarea.x = 24;
					answerBtnContainer.hitarea.y = 24;
					answerBtnContainer.hitarea.alpha = 0.001;
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
				this.stageHeightDiff = 0; 
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
				u.o.torkild.init(this.node);
				this.node.div_question = u.ae(this.node, "div", {"class":"question"});
				this.node.div_question.node = this.node;
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
						}
						else {
							this.node.scene.quiz_answers["r"+ this.node.scene.current_round_index+"c"+this.node.scene.current_category_index+"q"+this.node.scene.current_question_index] = false;
						}
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
		node.game_question.build = function() {
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
			page.hideJan(true);
			this.destroyed = function() {
				this.node.div_question.parentNode.removeChild(this.node.div_question);
				delete this.node.div_question;
				this.destroy(true);
				delete this.node.game_question;
				u.o.GameReceipt.init(this.node);
			}
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
		u.loadAssets(node.game_question);
	}
}


/*i-gamereceipt.js*/
Util.Objects["GameReceipt"] = new function() {
	this.init = function(node) {
		node.game_receipt = u.createPIXIApp({"classname":"game_receipt", "height":600});
		node.game_receipt.node = node;
		node.appendChild(node.game_receipt.renderer.view);
		node.game_receipt.loadQueue = [
			"screen_footer.png",
			"confirm_bg.png",
		];
		node.game_receipt.ready = function() {
			this.node.ticket = false;
			this.node.btn_play_more = false;
			if(this.node.scene.current_round_index !== false && this.node.scene.current_category_index !== false && this.node.scene.current_question_index !== false) {
				this.node.div_receipt = u.ae(this.node, "div", {"class":"receipt"});
				this.node.table_receipt = u.ae(this.node.div_receipt, "div", {"class":"table"});
				this.node.cell_receipt = u.ae(this.node.table_receipt, "div", {"class":"cell"});
				if(this.node.scene.quiz_answers["r"+this.node.scene.current_round_index+"c"+this.node.scene.current_category_index+"q"+this.node.scene.current_question_index]) {
					this.node.div_receipt.h2 = u.ae(this.node.cell_receipt, "h2", {"html":"Svaret er rigtigt"});
				}
				else {
					this.node.div_receipt.h2 = u.ae(this.node.cell_receipt, "h2", {"html":"Svaret er forkert"});
				}
				var answer_text = this.node.scene.quiz.rounds[this.node.scene.current_round_index].categories[this.node.scene.current_category_index].questions[this.node.scene.current_question_index].answer_text;
				if(!answer_text.match(/<a/i)) {
					answer_text = answer_text.replace(/(http[s]:\/\/[^ $]+)/, '<a href="$1" target="_blank">$1</a>')
				}
				this.node.div_receipt.p = u.ae(this.node.cell_receipt, "p", {"html": answer_text});
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
				var div_table = u.ae(this.node.div_receipt, "div", {"class":"actions_table"});
				var div_cell = u.ae(div_table, "div", {"class":"actions_cell"});
				var ul_actions = u.ae(div_cell, "ul", {"class":"actions"});
				if(!this.node.scene.all_rounds_over) {
					if(this.node.scene.correct_answers) {
						u.o.ticket.init(this.node);
						this.node.div_receipt.h3 = u.ae(this.node.div_receipt, "h3", {"class":"status", "html":"<span>Du har " + u.pluralize(this.node.scene.correct_answers, "lod", "lodder") + " og kan deltage i lodtrækningen om ugens præmie:</span> <span class=\"prize\">"+this.node.scene.quiz.rounds[this.node.scene.current_round_index].prize+"</span>"});
						u.o.BtnSignup.init(this.node);
						this.node.div_receipt.bn_send = u.ae(ul_actions, "li", {"class":"send"});
						this.node.div_receipt.bn_send.node = this.node;
						this.confirmSignup = function() {
							if(this.node.scene.total_answers < 9) {
								u.o.BtnSignupConfirm.init(this.node);
								this.confirm_box = u.ae(this.node.div_receipt, "div", {"class":"confirm"});
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
						}
						this.signupConfirmed = function() {
							this._destroy("signup");
						}
					}
					if(this.node.scene.total_answers < 9) {
						u.o.BtnPlayMore.init(this.node);
	 					this.node.div_receipt.bn_play = u.ae(ul_actions, "li", {"class":"play"});
	 					this.node.div_receipt.bn_play.node = this.node;
					}
				}
				else {
					u.o.BtnPlayMoreGameOver.init(this.node);
 					this.node.div_receipt.bn_play = u.ae(ul_actions, "li", {"class":"play"});
 					this.node.div_receipt.bn_play.node = this.node;
				}
			}
			else {
				page.error();
			}
			this.is_ready = true;
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
			if(this.node.scene.quiz_answers["r"+this.node.scene.current_round_index+"c"+this.node.scene.current_category_index+"q"+this.node.scene.current_question_index]) {
				page.showJan("rigtigt_svar");
			}
			else {
				page.showJan("forkert_svar");
			}
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
				if(this.node.ticket) {
					u.o.ticket.build(this.node);
				}
				if(this.node.btn_play_more) {
					u.o.BtnPlayMore.build(this.node);
					this.node.div_receipt.bn_play.over = function() {
						this.node.btn_play_more.onMouseOver();
					}
					this.node.div_receipt.bn_play.out = function() {
						this.node.btn_play_more.onMouseOut();
					}
					if(u.e.event_support == "touch") {
						u.e.addEvent(this.node.div_receipt.bn_play, "touchstart", this.node.div_receipt.bn_play.over);
						u.e.addEvent(this.node.div_receipt.bn_play, "touchend", this.node.div_receipt.bn_play.out);
					}
					else {
						u.e.addEvent(this.node.div_receipt.bn_play, "mouseover", this.node.div_receipt.bn_play.over);
						u.e.addEvent(this.node.div_receipt.bn_play, "mouseout", this.node.div_receipt.bn_play.out);
					}
					u.ce(this.node.div_receipt.bn_play);
					this.node.div_receipt.bn_play.clicked = function() {
						page.playEventSound();
						this.node.game_receipt._destroy("continue");
					}
				}
				if(this.node.btn_signup) {
					u.o.BtnSignup.build(this.node);
					this.node.div_receipt.bn_send.over = function() {
						this.node.btn_signup.onMouseOver.call(this.node.btn_signup);
					}
					this.node.div_receipt.bn_send.out = function() {
						this.node.btn_signup.onMouseOut.call(this.node.btn_signup);
					}
					if(u.e.event_support == "touch") {
						u.e.addEvent(this.node.div_receipt.bn_send, "touchstart", this.node.div_receipt.bn_send.over);
						u.e.addEvent(this.node.div_receipt.bn_send, "touchend", this.node.div_receipt.bn_send.out);
					}
					else {
						u.e.addEvent(this.node.div_receipt.bn_send, "mouseover", this.node.div_receipt.bn_send.over);
						u.e.addEvent(this.node.div_receipt.bn_send, "mouseout", this.node.div_receipt.bn_send.out);
					}
					u.ce(this.node.div_receipt.bn_send);
					this.node.div_receipt.bn_send.clicked = function() {
						page.playEventSound();
						this.node.game_receipt.confirmSignup();
					}
				}
			}
			else {
				u.o.BtnPlayMoreGameOver.build(this.node);
				this.node.div_receipt.bn_play.over = function() {
					this.node.btn_play_more.onMouseOver();
				}
				this.node.div_receipt.bn_play.out = function() {
					this.node.btn_play_more.onMouseOut();
				}
				if(u.e.event_support == "touch") {
					u.e.addEvent(this.node.div_receipt.bn_play, "touchstart", this.node.div_receipt.bn_play.over);
					u.e.addEvent(this.node.div_receipt.bn_play, "touchend", this.node.div_receipt.bn_play.out);
				}
				else {
					u.e.addEvent(this.node.div_receipt.bn_play, "mouseover", this.node.div_receipt.bn_play.over);
					u.e.addEvent(this.node.div_receipt.bn_play, "mouseout", this.node.div_receipt.bn_play.out);
				}
				u.ce(this.node.div_receipt.bn_play);
				this.node.div_receipt.bn_play.clicked = function() {
					page.playEventSound();
					this.node.game_receipt._destroy("continue");
				}
			}
		}
		node.game_receipt._destroy = function(onto) {
			this.onto = onto;
			page.hideJan(true);
			this.destroyed = function() {
				this.node.div_receipt.parentNode.removeChild(this.node.div_receipt);
				delete this.node.div_receipt;
				this.destroy(true);
				delete this.node.game_question;
				if(this.onto == "continue") {
					if(this.node.scene.all_rounds_over) {
						u.o.GameSelector.init(this.node);
					}
					else {
						u.o.GameBricks.init(this.node);
					}
				}
				else {
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
		u.loadAssets(node.game_receipt);
	}
	// 
}


/*i-gamesignup.js*/
Util.Objects["GameSignup"] = new function() {
	this.init = function(node) {
		node.game_signup = u.createPIXIApp({"classname":"game_signup", "height":600});
		node.game_signup.node = node;
		node.appendChild(node.game_signup.renderer.view);
		node.game_signup.loadQueue = [
			"screen.png",
		];
		node.game_signup.ready = function() {
			if(this.node.scene.current_round_index !== false && !this.node.scene.all_rounds_over && this.node.scene.correct_answers) {
				this.node.div_signup = u.ae(this.node, "div", {"class":"signup"});
				this.node.div_signup.node = this.node;
				this.node.div_signup.response = function(response) {
					this._form = u.ae(this, u.qs("div.scene form", response));
					this._form.node = this.node;
					this.h2 = u.qs("h2", this._form);
					this.fieldset_data = u.qs("fieldset.data", this._form);
					this.fieldset_permissions = u.qs("fieldset.permissions", this._form);
					this.ul_actions = u.qs("ul.actions", this._form);
					this.bn_continue = u.ae(this, "div", {"class":"continue"});
					this.bn_continue.node = this.node;
					u.f.addField(this._form, {"type":"hidden", "name":"answers", "value":JSON.stringify(this.node.scene.quiz_answers)});
					u.f.addField(this._form, {"type":"hidden", "name":"round", "value":this.node.scene.current_round_index});
					u.f.init(this._form);
					this._form.submitted = function() {
						page.playEventSound();
						if(!this.submitting) {
							this.response = function(response) {
								if(response && response.cms_status == "success") {
									this.node.game_signup._destroy("receipt");
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
						page.playEventSound();
						this.node.div_signup._form.fields["email"].used = true;
						if(u.f.validate(this.node.div_signup._form.fields["email"])) {
							u.a.transition(this.node.btn_continue.renderer.view, "all 0.3s ease-in-out");
							u.ass(this.node.btn_continue.renderer.view, {
								"opacity":0
							});
							u.ac(this.node.div_signup._form.fields["email"].field, "loading");
							this.response = function(response) {
								if(response && response.cms_status == "success" && response.cms_object && response.cms_object.user_exists) {
									console.log("user exists")
									this.response = function(response) {
										if(response && response.cms_status == "success") {
											this.node.game_signup._destroy("receipt");
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
								}
								else if(response && response.cms_status == "success" && response.cms_object && response.cms_object.already_played) {
									this.node.game_signup._destroy("already_played");
									u.saveCookie("stofa_ved_round_"+this.node.scene.current_round_index, 1, {"expires":"Mon, 01-May-2017 05:00:00 GMT"});
								}
								else {
									this.node.game_signup.build_step2();
								}
							}
							u.request(this, "/signup/checkParticipant", {"data":u.f.getParams(this.node.div_signup._form), "method":"post"});
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
					this._form.actions["cancel"].clicked = function() {
						page.playEventSound();
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
					this.node.game_signup.is_ready = true;
					this.node.game_signup.readyCheck();
				}
				u.request(this.node.div_signup, "/signup");
				u.o.BtnContinue.init(this.node);
				u.o.BtnSubmit.init(this.node);
				u.o.BtnRegret.init(this.node);
				this.node.game_screen.setHeader("kontakt_header");
			}
			else {
				page.error();
			}
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
			page.showJan("email_og_konktakt");
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
			u.o.BtnContinue.build(this.node);
		}
		node.game_signup.build_step2 = function() {
			u.rc(this.node.div_signup._form.fields["email"].field, "loading");
			if(this.node.div_signup.h2) {
				u.a.transition(this.node.div_signup.h2, "all 0.2s ease-in-out");
				u.ass(this.node.div_signup.h2, {
					"opacity": 0
				});
			}
			if(this.node.div_signup.bn_continue) {
				u.ass(this.node.div_signup.bn_continue, {
					"display": "none"
				});
			}
			if(this.node.btn_continue) {
				this.node.btn_continue._destroy();
			}
			u.a.transition(this.node.div_signup.fieldset_data, "all 0.3s ease-in-out 0.2s");
			u.ass(this.node.div_signup.fieldset_data, {
				"top": 0
			});
			u.a.transition(this.node.div_signup._form.fields["email"].field, "all 0.3s ease-in-out 0.2s");
			u.ass(this.node.div_signup._form.fields["email"].field, {
				"margin-left": 0
			});
			u.a.transition(this.node.div_signup._form.fields["email"], "all 0.3s ease-in-out 0.2s");
			u.ass(this.node.div_signup._form.fields["email"], {
				"padding-top": "8px",
				"padding-bottom": "6px",
				"width":"259px"
			});
			u.ass(this.node.div_signup.fieldset_permissions, {
				"display": "inline-block",
				"opacity":1
			});
			u.ass(this.node.div_signup.ul_actions, {
				"display": "inline-block",
			});
			u.a.transition(this.node.div_signup.ul_actions, "all 0.3s ease-in-out 0.2s");
			u.ass(this.node.div_signup.ul_actions, {
				"opacity":1
			});
			u.o.BtnSubmit.build(this.node);
			u.o.BtnRegret.build(this.node);
			var i = 0;
			for(x in this.node.div_signup._form.fields) {
				if(this.node.div_signup._form.fields[x].field) {
					u.ass(this.node.div_signup._form.fields[x].field, {
						"display":"inline-block"
					});
					u.a.transition(this.node.div_signup._form.fields[x].field, "all 0.3s ease-in-out "+(300 + (100*i))+"ms");
					u.ass(this.node.div_signup._form.fields[x].field, {
						"opacity":1
					});
					i++;
				}
			}
		}
		node.game_signup._destroy = function(onto) {
			this.onto = onto;
			page.hideJan(true);
			this.destroyed = function() {
				this.node.div_signup.parentNode.removeChild(this.node.div_signup);
				delete this.node.div_signup;
				this.destroy(true);
				delete this.node.game_signup;
				if(this.onto == "game") {
					u.o.GameReceipt.init(this.node);
				}
				else if(this.onto == "already_played") {
					u.o.GameSignupAlreadyPlayed.init(this.node);
				}
				else {
					u.stats.event(this.node, {
						"eventCategory":"signups",
						"eventAction":"complete",
						"eventLabel":"signups"
					});
					u.o.GameSignupReceipt.init(this.node);
				}
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
		u.loadAssets(node.game_signup);
	}
	// 
}


/*i-gamesignupreceipt.js*/
Util.Objects["GameSignupReceipt"] = new function() {
	this.init = function(node) {
		node.game_signup_receipt = u.createPIXIApp({"classname":"game_signup_receipt", "height":600});
		node.game_signup_receipt.node = node;
		node.appendChild(node.game_signup_receipt.renderer.view);
		node.game_signup_receipt.loadQueue = [
			"screen_footer.png",
			"btn_hitarea.png",
			"txt_receipt.png",
			"txt_readmore.png",
			"txt_readmore_hitarea.png",
			"btn_facebook.png",
			"btn_se_naeste_uges_praemie.png",
			"btn_se_naeste_uges_praemie_rollover.png",
		];
		node.game_signup_receipt.ready = function() {
			this.addBtn = function(){
				this.btnContainer = new PIXI.Container();
				this.screenContainer.addChild(this.btnContainer);
				this.btnContainer.pivot.set(this.assets.btn_se_naeste_uges_praemie.width/2,(this.assets.btn_se_naeste_uges_praemie.height/2)-16);
				this.btnContainer.x = 400;
				this.btnContainer.y = 500;
				this.screenContainer.addChild(this.btnContainer);
				this.btnContainer.addChild(this.assets.btn_se_naeste_uges_praemie);
				this.btnContainer.addChild(this.assets.btn_se_naeste_uges_praemie_rollover);
				this.assets.btn_se_naeste_uges_praemie_rollover.alpha = 0;
				this.btnContainer.addChild(this.assets.btn_hitarea);
		        this.assets.btn_hitarea.x = 31;
		        this.assets.btn_hitarea.y = 35;
		        this.assets.btn_hitarea.alpha = 0.001;
		        this.btnHoverDiff = 1;
		        this.btnStartY = this.btnContainer.y;
				this.assets.btn_hitarea.x = 35;
				this.assets.btn_hitarea.y = 30;
				this.assets.btn_hitarea.alpha = 0.001;
				this.btnContainer.alpha = 0;
			}
			this.btnIn = function(){
				var tSpeed = .3;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){
				page.openPrizes(this.node.scene.current_round_index+1);
			}
			this.onBtnOut = function(){
			}
			this.setupInteractionEvents = function(){
				this.assets.btn_hitarea.interactive = true;
				this.assets.btn_hitarea.buttonMode = true;
				this.assets.btn_hitarea.on('click', this.onClicked.bind(this));
				this.assets.btn_hitarea.on('mouseover', this.onMouseOver.bind(this));
				this.assets.btn_hitarea.on('mouseout', this.onMouseOut.bind(this));
				this.assets.btn_facebook.interactive = true;
				this.assets.btn_facebook.buttonMode = true;
				this.assets.btn_facebook.on('click', this.facebookClick.bind(this));
				this.assets.txt_readmore_hitarea.interactive = true;
				this.assets.txt_readmore_hitarea.buttonMode = true;
				this.assets.txt_readmore_hitarea.on('click', this.readmoreClick.bind(this));
			}
			this.onMouseOver = function(){
				var tSpeed = 0.15;
				Tween.to(this.assets.btn_se_naeste_uges_praemie_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
			}
			this.onMouseOut = function(){
				var tSpeed = 0.15;
				Tween.to(this.assets.btn_se_naeste_uges_praemie_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
			}
			this.onClicked = function(){
				page.playEventSound();
				page.openPrizes(this.node.scene.current_round_index+1);
			}
			this.facebookClick = function(){
				page.playEventSound();
				window.open("https://www.facebook.com/sharer/sharer.php?u=https%3A//valgeterdit.stofa.dk");
			}
			this.readmoreClick = function(){
				page.playEventSound();
				location.href = "https://www.stofa.dk";
			}
			this.showReceipt = function(){
				var tSpeed = 0.3;
				Tween.fromTo(this.assets.txt_receipt,tSpeed,{alpha:0},{delay:0.1, alpha:1,ease:Quad.easeIn});
				Tween.fromTo(this.assets.txt_readmore,tSpeed,{alpha:0},{delay:0.2, alpha:1,ease:Quad.easeIn});
				Tween.fromTo(this.assets.btn_facebook,tSpeed,{alpha:0},{delay:0.3, alpha:1,ease:Quad.easeIn});
				Tween.delayedCall(0.4,this.btnIn.bind(this))
			}
			this.stageHeightDiff = 0;
			this.screenContainer = new PIXI.Container();
			this.stage.addChild(this.screenContainer);
			this.startY = this.stageHeightDiff;
			this.screenContainer.x = (this.renderer.width/2)-(1024/2);
			this.assets.txt_receipt.alpha = 0;
			this.screenContainer.addChild(this.assets.txt_receipt);
			this.assets.txt_receipt.x = (this.renderer.width/2)-(this.assets.txt_receipt.width/2);
			this.assets.txt_receipt.y = 203;
			this.screenContainer.addChild(this.assets.txt_readmore);
			this.assets.txt_readmore.alpha = 0;
			this.assets.txt_readmore.x = 203;
			this.assets.txt_readmore.y = 190;
			this.screenContainer.addChild(this.assets.txt_readmore_hitarea);
			this.assets.txt_readmore_hitarea.x = 596;
			this.assets.txt_readmore_hitarea.y = 375;
			this.assets.txt_readmore_hitarea.alpha = 0.003;
			this.screenContainer.addChild(this.assets.btn_facebook);
			this.assets.btn_facebook.alpha = 0;
			this.assets.btn_facebook.x = 530;
			this.assets.btn_facebook.y = 475;
			this.addBtn();
			this.node.div_signup_receipt = u.ae(this.node, "div", {"class":"signup_receipt"});
			this.node.div_signup_receipt.node = this.node;
			this.is_ready = true;
			this.build();
		}
		node.game_signup_receipt.build = function() {
			page.showJan("godt_spillet");
			u.a.transition(this.node.div_signup_receipt, "all 0.4s ease-in-out");
			u.ass(this.node.div_signup_receipt, {
				"opacity": 1
			});
			this.node.game_screen.setHeader(false);
			this.showReceipt();
		}
		node.game_signup_receipt._destroy = function() {
			page.hideJan(true);
			this.destroy(true);
			this.node.game_signup_receipt = false;
		}
		u.loadAssets(node.game_signup_receipt);
	}
	// 
	this.build = function(node) {
		node.game_signup_receipt.build();
	}
}


/*i-gamesignupalreadyplayed.js*/
Util.Objects["GameSignupAlreadyPlayed"] = new function() {
	this.init = function(node) {
		node.game_signup_already_played = u.createPIXIApp({"classname":"game_signup_already_played", "height":600});
		node.game_signup_already_played.node = node;
		node.appendChild(node.game_signup_already_played.renderer.view);
		node.game_signup_already_played.loadQueue = [
			"btn_hitarea.png",
			"txt_already_played.png",
			"btn_se_naeste_uges_praemie.png",
			"btn_se_naeste_uges_praemie_rollover.png",
		];
		node.game_signup_already_played.ready = function() {
			this.addBtn = function(){
				this.btnContainer = new PIXI.Container();
				this.screenContainer.addChild(this.btnContainer);
				this.btnContainer.pivot.set(this.assets.btn_se_naeste_uges_praemie.width/2,(this.assets.btn_se_naeste_uges_praemie.height/2)-16);
				this.btnContainer.x = this.renderer.width/2;
				this.btnContainer.y = 430;
				this.screenContainer.addChild(this.btnContainer);
				this.btnContainer.addChild(this.assets.btn_se_naeste_uges_praemie);
				this.btnContainer.addChild(this.assets.btn_se_naeste_uges_praemie_rollover);
				this.assets.btn_se_naeste_uges_praemie_rollover.alpha = 0;
				this.btnContainer.addChild(this.assets.btn_hitarea);
				this.assets.btn_hitarea.x = 35;
				this.assets.btn_hitarea.y = 30;
				this.assets.btn_hitarea.alpha = 0.001;
				this.btnContainer.alpha = 0;
			}
			this.btnIn = function(){
				var tSpeed = .3;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){
				page.playEventSound();
				page.openPrizes(this.node.scene.current_round_index+1);
			}
			this.onBtnOut = function(){
			}
			this.setupInteractionEvents = function(){
				this.assets.btn_hitarea.interactive = true;
				this.assets.btn_hitarea.buttonMode = true;
				this.assets.btn_hitarea.on('click', this.btnOut.bind(this));
				this.assets.btn_hitarea.on('mouseover', this.onMouseOver.bind(this));
				this.assets.btn_hitarea.on('mouseout', this.onMouseOut.bind(this));
			}
			this.onMouseOver = function(){
				var tSpeed = 0.15;
				Tween.to(this.assets.btn_se_naeste_uges_praemie_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
			}
			this.onMouseOut = function(){
				var tSpeed = 0.15;
				Tween.to(this.assets.btn_se_naeste_uges_praemie_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
			}
			this.showScreen = function(){
				var tSpeed = 3;
				Tween.fromTo(this.assets.txt_already_played,0.5,{alpha:0},{delay:1.2, alpha:1});
				Tween.delayedCall(1.4,this.btnIn.bind(this))
			}
			this.stageHeightDiff = 0;
			this.screenContainer = new PIXI.Container();
			this.stage.addChild(this.screenContainer);
			this.startY = this.stageHeightDiff;
			this.screenContainer.x = (this.renderer.width/2)-(1024/2);
			this.screenContainer.y = 0; 
			this.assets.txt_already_played.alpha = 0;
			this.screenContainer.addChild(this.assets.txt_already_played);
			this.assets.txt_already_played.x = (this.renderer.width/2)-(this.assets.txt_already_played.width/2);
			this.assets.txt_already_played.y = 220;
			this.addBtn();
			this.is_ready = true;
			this.build();
		}
		node.game_signup_already_played.build = function() {
			page.showJan("already_played");
			this.node.game_screen.setHeader(false);
			this.showScreen();
		}
		node.game_signup_already_played._destroy = function() {
			page.hideJan(true);
			this.destroy(true);
			this.node.game_signup_already_played = false;
		}
		u.loadAssets(node.game_signup_already_played);
	}
	// 
	this.build = function(node) {
		node.game_signup_already_played.build();
	}
}


/*i-torkild.js*/
Util.Objects["torkild"] = new function() {
	this.init = function(node) {
		node.torkild = u.createPIXIApp({"classname":"torkild", "height":345, "width":345, "webgl":true});
		node.torkild.node = node;
		node.appendChild(node.torkild.renderer.view);
		node.torkild.loadQueue = [
			"torkild.png",
			"torkild_bg.png",
			"torkild_btn_active.png",
			"torkild_btn_inactive.png",
			"torkild_btn_glow.png",
			"torkild_top_circle.png",
			"torkild_tile.jpg",
			"torkild_hitarea.png",
		];
		node.torkild.ready = function() {
			this.torkildHover = function(){
					this.hoverDiff*=-1;
					var tSpeed = 2;
					Tween.to(this.torkildContainer,tSpeed,{y:this.startY + this.hoverDiff, ease:Quad.easeInOut});
				Tween.delayedCall(tSpeed, this.torkildHover.bind(this));
			}
			this.torkildIn = function(){
				var tSpeed = 2;
				Tween.to(this.torkildContainer.scale,tSpeed,{x:1,y:1, ease:Elastic.easeOut.config(0.6)});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.torkildOut = function(){
				var tSpeed = 0.5;
				Tween.to(this.torkildContainer.scale,tSpeed,{x:0,y:0, ease:Back.easeIn});
				this.assets.torkild_hitarea.interactive = false;
			}
			this.torkildJump = function (){
				if(!this.torkildBtnIsActive && this.renderer){
					Tween.to(this.assets.torkild,0.2,{y:-18, ease:Quad.easeInOut});
					Tween.to(this.torkildContainer,0.2,{delay:0.3, y:(this.renderer.height/2) + 10, ease:Quad.easeInOut});
					Tween.to(this.torkildContainer,1.4,{delay:0.5, y:this.renderer.height/2, ease:Elastic.easeOut});
					Tween.to(this.assets.torkild,0.2,{delay:0.2, y:0, ease:Quad.easeIn});
				}
				if(this.renderer) {
					Tween.delayedCall(4, this.torkildJump.bind(this));
				}
			}
			this.setupInteractionEvents = function(){
				this.assets.torkild_hitarea.interactive = true;
				this.assets.torkild_hitarea.buttonMode = true;
				this.assets.torkild_hitarea.on('click', this.setTorkildToActive.bind(this));
				this.assets.torkild_hitarea.on('mouseover', this.onMouseOver.bind(this));
				this.assets.torkild_hitarea.on('mouseout', this.onMouseOut.bind(this));
			}
			this.onMouseOver = function(){
				if(!this.torkildBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.torkild_btn_glow,0.3,{alpha:1});
				}
			}
			this.onMouseOut = function(){
				if(!this.torkildBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.torkild_btn_glow,0.3,{alpha:0});
				}
			}
			this.setTorkildToActive = function(){
				page.playEventSound();
				var tSpeed = 0.3;
				if(!this.torkildBtnIsActive){
					this.torkildBtnIsActive = true;
					Tween.to(this.assets.torkild_btn_active,tSpeed*.2,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.torkild_btn_glow,tSpeed,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.torkild,tSpeed,{y:-18, ease:Quad.easeInOut});
					this.node.torkild_hint.fullExpand = function() {
						u.a.transition(this, "all 0.2s ease-in-out");
						u.ass(this, {
							"height":this.org_height+"px",
						});
						u.a.transition(this.node.torkild_hint_span, "all 0.2s ease-in-out 0.1s");
						u.ass(this.node.torkild_hint_span, {
							"opacity":1
						});
					}
					u.a.transition(this.node.torkild_hint, "all 0.2s ease-in-out");
					u.ass(this.node.torkild_hint, {
						"opacity":1,
						"width":this.node.torkild_hint.org_width+"px",
						"margin-right":0,
						"height":"20px"
					});
					u.t.setTimer(this.node.torkild_hint, "fullExpand", 300);
				} 
				else {
					this.torkildBtnIsActive = false;
					Tween.to(this.assets.torkild_btn_active,tSpeed*.2,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.torkild_btn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.torkild,tSpeed,{y:0, ease:Quad.easeInOut});
					this.node.torkild_hint.fullCollapse = function() {
						u.a.transition(this, "all 0.2s ease-in-out");
						u.ass(this, {
							"width":0,
							"height":0,
							"opacity":0,
							"margin-right":Math.round(this.org_width/2)+"px"
						});
					}
					u.a.transition(this.node.torkild_hint, "all 0.2s ease-in-out");
					u.ass(this.node.torkild_hint, {
						"height":"20px"
					});
					u.a.transition(this.node.torkild_hint_span, "all 0.1s ease-in-out");
					u.ass(this.node.torkild_hint_span, {
						"opacity":0
					});
					u.t.setTimer(this.node.torkild_hint, "fullCollapse", 200);
				}
			}
			this.changeDisplacementPosition = function () {
				this.displacementSprite.y -= 1;
				Tween.delayedCall(0.04, this.changeDisplacementPosition.bind(this));
			}
			this.torkildContainer = new PIXI.Container();
			this.stage.addChild(this.torkildContainer);
			this.torkildContainer.pivot.set(this.renderer.width/2,this.renderer.width/2);
			this.torkildContainer.x = this.renderer.width/2;
			this.torkildContainer.y = this.renderer.width/2;
			this.torkildContainer.addChild(this.assets.torkild_bg);
			this.torkildContainer.addChild(this.assets.torkild);
			this.torkildContainer.addChild(this.assets.torkild_top_circle);
			this.torkildContainer.addChild(this.assets.torkild_btn_inactive);
			this.torkildContainer.addChild(this.assets.torkild_btn_glow);
			this.displacementSprite = this.assets.torkild_tile;
			this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
			this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
			this.displacementFilter.scale.x = this.displacementFilter.scale.y = 15;
			this.assets.torkild_btn_glow.filters = [this.displacementFilter];
			this.torkildContainer.addChild(this.displacementSprite);
			this.changeDisplacementPosition();
			this.torkildContainer.addChild(this.assets.torkild_btn_active);
			this.torkildContainer.addChild(this.assets.torkild_hitarea);
			this.assets.torkild_btn_active.alpha = 1;
			this.assets.torkild_btn_glow.alpha = 0;
			this.assets.torkild_hitarea.x = (this.renderer.width-this.assets.torkild_hitarea.width)/2;
			this.assets.torkild_hitarea.y = (this.renderer.width-this.assets.torkild_hitarea.width)/2;
			this.assets.torkild_hitarea.alpha = 0.001;
			this.torkildContainer.scale.x = this.torkildContainer.scale.y = 0;  
			this.hoverDiff = 3;
			this.startY = this.torkildContainer.y;
			this.node.div_torkild = u.ae(this.node, "div", {"class":"torkild"});
			this.node.div_torkild.node = this.node;
			this.node.div_torkild.over = function() {
				this.node.torkild.onMouseOver();
			}
			this.node.div_torkild.out = function() {
				this.node.torkild.onMouseOut();
			}
			if(u.e.event_support == "touch") {
				u.e.addEvent(this.node.div_torkild, "touchstart", this.node.div_torkild.over);
				u.e.addEvent(this.node.div_torkild, "touchend", this.node.div_torkild.out);
			}
			else {
				u.e.addEvent(this.node.div_torkild, "mouseover", this.node.div_torkild.over);
				u.e.addEvent(this.node.div_torkild, "mouseout", this.node.div_torkild.out);
			}
			u.ce(this.node.div_torkild);
			this.node.div_torkild.clicked = function() {
				this.node.torkild.setTorkildToActive();
			}
			this.node.torkild_hint = u.ae(this.node, "p", {"class":"torkild_hint"});
			this.node.torkild_hint.node = this.node;
			this.node.torkild_hint_span = u.ae(this.node.torkild_hint, "span", {"html":this.node.question.hint});
			this.node.torkild_hint.org_width = this.node.torkild_hint.offsetWidth;
			this.node.torkild_hint.org_height = this.node.torkild_hint.offsetHeight;
			u.ass(this.node.torkild_hint, {
				"width":"0px",
				"height":"0px",
				"opacity":0,
				"margin-right":Math.round(this.node.torkild_hint.org_width/2)+"px"
			});
			u.ass(this.node.torkild_hint_span, {
				"opacity":0
			});
			this.is_ready = true;
			this.node.game_question.readyCheck();
		}
		node.torkild.build = function() {
			this.torkildIn();
			Tween.delayedCall(4, this.torkildJump.bind(this));
		}
		node.torkild._destroy = function() {
			this.destroyed = function() {
				this.node.torkild_hint.parentNode.removeChild(this.node.torkild_hint);
				delete this.node.torkild_hint;
				this.node.div_torkild.parentNode.removeChild(this.node.div_torkild);
				delete this.node.div_torkild;
				this.destroy(true);
				delete this.node.torkild;
			}
			u.a.transition(this.node.torkild_hint, "all 0.2s ease-in-out");
			u.ass(this.node.torkild_hint, {
				"opacity":0
			})
			this.torkildOut();
			u.t.setTimer(this, "destroyed", 500);
		}
		u.loadAssets(node.torkild);
	}
	this.build = function(node) {
		node.torkild.build();
	}
}

/*i-ticket.js*/
Util.Objects["ticket"] = new function() {
	this.init = function(node) {
		node.ticket = u.createPIXIApp({"classname":"ticket", "height":180, "width":180});
		node.ticket.node = node;
		node.appendChild(node.ticket.renderer.view);
		node.ticket.loadQueue = [
			"ticket_bg.png",
			"ticket_top.png",
		];
		node.ticket.ready = function() {
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
		node.ticket.build = function() {
			this.ticketIn();
		}
		node.ticket._destroy = function() {
			this.destroyed = function() {
				this.destroy(true);
				delete this.node.ticket;
			}
			this.ticketOut();
			u.t.setTimer(this, "destroyed", 400);
		}
		u.loadAssets(node.ticket);
	}
	this.build = function(node) {
		node.ticket.build();
	}
}

/*i-btn_play_more.js*/
Util.Objects["BtnPlayMore"] = new function() {
	this.init = function(node) {
		node.btn_play_more = u.createPIXIApp({"classname":"btn_play_more", "height":145, "width":300});
		node.btn_play_more.node = node;
		node.div_receipt.appendChild(node.btn_play_more.renderer.view);
		node.btn_play_more.loadQueue = [
			"btn_spil_med_om_flere_lodder.png",
			"btn_spil_med_om_flere_lodder_rollover.png",
			"btn_hitarea.png",
		];
		node.btn_play_more.ready = function() {
			this.addBtn = function(){
				this.btnContainer.addChild(this.assets.btn_spil_med_om_flere_lodder);
				this.btnContainer.addChild(this.assets.btn_spil_med_om_flere_lodder_rollover);
				this.assets.btn_spil_med_om_flere_lodder_rollover.alpha = 0;
				this.btnContainer.addChild(this.assets.btn_hitarea);
		        this.assets.btn_hitarea.x = 47;
		        this.assets.btn_hitarea.y = 31;
		        this.assets.btn_hitarea.alpha = 0.001;
			}
			this.btnIn = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:0, ease:Quad.easeOut, onComplete:this.onBtnOut.bind(this)});
				this.assets.btn_hitarea.interactive = false;
			}
			this.onBtnOut = function(){
			}
			this.setupInteractionEvents = function(){
			}
			this.onMouseOver = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_spil_med_om_flere_lodder_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
				}
			}
			this.onMouseOut = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_spil_med_om_flere_lodder_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
				}
			}
			this.setbtnToActive = function(){
				var tSpeed = 0.3;
				if(!this.btnBtnIsActive){
					this.btnBtnIsActive = true;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:-18, ease:Quad.easeInOut});
				} else {
					this.btnBtnIsActive = false;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:0, ease:Quad.easeInOut});
				}
			}
			this.stageHeightDiff = 0;
			this.btnContainer = new PIXI.Container();
			this.stage.addChild(this.btnContainer);
			this.btnContainer.alpha = 0;
			this.addBtn();
			this.is_ready = true;
			this.node.game_receipt.readyCheck();
		}
		node.btn_play_more.build = function() {
			if(!this.node.btn_signup) {
				u.ac(this.renderer.view, "single");
			}
			this.btnIn();
		}
		node.btn_play_more._destroy = function() {
			this.destroyed = function() {
				this.destroy(true);
				delete this.node.btn_signup_confirm;
			}
			this.btnOut();
			u.t.setTimer(this, "destroyed", 200);
		}
		u.loadAssets(node.btn_play_more);
	}
	// 
	this.build = function(node) {
		node.btn_play_more.build();
	}
}


/*i-btn_signup.js*/
Util.Objects["BtnSignup"] = new function() {
	this.init = function(node) {
		node.btn_signup = u.createPIXIApp({"classname":"btn_signup", "height":145, "width":300});
		node.btn_signup.node = node;
		node.div_receipt.appendChild(node.btn_signup.renderer.view);
		node.btn_signup.loadQueue = [
			"btn_afslut_og_deltag.png",
			"btn_afslut_og_deltag_rollover.png",
			"btn_hitarea.png",
		];
		node.btn_signup.ready = function() {
			this.addBtn = function(){
				this.btnContainer.addChild(this.assets.btn_afslut_og_deltag);
				this.btnContainer.addChild(this.assets.btn_afslut_og_deltag_rollover);
				this.assets.btn_afslut_og_deltag_rollover.alpha = 0;
				this.btnContainer.addChild(this.assets.btn_hitarea);
		        this.assets.btn_hitarea.x = 47;
		        this.assets.btn_hitarea.y = 31;
		        this.assets.btn_hitarea.alpha = 0.001;
			}
			this.btnIn = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:0, ease:Quad.easeOut, onComplete:this.onBtnOut.bind(this)});
				this.assets.btn_hitarea.interactive = false;
			}
			this.onBtnOut = function(){
			}
			this.setupInteractionEvents = function(){
				this.assets.btn_hitarea.interactive = true;
				this.assets.btn_hitarea.buttonMode = true;
			}
			this.onMouseOver = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_afslut_og_deltag_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
				}
			}
			this.onMouseOut = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_afslut_og_deltag_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
				}
			}
			this.setbtnToActive = function(){
				var tSpeed = 0.3;
				if(!this.btnBtnIsActive){
					this.btnBtnIsActive = true;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:-18, ease:Quad.easeInOut});
				} else {
					this.btnBtnIsActive = false;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:0, ease:Quad.easeInOut});
				}
			}
			this.stageHeightDiff = 0;
			this.btnContainer = new PIXI.Container();
			this.stage.addChild(this.btnContainer);
			this.btnContainer.alpha = 0;
			this.addBtn();
			this.is_ready = true;
			this.node.game_receipt.readyCheck();
		}
		node.btn_signup.build = function() {
			if(!this.node.btn_play_more) {
				u.ac(this.renderer.view, "single");
			}
			this.btnIn();
		}
		node.btn_signup._destroy = function() {
			this.destroyed = function() {
				this.destroy(true);
				delete this.node.btn_signup;
			}
			this.btnOut();
			u.t.setTimer(this, "destroyed", 200);
		}
		u.loadAssets(node.btn_signup);
	}
	// 
	this.build = function(node) {
		node.btn_signup.build();
	}
}


/*i-btn_continue.js*/
Util.Objects["BtnContinue"] = new function() {
	this.init = function(node) {
		node.btn_continue = u.createPIXIApp({"classname":"btn_continue", "height":145, "width":300});
		node.btn_continue.node = node;
		node.div_signup.appendChild(node.btn_continue.renderer.view);
		node.btn_continue.loadQueue = [
			"btn_fortsaet.png",
			"btn_fortsaet_rollover.png",
			"btn_hitarea.png",
		];
		node.btn_continue.ready = function() {
			this.addBtn = function(){
				this.btnContainer.addChild(this.assets.btn_fortsaet);
				this.btnContainer.addChild(this.assets.btn_fortsaet_rollover);
				this.assets.btn_fortsaet_rollover.alpha = 0;
				this.btnContainer.addChild(this.assets.btn_hitarea);
		        this.assets.btn_hitarea.x = 47;
		        this.assets.btn_hitarea.y = 31;
		        this.assets.btn_hitarea.alpha = 0.001;
			}
			this.btnIn = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, delay: 0.3, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:0, ease:Quad.easeOut, onComplete:this.onBtnOut.bind(this)});
				this.assets.btn_hitarea.interactive = false;
			}
			this.onBtnOut = function(){
			}
			this.setupInteractionEvents = function(){
			}
			this.onMouseOver = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_fortsaet_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
				}
			}
			this.onMouseOut = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_fortsaet_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
				}
			}
			this.setbtnToActive = function(){
				var tSpeed = 0.3;
				if(!this.btnBtnIsActive){
					this.btnBtnIsActive = true;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:-18, ease:Quad.easeInOut});
				} else {
					this.btnBtnIsActive = false;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:0, ease:Quad.easeInOut});
				}
			}
			this.stageHeightDiff = 0;
			this.btnContainer = new PIXI.Container();
			this.stage.addChild(this.btnContainer);
			this.btnContainer.alpha = 0;
			this.addBtn();
			this.is_ready = true;
			this.node.game_signup.readyCheck();
		}
		node.btn_continue.build = function() {
			this.btnIn();
		}
		node.btn_continue._destroy = function() {
			this.destroyed = function() {
				this.destroy(true);
				delete this.node.btn_continue;
			}
			this.btnOut();
			u.t.setTimer(this, "destroyed", 200);
		}
		u.loadAssets(node.btn_continue);
	}
	// 
	this.build = function(node) {
		node.btn_continue.build();
	}
}


/*i-btn_signup_confirm.js*/
Util.Objects["BtnSignupConfirm"] = new function() {
	this.init = function(node) {
		node.btn_signup_confirm = u.createPIXIApp({"classname":"btn_signup_confirm", "height":163, "width":300});
		node.btn_signup_confirm.node = node;
		node.div_receipt.appendChild(node.btn_signup_confirm.renderer.view);
		node.btn_signup_confirm.loadQueue = [
			"btn_ja_afslut_og_deltag.png",
			"btn_ja_afslut_og_deltag_rollover.png",
			"btn_hitarea.png",
		];
		node.btn_signup_confirm.ready = function() {
			this.addBtn = function(){
				this.btnContainer.addChild(this.assets.btn_ja_afslut_og_deltag);
				this.btnContainer.addChild(this.assets.btn_ja_afslut_og_deltag_rollover);
				this.assets.btn_ja_afslut_og_deltag_rollover.alpha = 0;
				this.btnContainer.addChild(this.assets.btn_hitarea);
		        this.assets.btn_hitarea.x = 47;
		        this.assets.btn_hitarea.y = 31;
		        this.assets.btn_hitarea.alpha = 0.001;
			}
			this.btnIn = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:0, ease:Quad.easeOut, onComplete:this.onBtnOut.bind(this)});
				this.assets.btn_hitarea.interactive = false;
			}
			this.onBtnOut = function(){
			}
			this.setupInteractionEvents = function(){
				this.assets.btn_hitarea.interactive = true;
				this.assets.btn_hitarea.buttonMode = true;
				this.assets.btn_hitarea.on('click', this.onClicked.bind(this));
				this.assets.btn_hitarea.on('mouseover', this.onMouseOver.bind(this));
				this.assets.btn_hitarea.on('mouseout', this.onMouseOut.bind(this));
			}
			this.onMouseOver = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_ja_afslut_og_deltag_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
				}
			}
			this.onMouseOut = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_ja_afslut_og_deltag_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
				}
			}
			this.onClicked = function() {
				page.playEventSound();
				this.node.game_receipt.signupConfirmed();
			}
			this.setbtnToActive = function(){
				var tSpeed = 0.3;
				if(!this.btnBtnIsActive){
					this.btnBtnIsActive = true;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:-18, ease:Quad.easeInOut});
				} else {
					this.btnBtnIsActive = false;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:0, ease:Quad.easeInOut});
				}
			}
			this.stageHeightDiff = 0;
			this.btnContainer = new PIXI.Container();
			this.stage.addChild(this.btnContainer);
			this.btnContainer.alpha = 0;
			this.addBtn();
			this.is_ready = true;
			this.build();
		}
		node.btn_signup_confirm.build = function() {
			this.btnIn();
		}
		node.btn_signup_confirm._destroy = function() {
			this.destroyed = function() {
				this.destroy(true);
				delete this.node.btn_signup_confirm;
			}
			this.btnOut();
			u.t.setTimer(this, "destroyed", 200);
		}
		u.loadAssets(node.btn_signup_confirm);
	}
	// 
	this.build = function(node) {
		node.btn_signup_confirm.build();
	}
}


/*i-btn_play_more_game_over.js*/
Util.Objects["BtnPlayMoreGameOver"] = new function() {
	this.init = function(node) {
		node.btn_play_more = u.createPIXIApp({"classname":"btn_play_more", "height":145, "width":300});
		node.btn_play_more.node = node;
		node.div_receipt.appendChild(node.btn_play_more.renderer.view);
		node.btn_play_more.loadQueue = [
			"btn_svar_paa_flere_spoergsmaal.png",
			"btn_svar_paa_flere_spoergsmaal_rollover.png",
			"btn_hitarea.png",
		];
		node.btn_play_more.ready = function() {
			this.addBtn = function(){
				this.btnContainer.addChild(this.assets.btn_svar_paa_flere_spoergsmaal);
				this.btnContainer.addChild(this.assets.btn_svar_paa_flere_spoergsmaal_rollover);
				this.assets.btn_svar_paa_flere_spoergsmaal_rollover.alpha = 0;
				this.btnContainer.addChild(this.assets.btn_hitarea);
		        this.assets.btn_hitarea.x = 47;
		        this.assets.btn_hitarea.y = 31;
		        this.assets.btn_hitarea.alpha = 0.001;
			}
			this.btnIn = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:0, ease:Quad.easeOut, onComplete:this.onBtnOut.bind(this)});
				this.assets.btn_hitarea.interactive = false;
			}
			this.onBtnOut = function(){
			}
			this.setupInteractionEvents = function(){
			}
			this.onMouseOver = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_svar_paa_flere_spoergsmaal_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
				}
			}
			this.onMouseOut = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_svar_paa_flere_spoergsmaal_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
				}
			}
			this.setbtnToActive = function(){
				var tSpeed = 0.3;
				if(!this.btnBtnIsActive){
					this.btnBtnIsActive = true;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:-18, ease:Quad.easeInOut});
				} else {
					this.btnBtnIsActive = false;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:0, ease:Quad.easeInOut});
				}
			}
			this.stageHeightDiff = 0;
			this.btnContainer = new PIXI.Container();
			this.stage.addChild(this.btnContainer);
			this.btnContainer.alpha = 0;
			this.addBtn();
			this.is_ready = true;
			this.node.game_receipt.readyCheck();
		}
		node.btn_play_more.build = function() {
			if(!this.node.btn_signup) {
				u.ac(this.renderer.view, "single");
			}
			this.btnIn();
		}
		node.btn_play_more._destroy = function() {
			this.destroyed = function() {
				this.destroy(true);
				delete this.node.btn_signup_confirm;
			}
			this.btnOut();
			u.t.setTimer(this, "destroyed", 200);
		}
		u.loadAssets(node.btn_play_more);
	}
	// 
	this.build = function(node) {
		node.btn_play_more.build();
	}
}


/*i-btn_regret.js*/
Util.Objects["BtnRegret"] = new function() {
	this.init = function(node) {
		node.btn_regret = u.createPIXIApp({"classname":"btn_regret", "height":145, "width":300});
		node.btn_regret.node = node;
		node.div_signup.appendChild(node.btn_regret.renderer.view);
		node.btn_regret.loadQueue = [
			"btn_nej_ikke_alligevel.png",
			"btn_nej_ikke_alligevel_rollover.png",
			"btn_hitarea.png",
		];
		node.btn_regret.ready = function() {
			this.addBtn = function(){
				this.btnContainer.addChild(this.assets.btn_nej_ikke_alligevel);
				this.btnContainer.addChild(this.assets.btn_nej_ikke_alligevel_rollover);
				this.assets.btn_nej_ikke_alligevel_rollover.alpha = 0;
				this.btnContainer.addChild(this.assets.btn_hitarea);
		        this.assets.btn_hitarea.x = 47;
		        this.assets.btn_hitarea.y = 31;
		        this.assets.btn_hitarea.alpha = 0.001;
			}
			this.btnIn = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, delay: 1, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:0, ease:Quad.easeOut, onComplete:this.onBtnOut.bind(this)});
				this.assets.btn_hitarea.interactive = false;
			}
			this.onBtnOut = function(){
			}
			this.setupInteractionEvents = function(){
			}
			this.onMouseOver = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_nej_ikke_alligevel_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
				}
			}
			this.onMouseOut = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_nej_ikke_alligevel_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
				}
			}
			this.setbtnToActive = function(){
				var tSpeed = 0.3;
				if(!this.btnBtnIsActive){
					this.btnBtnIsActive = true;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:-18, ease:Quad.easeInOut});
				} else {
					this.btnBtnIsActive = false;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:0, ease:Quad.easeInOut});
				}
			}
			this.stageHeightDiff = 0;
			this.btnContainer = new PIXI.Container();
			this.stage.addChild(this.btnContainer);
			this.btnContainer.alpha = 0;
			this.addBtn();
			this.is_ready = true;
			this.node.game_signup.readyCheck();
		}
		node.btn_regret.build = function() {
			this.btnIn();
		}
		node.btn_regret._destroy = function() {
			this.destroyed = function() {
				this.destroy(true);
				delete this.node.btn_signup_confirm;
			}
			this.btnOut();
			u.t.setTimer(this, "destroyed", 200);
		}
		u.loadAssets(node.btn_regret);
	}
	// 
	this.build = function(node) {
		node.btn_regret.build();
	}
}


/*i-btn_submit.js*/
Util.Objects["BtnSubmit"] = new function() {
	this.init = function(node) {
		node.btn_submit = u.createPIXIApp({"classname":"btn_submit", "height":145, "width":300});
		node.btn_submit.node = node;
		node.div_signup.appendChild(node.btn_submit.renderer.view);
		node.btn_submit.loadQueue = [
			"btn_deltag.png",
			"btn_deltag_rollover.png",
			"btn_hitarea.png",
		];
		node.btn_submit.ready = function() {
			this.addBtn = function(){
				this.btnContainer.addChild(this.assets.btn_deltag);
				this.btnContainer.addChild(this.assets.btn_deltag_rollover);
				this.assets.btn_deltag_rollover.alpha = 0;
				this.btnContainer.addChild(this.assets.btn_hitarea);
				this.assets.btn_hitarea.x = 47;
				this.assets.btn_hitarea.y = 31;
				this.assets.btn_hitarea.alpha = 0.001;
			}
			this.btnIn = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:1, delay: 0.8, ease:Quad.easeIn});
				Tween.delayedCall(tSpeed/4, this.setupInteractionEvents.bind(this));
			}
			this.btnOut = function(){
				var tSpeed = .2;
				Tween.to(this.btnContainer,tSpeed,{alpha:0, ease:Quad.easeOut, onComplete:this.onBtnOut.bind(this)});
				this.assets.btn_hitarea.interactive = false;
			}
			this.onBtnOut = function(){
			}
			this.setupInteractionEvents = function(){
			}
			this.onMouseOver = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_deltag_rollover,tSpeed,{alpha:1, ease:Quad.easeInOut});
				}
			}
			this.onMouseOut = function(){
				if(!this.btnBtnIsActive){
					var tSpeed = 0.15;
					Tween.to(this.assets.btn_deltag_rollover,tSpeed,{alpha:0, ease:Quad.easeInOut});
				}
			}
			this.setbtnToActive = function(){
				var tSpeed = 0.3;
				if(!this.btnBtnIsActive){
					this.btnBtnIsActive = true;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:1, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:-18, ease:Quad.easeInOut});
				} else {
					this.btnBtnIsActive = false;
					Tween.to(this.assets.btn_btn_active,tSpeed*.2,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn_btn_glow,tSpeed,{alpha:0, ease:Quad.easeIn});
					Tween.to(this.assets.btn,tSpeed,{y:0, ease:Quad.easeInOut});
				}
			}
			this.stageHeightDiff = 0;
			this.btnContainer = new PIXI.Container();
			this.stage.addChild(this.btnContainer);
			this.btnContainer.alpha = 0;
			this.addBtn();
			this.is_ready = true;
			this.node.game_signup.readyCheck();
		}
		node.btn_submit.build = function() {
			if(!this.node.btn_submit) {
				u.ac(this.renderer.view, "single");
			}
			this.btnIn();
		}
		node.btn_submit._destroy = function() {
			this.destroyed = function() {
				this.destroy(true);
				delete this.node.btn_signup_confirm;
			}
			this.btnOut();
			u.t.setTimer(this, "destroyed", 200);
		}
		u.loadAssets(node.btn_submit);
	}
	// 
	this.build = function(node) {
		node.btn_submit.build();
	}
}


/*u-create_overlay.js*/
u.createOverlay = function (_options) {
	var width = 768;
	var height = 600;
	var classname = "";
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
	var overlay = u.ae(document.body, "div", { "class": "Overlay" + (classname ? " " + classname : ""), "tabindex":"-1" });
	u.ass(overlay, {
		"width": width + "px",
		"height": height + "px",
		"left": Math.round((u.browserW() - width) / 2) + "px",
		"top": Math.round((u.browserH() - height) / 2) + "px",
	});
	overlay.protection = u.ae(document.body, "div", { "class": "OverlayProtection" });
	u.as(document.body, "overflow", "hidden");
	overlay._resized = function (event) {
		u.ass(this, {
			"left": Math.round((u.browserW() - this.offsetWidth) / 2) + "px",
			"top": Math.round(((u.browserH() < 900 ? u.browserH() : 900) - this.offsetHeight) / 2) + "px",
		});
		if (typeof (this.resized) == "function") {
			this.resized(event);
		}
	}
	u.e.addWindowEvent(overlay, "resize", "_resized");
	overlay.close = function (event) {
		u.as(document.body, "overflow", "auto");
		document.body.removeChild(this);
		document.body.removeChild(this.protection);
		document.body.removeChild(this.bn_close);
		if (typeof (this.closed) == "function") {
			this.closed(event);
		}
	}
	overlay.bn_close = u.ae(document.body, "div", { "class": "overlayClose" });
	overlay.bn_close.overlay = overlay;
	u.ce(overlay.bn_close);
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
	return overlay;
}


/*u-basics.js*/
u.createPIXIApp = function(_options) {
	var width = 1024;
	var height = 600;
	var classname = u.randomString(5);
	var webgl = false;
	if (typeof (_options) == "object") {
		var _argument;
		for (_argument in _options) {
			switch (_argument) {
				case "width": width = _options[_argument]; break;
				case "height": height = _options[_argument]; break;
				case "webgl": webgl = _options[_argument]; break;
				case "classname": classname = _options[_argument]; break;
			}
		}
	}
	var app = new PIXI.Application(width, height, {antialias: false, transparent: true}, !webgl);
	app.renderer.plugins.interaction.autoPreventDefault = false;
	u.ac(app.renderer.view, classname);
	return app;
}
u.loadAssets = function(app, _options) {
	var assets_prefix = "/img/assets/desktop";
	if (typeof (_options) == "object") {
		var _argument;
		for (_argument in _options) {
			switch (_argument) {
				case "assets_prefix": assets_prefix = _options[_argument]; break;
			}
		}
	}
	if(app.loadQueue && app.loadQueue.length) {
		var loader    = new PIXI.loaders.Loader(assets_prefix);
		var i, asset;
		for(i = 0; asset = app.loadQueue[i]; i++) {
			loader.add(asset);
		}
		loader.load(u._assetsLoaded.bind(app));
	}
	else {
		app.ready();
	}
}
u._assetsLoaded = function(loader, resources) {
	var finalAssets = {};
	for (var key in resources) {
		if ( ! resources.hasOwnProperty(key)) {
			continue;
		}
		var resource = resources[key];
		if(key.match(/\//)) {
			key = key.replace(/.+\//, "");
		}
		if(key.indexOf('.') != -1) {
			key = key.split('.')[0];
		}
		finalAssets[key] = new PIXI.Sprite(resource.texture);
	}
	this.assets = finalAssets;
	this.ready();
}

