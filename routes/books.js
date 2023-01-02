const express=require('express')
const router=express.Router()
const Book=require('../models/book')
const Author=require('../models/author')
const multer=require('multer')
const path=require('path')
const fs=require('fs')
const uploadPath=path.join('public',Book.coverImageBasePath)

const upload=multer({
    dest:uploadPath
})

// All book route
router.get('/',async (req,res)=>{
    const searchOptions={}
    try{
        const books=await Book.find({})
        res.render('books/index',{
            books:books,
            searchOptions:req.query
        })
    }
    catch{
        res.redirect('/')
    }   
})
// New book route

router.get('/new',async (req,res)=>{
     renderNewPage(res,new Book())
})

// Create book route 
router.post('/',upload.single('cover'),async (req,res)=>{

    const filename=req.file!=null?req.file.filename:null
    const book=new Book({
        title:req.body.title,
        author:req.body.author,
        publishDate:new Date(req.body.publishDate),
        pageCount:req.body.pageCount,
        coverImageName:filename,
        description:req.body.description
    })
    try{
        const newBook=await book.save();
        //res.redirect(`books/${newBook.id}`)
        res.redirect('books')

    }catch{
        console.log('error saving')
        if(book.coverImageName!=null){
            removeImageCover(book.coverImageName)
        }
        renderNewPage(res,book,true)
    }

})
function removeImageCover(filename){
    fs.unlink(path.join(uploadPath,filename),(err=>{
        if(err)console.error(err)
    }))
}
async function renderNewPage(res,book,hasError=false){
    try{
        const authors=await Author.find({})
        const params={
            authors:authors
            ,book:book
        }
        if(hasError)params.errorMessage='Error new book'
        res.render('books/new',params)
        
    }catch{
        console.log('error rendering new page')
        res.redirect('books')
    }
}
module.exports=router