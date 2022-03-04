const express=require('express')
const mongoose=require('mongoose')
const bcript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Data } = require('./Model')
const auth = require('./middleware/auth')
const url='mongodb://localhost:27017/mobileDB'
const App=express()



mongoose.connect(url).then(()=>{
    console.log('successfully connected..........');
}).catch(()=>{
    console.log('not connected yed.........');
})
App.use(express.json())


// get data
App.get('/getUsers', auth , async(req,res)=>{
    const user = await Data.find();
    if(!user) return res.status(404).send('No user data found')
    res.status(200).send({error:false,message:'userdata fetched successfully',response:user})
})



// post data Register
App.post('/postRegister', async(req,res)=>{

    const user = await Data.findOne({email:req.body.email});
    if(user) return res.status(400).send('user already exists');

     newUser =new Data({
        email:req.body.email,
        name:req.body.name,
        password:req.body.password
    });

    const salt = await bcript.genSalt(10);
    newUser.password = await bcript.hash(newUser.password,salt);

    const securedUser = await newUser.save();

  const token = jwt.sign({_id:newUser._id},'jwtPrivateKey',{expiresIn : "180s"});
  res.header('x-auth-token',token).send(securedUser)

})

// post data Login
App.post('/postLogin', async(req,res)=>{

    const user = await Data.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Invalid email & password');

    const pswdVerify = await bcript.compare(req.body.password,user.password)
    if(!pswdVerify) return res.status(400).send('Invalid Password & email')

    const loginUser = new Data({
        email:req.body.email,
        password:req.body.password
    });
    const token = jwt.sign({_id:user._id},'jwtPrivateKey',{expiresIn:'180s'})
    res.send({error:false,message:'user login success',response:loginUser,token:token})

})


// delete data
App.delete('/deleteUser/:_id', async (req,res)=>{
    Data.findByIdAndRemove(req.params._id, function (err, docs){
        if(err){
         res.send({err:true,message:err.message})
        }
         else 
          res.send({error:false,message:"deleted successfully!!!",Result:docs})
    });

})

App.listen(5000, ()=>{
    console.log('5000 port is running...........');
})