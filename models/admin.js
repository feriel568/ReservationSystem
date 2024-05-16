
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const adminSchema =new mongoose.Schema({
    email : {type:String},
    Username:{type:String,unique:true},
    password:String
})

adminSchema.pre('save',async function(next){//kol mefeme await feme async(fonction non syncronosé te5ou w9t)
    const user=this;
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,10)//10 hia 9owet salt
    }
    next();
})

adminSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password) ;
};
const Admin=mongoose.model('Admin',adminSchema)
module.exports=Admin;