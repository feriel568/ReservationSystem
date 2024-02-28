//create model of user document
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userShema =new mongoose.Schema({
    Username:{type:String,unique:true},
    password:String
})

userShema.pre('save',async function(next){//kol mefeme await feme async(fonction non syncronosé te5ou w9t)
    const user=this;
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,10)//10 hia 9owet salt
    }
    next();
})
const User=mongoose.model('User',userShema)
module.exports=User;