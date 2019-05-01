"use strict";

var modify; /* global modify: false */

function TrackCompletion(nav) {
	var o = modify(nav);
	o.GotoPage = function(number) {
		var ret = nav.GotoPage(number);
		if(ret && nav._lms) {
			nav._lms.SetValue("cmi.completion_status",
				(nav.GetVisitedRatio() == 1) ? "completed" : "incomplete");
			nav._lms.Commit();
		}
		return ret;
	};
	// And we note the existing completion of Nav
	if(nav._lms) {
		nav._lms.SetValue("cmi.completion_status",
			(nav.GetVisitedRatio() == 1) ? "completed" : "incomplete");
		nav._lms.Commit();
	}
	return o;
}

function TrackProgress(nav) {
	var o = modify(nav);
	o.GotoPage = function(number) {
		var ret = nav.GotoPage(number);
		if(ret && nav._lms) {
			nav._lms.SetValue("cmi.progress_measure", nav.GetVisitedRatio());
			nav._lms.Commit();
		}
		return ret;
	};
	// And we note existing progress of Nav 
	if(nav._lms) {
		nav._lms.SetValue("cmi.progress_measure", nav.GetVisitedRatio());
		nav._lms.Commit();
	}
	return o;
}

function AddHTMLInterface(nav,             navDivId,       prevEnabledImg,
                          prevDisabledImg, nextEnabledImg, nextDisabledImg,
                          pastTickImg,     presentTickImg, futureTickImg) {
	var o = modify(nav);
	var x;
	var navDiv = document.getElementById(navDivId);
	if(nav.NumPages() > 1 || nav._iss.CanExitBackward()) {
		x    = document.createElement("img");
		x.id = "prev";
		navDiv.appendChild(x);
	}
	if(nav.NumPages() > 1) { // A single page needs no navigation
		for(var i = 0; i < nav.NumPages(); i++) {
			x         = document.createElement("img");
			x.id      = "p"+i;
			x.onclick = (function(i) { return function() { 
				try { o.GotoPage(i); } catch(e) { nav._asyncErrHandler(e); }
			}; })(i);
			x.className = "tick";
			navDiv.appendChild(x);
		}
	}
	if(nav.NumPages() > 1 || nav._iss.CanExitForward()) {
		x    = document.createElement("img");
		x.id = "next";
		navDiv.appendChild(x);
	}

	///////////////////////////////////////////////////////////////////////

	o.UpdateInterface = function() {
		if(nav.NumPages() < 2) {
			return; // A single page needs no navigation
		}
		// Update "tick" marks
		for(var i = 0; i < nav.NumPages(); i++) {
			document.getElementById("p"+i).src =
				(nav._visited[i] ? pastTickImg : futureTickImg);
		}
		document.getElementById("p"+nav.CurrentPageNum()).src = presentTickImg;
		// Set the back/forward arrows' responsiveness
		var p = document.getElementById("prev");
		var n = document.getElementById("next");
		if(p) {
			if(nav.CurrentPageNum() > 0 || nav._iss.CanExitBackward()) {
				p.onclick   = function() {
					try { o.PrevPage(); } catch(e) { nav._asyncErrHandler(e); }
				};
				p.src       = prevEnabledImg;
				p.className = "enabled";
			} else {
				p.onclick   = null;
				p.src       = prevDisabledImg;
				p.className = "disabled";
			}
		}
		if(n) {
			if(nav.CurrentPageNum() < nav.NumPages() - 1 || nav._iss.CanExitForward()) {
				n.onclick   = function() {
					try { o.NextPage(); } catch(e) { nav._asyncErrHandler(e); }
				};
				n.src       = nextEnabledImg;
				n.className = "enabled";
			} else {
				n.onclick   = null;
				n.src       = nextDisabledImg;
				n.className = "disabled";
			}
		}
	};

	o.GotoPage = function(number) {
		if(nav.GotoPage(number)) {
			this.UpdateInterface();
			return true;
		}
		return false;
	};
	///////////////////////////////////////////////////////////////////////

	o.UpdateInterface();
	return o;
}
