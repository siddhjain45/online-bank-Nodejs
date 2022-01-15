const express = require('express');
const app = express();
const body = require('body-parser');
var userModel = require('./public/module/user')
var tsModel = require('./public/module/trans')
app.use(express.static('public'));
app.set('view engine','ejs');
app.set('views',__dirname+'/public/views')

app.use( body.urlencoded({extended:false}));
app.use(body.json())

/*    Routers method of various routing    */
app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/views/Home.html')
})
app.get('/home',function(req,res){
    res.sendFile(__dirname+'/public/views/Home.html')

})
app.get('/admin',function(req,res){
    res.render('admin_login',{err:0})
})

app.get('/user',function(req,res){
    res.render('user_login')
})
app.get('/logout',function(req,res){
    res.redirect('/');
})
app.get('/add_user',function(req,res){
   res.render('add_user',{suc:0})
})

app.get('/user_details',function(req,res){
    var userdetail = userModel.find({});
    userdetail.exec(function(err,data){
        if(err) throw err;
        res.render('user_details',{records:data,delete:0})
    });
});

app.get('/delete/:id',async function(req,res){
  var id = req.params.id;
  userModel.findByIdAndRemove({_id:id},(err)=>{
      if(err) throw err;
      var userdetail = userModel.find({});
      userdetail.exec(function(err,data){
          if(err) throw err;
        //  res.render('user_details',{records:data,delete:1})
        res.redirect('/user_details');
      });
      
  });
})

app.get('/view/:id',function(req,res){
   var id = req.params.id;
   userModel.findOne({_id:id},function(err,data){
       if(err) throw err;
       res.render('view_account',{records:data});
   })

})
app.get('/deposit/:id',function(req,res){
    var id = req.params.id;
    userModel.findOne({_id:id},function(err,data){
        if(err) throw err;
        res.render('deposit',{records:data,suc:0});
    })
});

app.post('/depositamount',function(req,res){
    var id = req.body.id;
    var amount = parseInt(req.body.amount);
    userModel.findOne({_id:id},(err,data)=>{
        if(err) throw err;
        var bal = data.bal;
       var updbal = bal+amount;
       var upduser = userModel.findByIdAndUpdate(data._id,{
           bal:updbal,
       });
       upduser.exec((err,data1)=>{
           if(err) throw err;
           var trans = new  tsModel({
               id:data1._id,
               date:Date.now(),
               name:data1.name,
               ano:data1.ano,
               tstype:'deposite',
               amount:amount,
               bal:updbal,
           })
           trans.save((err)=>{ 
               if(err) throw err;
           res.render('deposit',{records:data1,suc:1})
           })
       })


    })
});

app.get('/withdraw/:id',function(req,res){
    var id = req.params.id;
    userModel.findOne({_id:id},function(err,data){
        if(err) throw err;
        res.render('withdrwal',{records:data,suc:0,limit:0});
    })

});

app.post('/withdrawamount',function(req,res){
    var id = req.body.id;
    var amount = parseInt(req.body.amount);
    userModel.findOne({_id:id},(err,data)=>{
        if(err) throw err;
        var bal = data.bal;
       if(bal<amount)
       {
        res.render('withdrwal',{records:data,suc:0,limit:1});
       }
       else{ 
           var updbal = bal-amount;
       var upduser = userModel.findByIdAndUpdate(data._id,{
           bal:updbal,
       
       });
       upduser.exec((err,data1)=>{
        if(err) throw err;
        var trans = new  tsModel({
            id:data1._id,
            date:Date.now(),
            name:data1.name,
            ano:data1.ano,
            tstype:'withdraw',
            amount:amount,
            bal:updbal,
        })
       trans.save(function(err){
           if(err) throw err;
           res.render('withdrwal',{records:data1,suc:1,limit:0});
       })
        

    })

    }
   });
});

app.get('/transfer/:id',function(req,res){
    var id = req.params.id;
    userModel.findOne({_id:id},function(err,data){
        if(err) throw err;
        res.render('transfer',{records:data,suc:0,limit:0});
    })

});

app.post('/transferamount',function(req,res){
    var id = req.body.id;
    var recano = req.body.recano;
    var bank = req.body.bank;
    var ifsc = req.body.ifsc;
    var amount = parseInt(req.body.amount);
    userModel.findOne({_id:id},(err,data)=>{
        if(err) throw err;
        var bal = data.bal;
       if(bal<amount)
       {
        res.render('transfer',{records:data,suc:0,limit:1});
       }
       else{ 
           var updbal = bal-amount;
       var upduser = userModel.findByIdAndUpdate(data._id,{
           bal:updbal,
       
       });
       upduser.exec((err,data1)=>{
        if(err) throw err;
        var trans = new  tsModel({
            id:data1._id,
            date:Date.now(),
            name:data1.name,
            ano:data1.ano,
            tstype:'transfer',
            amount:amount,
            bal:updbal,
        })
       trans.save(function(err){
           if(err) throw err;
           res.render('transfer_success',{records:data1,suc:1,recano:recano,bank:bank,ifsc:ifsc,amount:amount});
       })
        

    })

    }
   });



});
app.get('/history/:id',function(req,res){
    var id = req.params.id;
    var transactions = tsModel.find({id:id});
    transactions.exec((err,data)=>{
        if(err) throw err;
        userModel.findOne({_id:id},function(err,data1){
            if(err) throw err;
            
            res.render('transaction',{data:data,records:data1});
        })
    
        
    })
})
app.post('/adminlogin',function(req,res){
    var uname = req.body.uname;
    var pass = req.body.pass;
    if(uname=="siddharth" && pass=="sidd123")
    {
      res.render('admin_home')
    }
    else{
        res.render('admin_login',{err:1})
    }
})

app.post('/adduser',function(req,res){
    var user = new userModel({
        name:req.body.name,
        mobile : req.body.mno,
        email:req.body.email,
        adhar :req.body.adhar,
        ano:req.body.ano,
        type:req.body.type,
        bal:req.body.bal,
        pin:req.body.pin,
    
    });
    user.save((err)=>{
        if(err) throw err;
        res.render('add_user',{suc:1})
    })
   
});

app.post('/userlogin',async function(req,res){
    
   var user = userModel.findOne({ano:req.body.ano });
   
 
       user.exec((err,data)=>{
       if(err) throw err;
       
      if(req.body.pin==data.pin)
       res.render('user_home',{records:data})
       else
       res.redirect('/');

     
       })
    
 
    
   
});


app.listen(1011,console.log('server port 1011'))