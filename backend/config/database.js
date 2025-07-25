<<<<<<< HEAD
var mongoose=require('mongoose')

function database(){
    mongoose.connect("mongodb://0.0.0.0:27017/evmap")
    .then(()=>{
        console.log("successfull");})
    .catch(err=>{
        console.log(err);   
    })
}
=======
var mongoose=require('mongoose')

function database(){
    mongoose.connect("mongodb://0.0.0.0:27017/evmap")
    .then(()=>{
        console.log("successfull");})
    .catch(err=>{
        console.log(err);   
    })
}
>>>>>>> 7e53bc75fe70b0ea731176fb4678a1049314690a
module.exports=database