# meteor-collection2-common
Some simple reusable schema definitions for aldeed:collection2 / 
aldeed:simple-schema.

Installation
------------
`meteor add fongandrew:collection2-common`

Fields
------
In the list below, `attrs` param is an object containing additional keys to add
to our field definition.

`CommonFields.autoId(attrs)` - Field which automatically populates
with a 17-character Meteor-style random _id.

`CommonFields.idField(attrs, length)` - Field for validating a Meteor-style 
_id. Length defaults to 17 characters.

`CommonFields.createdOn(attrs)` - Timestamp for document creation

`CommonFields.updatedOn(attrs)` - Timestamp for document update

`CommonFields.stateVerifier(attrs)` - Random string for each time field is 
updated,  useful for ensuring that we don't clobber something we don't intend 
to because of Mongo's lack of built-in transactions

`CommonFields.isActive(attrs)` - Boolean that gets set to true every time
this document is updated.

`CommonFields.autoBool(defaultValue, attrs)` - Sets a default bool at creation 
and no other time

`CommonFields.rank(attrs)` - Generates an autoValue decimal number based on the 
current time. Useful if you want a modifiable "rank" for sorting purposes that's
loosely tied to creation time.

`CommonFields.autoInc(attrs)` - An auto-incrementing number on each update 
(starts @ 1, not 0) -- you can disable by passing an explicitly falsey value. 
Field will not increment but stay at whatever it previously was.
