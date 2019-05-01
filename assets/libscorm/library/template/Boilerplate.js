"use strict";

/*jslint browser: true */
/*global window: false */

// Variables available to content pages
var dc;                       /*global dc: true */
var lms;                      /*global lm: true */
var iss;                      /*global is: true */
var nav;                      /*global na: true */
var objectives;               /*global objective: true */
var interactions;             /*global interaction: true */
var shared;                   /*global shared: true */

// Uses library classes
var DebugConsole;             /*global DebugConsole: false */
var CMIBag;                   /*global CMIBag: false */
var LMS;                      /*global LMS: false */
var InterScoSeq;              /*global InterScoSeq: false */
var Nav;                      /*global Nav: false */

// Controlled by
var SCO_title;                /*global SCO_title: false */
var DC_popupErrors;           /*global DC_popupErrors: false */
var DC_showConsoleIcon;       /*global DC_showConsoleIcon: false */
var DC_errorImg;              /*global DC_errorImg: false */
var LMS_suspendOnExit;        /*global LMS_suspendOnExit: false */
var LMS_trackSessionTime;     /*global LMS_trackSessionTime: false */
var ISS_noExitBeforeComplete; /*global ISS_noExitBeforeComplete: false */
var NAV_pages;                /*global NAV_pages: false */
var NAV_flashParams;          /*global NAV_flashParams: false */
var NAV_show;                 /*global NAV_show: false */
var NAV_prevEnabledImg;       /*global NAV_prevEnabledImg: false */
var NAV_prevDisabledImg;      /*global NAV_prevDisabledImg: false */
var NAV_nextEnabledImg;       /*global NAV_nextEnabledImg: false */
var NAV_nextDisabledImg;      /*global NAV_nextDisabledImg: false */
var NAV_pastTickImg;          /*global NAV_pastTickImg: false */
var NAV_presentTickImg;       /*global NAV_presentTickImg: false */
var NAV_futureTickImg;        /*global NAV_futureTickImg: false */
var NAV_trackProgress;        /*global NAV_trackProgress: false */
var NAV_trackCompletion;      /*global NAV_trackCompletion: false */

// Decorators that can be used
var TrackProgress;            /*global TrackProgress: false */
var TrackCompletion;          /*global TrackCompletion: false */
var NoExitBeforeComplete;     /*global NoExitBeforeComplete: false */
var AddHTMLInterface;         /*global AddHTMLInterface: false */

function boilerplate_handleException(e) {
	dc.Error(e.toString());
	try {
		if(typeof(e.description) != "undefined") { // extra IE info
			dc.Error(e.description);
		}
	} catch(f) {}
	if(DC_popupErrors) {
		dc.Show();
	}
}

function boilerplate_beforeTerminate() {
	if(lms) {
		if(LMS_suspendOnExit) {
			nav.SaveLocation();
		}
		if(LMS_trackSessionTime) {
			lms.RecordSessionTime();
		}
		lms.SetValue("cmi.exit", LMS_suspendOnExit ? "suspend" : "normal");
	}
}

function boilerplate_unload() {
	try {
		boilerplate_beforeTerminate();
		if(lms) {
			lms.Terminate();
		}
	} catch(e) {
		boilerplate_handleException(e);
	}
}

function boilerplate_load() {
	dc = new DebugConsole(DC_showConsoleIcon ?
		document.getElementById('debug') :
		null,
	        true, DC_errorImg);
	try {
		lms = new LMS(window);
		if(LMS_trackSessionTime) {
			lms.StartSessionTimer();
		}
		objectives   = new CMIBag(lms, "objectives");
		interactions = new CMIBag(lms, "interactions");
		shared       = new CMIBag(lms, "data", "adl");
	} catch(e) {
		boilerplate_handleException(e);
	}

	document.title = SCO_title;

	// The show can go on even if the LMS fails to connect, and we can show the
	// content offline. Hence a separate try...catch to construct the navigation.
	try {
		iss = new InterScoSeq(lms, boilerplate_beforeTerminate);
		if(ISS_noExitBeforeComplete) {
			iss = NoExitBeforeComplete(iss);
		}
		nav = new Nav(NAV_pages, 'content', lms, iss, boilerplate_handleException,
			window.NAV_flashParams === undefined ? {} : NAV_flashParams);
		if(NAV_show) {
			nav = AddHTMLInterface(nav, "nav", NAV_prevEnabledImg,
				NAV_prevDisabledImg, NAV_nextEnabledImg, NAV_nextDisabledImg,
				NAV_pastTickImg, NAV_presentTickImg, NAV_futureTickImg);
		}
		if(NAV_trackCompletion) {
			nav = TrackCompletion(nav);
		}
		if(NAV_trackProgress) {
			nav = TrackProgress(nav);
		}
	} catch(f) {
		boilerplate_handleException(f);
	}
}
