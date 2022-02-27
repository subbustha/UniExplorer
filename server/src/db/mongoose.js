//MongoDB conncetion to the database server using mongoose
const mongoose=require('mongoose')
mongoose.connect(process.env.MONGO_CONNECT,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

module.exports=mongoose