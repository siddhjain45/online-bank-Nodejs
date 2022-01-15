const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bank',{useNewUrlParser:true});
var conn = mongoose.connection;

var userschema = new mongoose.Schema({
    name:{type:String,require:true},
    mobile : {type:Number,require:true},
    email:{type:String,require:true},
    adhar : {type:Number,require:true,unique:true},
    ano:{type:Number,require:true,unique:true},
    type:{type:String,require:true},
    bal:{type:Number,require:true},
    pin:{type:Number,require:true,unique:true},

});
 var userModel = mongoose.model('user',userschema);
  module.exports=userModel;
