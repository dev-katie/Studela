var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ResourceSchema = Schema (
    {
        resource_name: {type: String, required:true},
        resource_desc: {type: String, required:true},
        resource_details: {type: String, required:true},
        course: {type: Schema.ObjectId, ref: 'Course', required: true},      
        dateAdded: {type: Date, required:true, 'default':Date.now()},
    }
);

// Virtual for resource's URL
ResourceSchema
.virtual('url')
.get(function () {
  return '/api/resource/' + this._id;
});

//Export model
module.exports = mongoose.model('Resource', ResourceSchema);
