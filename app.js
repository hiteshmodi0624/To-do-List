const express = require('express')
const app = express()
var _ = require('lodash');

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))

const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
mongoose.connect('mongodb+srv://hiteshmodi__:Faaccbuk12@cluster0.cv5xurz.mongodb.net/todolist',{useNewUrlParser:true})

const date=require(__dirname+"/date.js");
app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'));
const port = 3000

const tasksSchema=new mongoose.Schema({
    name:{
        type:"String",
        required:true
    }
})
const listSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    item:[tasksSchema]
})
const tasks=mongoose.model("Task",tasksSchema);
const List=mongoose.model("List",listSchema)

app.get('/', function(req, res) {
    const homelist="Today";
    List.findOne({name:homelist},function(err,listname){
        if(!err){
            if(!listname){
                const list=new List({
                    name:homelist,
                    item:[]
                })
                list.save()
                res.redirect("/Today")
            } 
            else{
                res.render('lists',{title:homelist,tasks:listname.item})
            }
        }
    })
})
app.get('/:customlist',function(req,res){
    const customlist=_.capitalize(req.params.customlist);
    List.findOne({name:customlist},function(err,listname){
        if(!err){
            if(!listname){
                const list=new List({
                    name:customlist,
                    item:[]
                })
                list.save()
                res.redirect("/"+customlist)
            }
            else{
                res.render('lists',{title:customlist,tasks:listname.item})
            }
        }
    })
})
app.post("/",function(req,res){
    const task=req.body.task;
    const listname=req.body.list;
    const newtask=new tasks({
        name:task
    })
    List.findOne({name:listname},function(err,foundList){
        foundList.item.push(newtask);
        foundList.save();
        res.redirect("/"+listname);
    })
})
const arr=[];
app.post('/delete',function(req,res){
    const listname=req.body.list;
    const id=req.body.id;
    List.findOneAndUpdate({name:listname},{$pull:{item:{_id:id}}},function(err,res){
        if(err)
            console.log(err)
    })
    res.redirect("/"+listname);
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))