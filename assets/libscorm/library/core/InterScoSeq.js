"use strict";

function InterScoSeq(lms, onBeforeTerminate) {
	this._lms               = lms;
	this._onBeforeTerminate = onBeforeTerminate;

	////////////////////// QUERIES ////////////////////////
	this.CanExitForward = function() {
		return this._canDo("continue");
	};
	this.CanExitBackward = function() {
		return this._canDo("previous");
	};
	this.CanExitChoice = function(target) {
		return this._canDo("choice.{target=" + target + "}");
	};

	////////////////////// COMMANDS ////////////////////////
	this.ExitForward = function() {
		return this._do("continue");
	};
	this.ExitBackward = function() {
		return this._do("previous");
	};
	this.ExitChoice = function(target) {
		return this._do("{target = " + target + "}choice");
	};
	this.ExitAll = function() {
		return this._do("exitAll");
	};

	////////////////////// PRIVATE  ////////////////////////
	this._canDo = function(req) {
		if(this._lms) {
			if(req == "exitAll") {
				return true;
			}
			try {
				return this._lms.GetValue('adl.nav.request_valid.' + req) == "true";
			} catch(e) {
				if(e.code != 401) { // something other than simple non-support
						    // for inter-sco sequencing
					throw e;
				}
			}
		}
		return false;
	};

	this._do = function(req) {
		if(!this._canDo(req)) {
			return false;
		}
		this._onBeforeTerminate();
		this._lms.SetValue("adl.nav.request", req);
		this._lms.Terminate();
		return true;
	};
}
