var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CourseSchema = Schema (
    {
        course_code: {type: String, required:true, max:10},
        course_name: {type: String, required:true},
        department: {type: Schema.ObjectId, ref: 'Department', required: true},        
    }
);

// Virtual for course's URL
CourseSchema
.virtual('url')
.get(function () {
  return '/api/course/' + this._id;
});

//Export model
module.exports = mongoose.model('Course', CourseSchema);
