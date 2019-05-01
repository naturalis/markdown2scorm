// ******************************************************************
//         This file controls the behavior of your SCO.
//           Read the description below each option.
// ******************************************************************

var SCO_title              = "My Course";
// The title-bar of the browser for the entire SCO

/////////////////////////////////////////////////////////////////////

var NAV_pages              = [];
// List of files to load as pages of this SCO, e.g.
// ['first.html', 'second.html']  These pages can be HTMLs or SWFs.

var NAV_trackProgress      = false;
// Set the progress measure of the SCO as the ratio
// of pages viewed to total pages. Progress will update as
// user moves through the navigation.

var NAV_trackCompletion    = false;
// Mark the SCO as complete when all pages have been seen,
// or incomplete if some haven't been seen.

var NAV_show               = true;
// Draw an HTML user interface for the navigation. If this is
// false, then no controls will be drawn, but your program can
// still draw its own interface and control the navigation itself.

var NAV_prevEnabledImg     = "../images/nav/prev_enabled.png";
var NAV_prevDisabledImg    = "../images/nav/prev_disabled.png";
var NAV_nextEnabledImg     = "../images/nav/next_enabled.png";
var NAV_nextDisabledImg    = "../images/nav/next_disabled.png";
var NAV_pastTickImg        = "../images/nav/past_tick.png";
var NAV_presentTickImg     = "../images/nav/present_tick.png";
var NAV_futureTickImg      = "../images/nav/future_tick.png";
// The images to use in the HTML navigation interface
// (if the interface is being used)

/////////////////////////////////////////////////////////////////////

var LMS_suspendOnExit      = true;
// Suspend the SCO upon termination so all session information
// will be retained during reentry. This makes most sense on an
// informational-type SCO; it makes more sense to set this false in
// a quiz SCO because each attempt should start fresh.

var LMS_trackSessionTime   = true;
// Records how many hours, minutes, seconds the user spends in the
// SCO.

/////////////////////////////////////////////////////////////////////

var DC_showConsoleIcon     = true;
// Draws a debugging icon to show if any errors have occurred during
// the current execution of the SCO. The icon, when clicked, will pop
// up the debug console. This is useful for developers, but should
// be disabled for the final release of the SCO.

var DC_popupErrors         = false;
// Pops up errors immediately without waiting for the console icon
// to be clicked.

var DC_errorImg            = "../images/icons/errors.png";
// The image to display by the console when errors are detected

/////////////////////////////////////////////////////////////////////

var ISS_noExitBeforeComplete = false;
// Prevents an inter-sco sequencing request from exiting forward or
// backward until the current SCO has been completed. Exiting forward
// typically happens when the user is viewing the last page of the
// SCO and then clicks the next button. If the content package is set
// up to allow flow, this will exit the current SCO and flow forward.

/////////////////////////////////////////////////////////////////////

var NAV_flashParams = {
	wmode:             "transparent", // Makes flash respect css z-index.
	allowScriptAccess: "always",
	swLiveConnect:     "true",
	quality:           "high",
	scale:             "scale",
	loop:              "false",
	salign:            "lt"
};
// If your SCO loads flash, it will do so with these parameters.
// If not, then you can erase them with no harm.

// Distributed with LibSCORM version 2.7
