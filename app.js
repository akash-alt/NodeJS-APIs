const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
// mongoose used for the connecting database(mongoDB)
mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser:true});
// this is type checking for connecting database
const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article",articleSchema)

/////////////////////////////////// Request Targeting App Articles //////////////////


// this chained method
app.route("/articles")

.get((req,res)=>{
    Article.find((err,foundArticles)=>{
        // console.log(foundArticles)
        if(!err){
          res.send(foundArticles)
        }else{
          res.send(err)
        }        
    })
}
)
.post((req,res)=>{
    console.log()
    console.log()
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save((err)=>{
        if(!err){
          res.send("successfully added new article")
        }else{
          res.send(err)
        }
    })
}
)
.delete((req,res)=>{
    Article.deleteMany(function(err){
      if(!err){
        res.send("successfully delete new article")
      }
      else{
          res.send(err)
      }
    })
  }
)

/////////////////////////////// Request Targeting specific Articles //////////////////
// localhost: 3000/articles/Jack-Bauer

app.route("/articles/:articleTitle")

// finding the values
.get((req,res)=>{
  Article.findOne(
    { title: req.params.articleTitle}
    ,(err,foundArticles)=>{
    if(foundArticles){
      res.send(foundArticles)
    } else {
      res.send(" No Articles matching that title was found")
    }
  })
})

// updating the values
.put((req,res)=>{
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title , content: req.body.content},
    {overwrite: true},
    (err)=>{
      if(!err){
        res.send("successfully update article!")
      }
    }
  )
})

.patch((req,res)=>{
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title , content: req.body.content},
    {overwrite: true},
    (err)=>{
      if(!err){
        res.send("successfully update article!")
      }else{
        res.send("err")
      }
    }
  )
})
.delete((req,res)=>{
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("successfully update article!")  
      }else{
        res.send(err)  
      }
           
    }
  )
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// notes//
// chained method will start with dot(.) 
// this is used for getting articles value
// app.get("/articles",)

// // POST method
// app.post("/articles",)

// // DELETE method
// app.delete("/articles",)

//* put *//
// "put"... method used for the updating the values 