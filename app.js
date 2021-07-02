//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

const url = 'mongodb://127.0.0.1:27017/wikiDB';
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
 });

const articleSchema=new mongoose.Schema({
  title:String,
  content:String
});

const Article = mongoose.model("Article",articleSchema);

app.route("/articles").
get((req,res)=>{
  Article.find((err,foundArticles)=>{
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
}).
post((req,res)=>{
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save((err)=>{
    if(!err){
      res.send("done");
    }else{res.send(err);
    }
  });
}).
delete((req,res)=>{
    Article.deleteMany((err)=>{
      if(!err){res.send("deleted all");}
      else{res.send(err);}
    });
});
app.route("articles/:articleTitle")
.get((req,res)=>{
  Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
    if(foundArticle)
      res.send(foundArticle);
    else
      res.send("cant find matching article");
  });
}).
put((req,res)=>{
  Article.update(
  {title:req.params.articleTitle},
  {title:req.body.title, content:req.body.content},
  {overwrite:true},
  (err)=>{
    if(!err)
      res.send("update successfully");
    else
      res.send(err);
  });
}).
patch((req,res)=>{
  Article.update(
    {title:req.params.articleTitle},
    {$set:req.body},
    (err)=>{
      if(!err)
        res.send("update successfully");
      else
        res.send(err);
    });
}).
delete((req,res)=>{
  Article.deleteOne(
    {title:req.params.articleTitle},
    (err)=>{
      if(!err)
        res.send("delete corrosponding article successfully");
      else
        res.send(err);
    }
  );
});

app.listen(3000,function(){
  console.log("Server started on port 3000");
});
