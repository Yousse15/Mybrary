const mongoose=require('mongoose')
const book=require('./book')

const authorSchema=new mongoose.Schema({
   name:{
      type: String,
      required: true
   }
})

authorSchema.pre('remove',function(next){
  book.find({author:this.id},(err,books)=>{
   if(err)next(err)
   else if(books.length>0)next(new Error('there is books attached to this author'))
   else next()
  })
})



module.exports=mongoose.model('Author',authorSchema)