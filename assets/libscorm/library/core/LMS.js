//////////////////////////////////////////////////////////////////////////////
// This library finds the DOM object API_1484_11 and wraps its API, throwing
// clear, detailed exceptions upon any error. This saves you from having to
// both constantly check for error codes and translate them when they appear.
//////////////////////////////////////////////////////////////////////////////

"use strict";

var LibScormException; /*global LibScormException: false */

function LMS(win) {
	this.Terminate = function() {
		this._wrap("Terminate", true, "");
		this._terminated = true;
	};

	this.IsTerminated = function() {
		return this._terminated;
	};

	this.GetValue = function(name) {
		return this._wrap("GetValue", false, name);
	};

	this.SetValue = function(name, value) {
		this._wrap("SetValue", true, name, value);
	};

	this.Commit = function() {
		this._wrap("Commit", true, "");
	};

	this.CentisecsToDuration = function(n) {
		n = Math.max(n,0); // there is no such thing as a negative duration
		var nCs = n, nY=0, nM=0, nD=0, nH=0, nMin=0, str = 'P';
		// Next set of operations uses whole seconds
		nCs = Math.round(nCs);
		nY = Math.floor(nCs / 3155760000);
		nCs -= nY * 3155760000;
		nM = Math.floor(nCs / 262980000);
		nCs -= nM * 262980000;
		nD = Math.floor(nCs / 8640000);
		nCs -= nD * 8640000;
		nH = Math.floor(nCs / 360000);
		nCs -= nH * 360000;
		nMin = Math.floor(nCs / 6000);
		nCs -= nMin * 6000;
		// Now we can construct string
		if (nY > 0) { str += nY + "Y"; }
		if (nM > 0) { str += nM + "M"; }
		if (nD > 0) { str += nD + "D"; }
		if ((nH > 0) || (nMin > 0) || (nCs > 0)) {
			str += "T";
			if (nH > 0)   { str += nH + "H"; }
			if (nMin > 0) { str += nMin + "M"; }
			if (nCs > 0)  { str += (nCs / 100) + "S"; }
		}
		if (str == "P") { str = "PT0H0M0S"; }
		// technically PT0S should do but SCORM test suite assumes longer form
		return str;
	};

	this.StartSessionTimer = function() {
		this._isTimePaused = false;
	};

	this.PauseSessionTimer = function() {
		this._isTimePaused = true;
	};

	this.RecordSessionTime = function() {
		this.SetValue("cmi.session_time", this.CentisecsToDuration(this._time));
	};

	//////////////////////////////////////////////////////////////////////////////
	//                              DISCOURAGED STUFF
	// You won't need these error info methods. Rely on exception handling in
	// JavaScript SCOs. The methods are included only for Flash SCOs (which
	// can't catch exceptions).
	//////////////////////////////////////////////////////////////////////////////

	this.GetLastError = function() {
		return this._api.GetLastError();
	};

	this.GetDiagnostic = function(errorCode) {
		return this._api.GetDiagnostic(errorCode);
	};

	this.GetErrorString = function(errorCode) {
		return this._api.GetErrorString(errorCode);
	};

	//////////////////////////////////////////////////////////////////////////////
	//                               PRIVATE STUFF
	//////////////////////////////////////////////////////////////////////////////

	// _wrap passes along any extra arguments
	this._wrap = function(func, isBoolean) {
		if(this.IsTerminated()) {
			return false;
		}
		var args = [];
		for(var i = 2; i < arguments.length; i++) {
			// These arguments will appear in an eval, so we MUST
			// escape them since we're wrapping them in another quote layer
			args.push((typeof arguments[i] == 'string') ?
				'"' + this._quoteString(arguments[i]) + '"' :
				arguments[i]);
		}
		// You may wonder, "Why not simply use this._api[func].apply(...)?"
		// Certainly we wouldn't have to mess with quoting the arguments, etc.
		// The answer is that LiveConnect does not offer us a real object
		// with function members, e.g. typeof this._api["Initialize"] == undefined
		var result = eval('this._api.' + func + '(' + args.join(',') + ');');

		// boolean functions afford us an optimization: if the function returns
		// true then we needn't GetLastError (another costly call to the LMS)
		if(!isBoolean || result != "true") {
			var err = this._api.GetLastError();
			if(err != 0) {
				throw new LibScormException(
					err,
					'LMS::' + func + '(' + args.join(',') + ')',
					this._api.GetErrorString(err),
					this._api.GetDiagnostic(err));
			}
		}
		return result;
	};

	this._quoteString = function(str) {
		str = str.replace(/(["'\\])/g,'\\$1');
		str = str.replace(/\x0D/g,"\\r");
		str = str.replace(/\x0A/g,"\\n");
		return str;
	};

	// _getAPI and _scanForAPI functions adapted from
	// http://www.ostyn.com/standards/scorm/samples/api_discovery_ff_issue.htm

	this._getAPI = function(win) {
		try {
			var ret = this._scanParentsForAPI(win);
			return ret ? ret : this._scanParentsForAPI(win.opener);
		} catch(e) {
			return null;
		}
	};

	this._scanParentsForAPI = function(win) {
		var api;
		do {
			api = win.API_1484_11 || null;
			if (win.parent === null || win.parent == win) {
				break;
			}
			win = win.parent;
		} while (!api);
		return api;
	};


	///// INITIALIZE /////////////////////////////////////////////////////////////

	this._time         = 0;
	this._isTimePaused = true;
	this._terminated   = false;
	this._api          = this._getAPI(win);
	if(this._api === null) {
		throw new LibScormException(
			-1, "LMS::LMS",
			"The SCORM API is not available.",
			"This SCO might not be running within an LMS environment.");
	}
	this._wrap("Initialize", true, "");

	var self = this;
	setInterval(function(){ if(!self._isTimePaused) { self._time+=100; } }, 1000);
}
