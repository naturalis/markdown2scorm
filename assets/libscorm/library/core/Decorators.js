"use strict";

// Parasitic inheritence ala Douglas Crockford
function modify(p) {
	function F(){}
	F.prototype = p;
	return new F();
}

function NoExitBeforeComplete(iss) {
	var o = modify(iss);
	o.CanExitForward = function() {
		return iss._lms &&
		       (iss._lms.GetValue("cmi.completion_status") == "completed") &&
		       iss.CanExitForward();
	};
	o.CanExitBackward = function() {
		return iss._lms &&
		       (iss._lms.GetValue("cmi.completion_status") == "completed") &&
		       iss.CanExitBackward();
	};
	return o;
}

