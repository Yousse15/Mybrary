const express=require('express');
const router=express.Router();
const Author=require('../models/author')

// all authors 

router.get('/',async (req,res)=>{
    let searchOptions={}
    if(req.query.name!=null && req.query.name!=='' ){
        searchOptions.name=new  RegExp(req.query.name,'i')
    }
    try{
        const authors=await Author.find(searchOptions)
        res.render('authors/index',{
            authors:authors,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }
    
})

// new authors

router.get('/new',(req,res)=>{
    res.render('authors/new',{ author:new Author() })
})

//create author route

router.post('/',async (req,res)=>{
    console.log("Create") 
    const author=new Author({
        name:req.body.name
    })
    try{
        const newAuthor=await author.save();
        //res.redirect(`authors/${newAuthor.id}`)
        console.log('create success')
        res.status(201).redirect('authors')

    }catch{
        console.log('no name')
            res.status(400).render('authors/new',{
                author:author,
                errorMessage:"Error Creating the Author"
            })
    }

})

module.exports = router