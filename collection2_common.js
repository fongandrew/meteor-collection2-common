// Define global var outside of strict mode
CommonFields = {};

(function() {
  'use strict';

  // Helper function for use in autoValues that returns defaultValue if and
  // and only if object is being inserted (whether as a stand-alone document or
  // as an embedded document in an array)
  // Takes the "this" from an autoValue function and a defaultValue.
  CommonFields.setIfNew = function(self, defaultValue) {
    if (self.isSet) return;
    if (self.operator === '$pull') return;
    if (self.isInsert || self.operator === '$push') {
      return defaultValue;
    } else if (self.isUpsert) {
      return {$setOnInsert: defaultValue};
    }
  };

  // Like setIfNew -- but unsets if not part of a new object
  CommonFields.setOnlyIfNew = function(self, defaultValue) {
    if (self.operator === '$pull') return;
    if (self.isInsert || self.operator === '$push') {
      if (!self.isSet) {
        return defaultValue;
      }
    } else if (self.isUpsert) {
      if (!self.isSet) {
        return {$setOnInsert: defaultValue};
      }
    } else if (self.isSet) {
      self.unset();
    }
  };

  CommonFields.autoId = function(attrs) {
    return _.extend({
      type: String,
      autoValue: function() { // autoID should only be set at creation
        return CommonFields.setOnlyIfNew(this, Random.id(17));
      }
    }, attrs || {});
  };

  CommonFields.idField = function(attrs, length) {
    length = length || 17;
    return _.extend({
      type: String,
      min: length,
      max: length
    }, attrs || {});
  };

  // When was this document created?
  CommonFields.createdOn = function(attrs) {
    return _.extend({
      type: Date,
      autoValue: function() { // createdOn date is only set once
        return CommonFields.setOnlyIfNew(this, new Date());
      }
    }, attrs || {});
  };

  // When was this document last updated?
  CommonFields.updatedOn = function(attrs) {
    return _.extend({
      type: Date,
      autoValue: function() { // updatedOn is set every time
        return new Date();
      }
    }, attrs || {});
  };

  // An update verifier that adds a new random number every time a field is
  // updated -- useful
  CommonFields.stateVerifier = function(attrs) {
    return _.extend({
      type: String,
      autoValue: function() {
        return Random.id(17)
      }
    }, attrs || {});
  };

  // Is this document active?
  CommonFields.isActive = function(attrs) {
    return _.extend({
      type: Boolean,
      autoValue: function() {
        if (!this.isSet) {  // This has the effect of setting isActive = true
          return true;      // even on updates -- which is intended behavior
        }

        // Set to null or undefined to cancel above behavior
        else if (this.value === null || this.value === undefined) {
          this.unset();
        }
      }
    }, attrs || {});
  };

  // Sets a default bool at creation and no other time
  CommonFields.autoBool = function(defaultValue, attrs) {
    return _.extend({
      type: Boolean,
      autoValue: function() {
        return CommonFields.setIfNew(this, defaultValue);
      }
    }, attrs || {});
  };

  // A decimal used for rational number sorting
  CommonFields.rank = function(attrs) {
    return _.extend({
      type: Number,
      decimal: true, // Because of rank averaging algorithm

      // Autovalue uses milliseconds since epoch since it has the nice property
      // of being naturally incrementing
      autoValue: function() {
        var d = new Date();
        return CommonFields.setIfNew(this, d.getTime());
      }
    }, attrs || {});
  };

  // An auto-incrementing number on each update (starts @ 1, not 0) -- you can
  // disable by passing an explicitly falsey value. Field will not increment
  // but stay at whatever it previously was.
  CommonFields.autoInc = function(attrs) {
    return _.extend({
      type: Number,
      autoValue: function() {
        if (this.isSet && !this.value) {
          this.unset();
          return;
        }
        var ret = CommonFields.setIfNew(this, 1);
        if (ret === 1) {
          return ret;
        }
        return {$inc: 1};
      }
    }, attrs || {});
  }
})();
