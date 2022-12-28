const express=require('express');
const router=express.Router();
const Author=require('../models/author')

// all authors 

router.get('/',(req,res)=>{
    res.render('authors/index')
})

// new authors

router.get('/new',(req,res)=>{
    res.render('authors/new',{author:new Author()})
})

//create author route

router.post('/',(req,res)=>{
    const author=new Author({
        name: req.body.name
    })
    author.save((err, newAuthor)=>{
        if(err){
            res.render('authors/new',{
                author:author,
                errorMessage:'error creating author'
            })
        }
        else{
            // res.redirect(`authors/${newAuthor.id}`)
             res.redirect('authors')
         }
    })
})

module.exports = router