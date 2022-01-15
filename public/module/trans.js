const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bank',{useNewUrlParser:true});
var conn = mongoose.connection;

var tsschema = new mongoose.Schema({
    id:String,
    date:Date,
    name:{type:String,require:true},
    ano:{type:Number},
    tstype:String,
    amount:Number,
    bal:Number,

});
var tsModel = mongoose.model('transactions',tsschema);

module.exports=tsModel;