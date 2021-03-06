const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const passportSetup = require('./Config/passport-setup');
const cookieSession = require('cookie-session')
const keys = require('./Config/key')
const passport = require('passport')


mongoose.connect("mongodb://minhco12:whysoserious1@ds111623.mlab.com:11623/todo-project",{useNewUrlParser: true}, (err) => {
    if(err) console.log(err)
    else console.log("DB connect success!");
}); //add user to mlab

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
const TodoRouter = require('./routers/todoRouter');
const AuthRouter = require('./routers/auth')


app.use(bodyParser.urlencoded({extended : true})); //app.use -> middleware 
app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}))

//initialize passport
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/todo', TodoRouter);
app.use('/auth', AuthRouter);



app.get('/', (req,res) => {
    res.send('Vao dc roi ne');
});


const port = process.env.PORT || 6868;
// const port = 6868;
app.listen(port, (err) => {
    if(err){
        console.log(err);
    }else{
        console.log('Listening at port '+ port);
    }
})