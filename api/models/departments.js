var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DepartmentSchema = Schema (
    {
        department_code: {type: String, required:true, max:10},
        department_name: {type: String, required:true},
        faculty: {type: Schema.ObjectId, ref: 'Faculty', required: true},        
    }
);

// Virtual for dept's URL
DepartmentSchema
.virtual('url')
.get(function () {
  return '/api/department/' + this._id;
});

//Export model
module.exports = mongoose.model('Department', DepartmentSchema);
