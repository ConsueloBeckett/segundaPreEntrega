import express from 'express'
import  mongoose from 'mongoose'
import path from 'path'
import productsRouter from './routes/products.router'
import cartsRouter from './routes/carts.router'
import { engine } from "express-handlebars"
import  passport from 'passport'

const app = express();
const PORT = 8080;

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"));

initializePassport(passport)
app.use(passport.initialize())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname+"/public"))

mongoose.connect("mongodb+srv://mconsuelobeckett:BtMrTH620ttG7XsN@cluster1.kji7jjj.mongodb.net/?retryWrites=true&w=majority")
.then(() => {
    console.log("connected to the DB")
})
.catch(e => {
    console.error("Fail to connect to the BD", e)
}) 

const users = []

app.post('/register', (req, res)=>{
    const {name, email, password}= req.body
    const exists = users.find(users => users.email === email)

    if(exists) return res.status(400).send({e:"error", e: "the user already exists"})
    
    const users = {
        name,
        email,
        password
    } 
    users.push(users)

    const access_token = generateToken(users)
    res.send({status: "success", access_token})
})

app.post('/login', (req, res)=>{
    const {email, password} = req.body
    const users =users.find(users=>users.email === email && users.password === password)
    if(!users) return res.status(400).send({status:"error", error: "credential invalid"})
    const access_token = generateToken(user)
    res.send({status: 'success', access_token})
})

app.post("/setCookie",(req, res)=>{
    const {user} = req.body
    res.cookie('user', user, {maxAge: 10000})
    res.send("Cookie created")
    })
    
    app.get("/getCookie", (req, res)=>{
        const userCookie = req.cookies.user
        console.log("Cookie", userCookie)
        res.send(userCookie)
        }); 
    
  
    app.get("/setCookie", (req, res)=>{
     res.cookie('ConsuCookie', "soy yo", {maxAge: 10000}).send("Cookie")
    });
    

    app.get("/getCookie", (req, res)=>{
    res.send(req.cookies)
    });
    
   
    app.get("/deleteCookie", (req, res)=>{
    res.clearCookie("ConsuCookie").send("Cookie deleted") 
    });
    
   
    app.get("/setSignedCookie", (req, res)=>{
        res.cookie("Signed cookie","recived a signed cookie",{maxAge:10000, signed:true}).send("Cookie")
    
    });
    

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});