const passport = require('passport')
const GoogleStategy = require('passport-google-oauth20')
const keys = require('./key')
const User = require('../model/userModel')

//after find or create new user
passport.serializeUser((user, done) => {
    done(null,user.id);

});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(userFound => {
            done(null,userFound);
        })
})

passport.use(
    new GoogleStategy({
    //option for the google strat
        callbackURL: "/auth/google/redirect",
        clientID : keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        //passport call back function
        //check if user already exist in our db
        User.findOne({googleId: profile.id})
            .then(userFound => {
                if(userFound){
                    //alrealdy have the user
                    console.log('User is '+ userFound);
                    done(null, userFound); //jump to next step9 serializeUser
                }else{
                    // if not, create new user
                    new User({
                        username: profile.displayName,
                        googleId: profile.id
                    }).save().then((newUser) => {
                        console.log('New user created ' + newUser)
                        done(null, newUser);
                    })
                }
            })
        
    }
    )
)