var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FacultySchema = Schema (
    {
        faculty_code: {type:String, required:true},
        faculty_name: {type: String, required:true, max:10},
        
    }
);

// Virtual for faculty's URL
FacultySchema
.virtual('url')
.get(function () {
  return '/api/faculty/' + this._id;
});

//Export model
module.exports = mongoose.model('Faculty', FacultySchema);
