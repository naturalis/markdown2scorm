// Examples of CMI bags: objectives and interactions. This code abstracts the
// array implementation details, and minimizes SCORM calls by caching.

"use strict";

var LibScormException; /* global LibScormException: false */

function CMIBag(lms, bagname, base) {
	this._lms      = lms;
	this._bag      = bagname;
	this._base     = base || 'cmi';
	this._cacheId  = {};
	this._cacheVal = {};
	this._cacheN   = -1;
	this._lastSeek = 0;

	this.GetValue = function(id, elem) {
		var i = this.GetIndex(id);
		if(i == -1) {
			throw new LibScormException(-1, "this.:GetElement",
				"Identifier '" + id + "' not found in collection '" +
				this._base + '.' + this._bag + "'.", "");
		}
		if(typeof this._cacheVal[id + '.' + elem] == "undefined") {
			this._cacheVal[id + '.' + elem] = this._lms.GetValue([this._base, this._bag, i, elem].join("."));
		}
		return this._cacheVal[id + '.' + elem];
	};

	this.SetValue = function(id, elem, val) {
		if(typeof this._cacheVal[id + '.' + elem] != "undefined" &&  this._cacheVal[id + '.' + elem] == val) {
			return;
		}
		var i = this.GetIndex(id);
		if(i == -1) {
			i = this._addId(id);
		}
		try {
			this._lms.SetValue([this._base, this._bag, i, elem].join("."), val);
			this._cacheVal[id + '.' + elem] = val;
		} catch(e) {
			throw e;
		}
	};

	this.GetElementList = function() {
		var ret = new Array(this._getCount());
		for(var i = 0; i < this._getCount(); i++) {
			ret[i] = this._lms.GetValue([this._base, this._bag, i, "id"].join("."));
		}
		return ret;
	};

	this.GetIndex = function(id) {
		if(typeof this._cacheId[id] != "undefined") {
			return this._cacheId[id];
		}
		for( ; this._lastSeek < this._getCount(); this._lastSeek++) {
			var x = this._lms.GetValue([this._base, this._bag, this._lastSeek, "id"].join("."));
			this._cacheId[x] = this._lastSeek;
			if(x == id) {
				return this._lastSeek;
			}
		}
		return -1;
	};

	this._getCount = function() {
		if(this._cacheN < 0) {
			this._cacheN = this._lms.GetValue([this._base, this._bag, "_count"].join("."));
		}
		return this._cacheN;
	};

	this._addId = function(id) {
		this._lms.SetValue([this._base, this._bag, this._getCount(), "id"].join("."), id);
		this._cacheId[id] = this._getCount();
		return this._cacheN++;
	};
}
