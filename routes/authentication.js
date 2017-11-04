const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');  

module.exports = (router) => {

    router.post('/register',(req,res) => {

       if(!req.body.email){
           res.json({ success: false, message: 'You must provide an e-mail'});
       } else {
           if(!req.body.username){
            res.json({ success: false, message: 'You must provide an username'});
           } else {
            if(!req.body.password){
                res.json({ success: false, message: 'You must provide an password'});
               } else {

                let user = new User({
                    email: req.body.email.toLowerCase(),
                    username: req.body.username.toLowerCase(),
                    password: req.body.password
                });
                user.save((err)=>{
                    if(err){
                        if(err.code === 11000) {
                            res.json({ success: false, message: 'Username or email already exists'});
                        } else {
                            if(err.errors){
                                if(err.errors.email) {
                                    res.json({ success: false, message: err.errors.email.message});
                                } else {
                                    if(err.errors.username) {
                                        res.json({ success: false, message: err.errors.username.message});
                                    } else {
                                        if(err.errors.password) {
                                            res.json({ success: false, message: err.errors.password.message});
                                        } else{
                                            res.json({ success: false, message: err});
                                        }
                                    } 
                                }
                            } else {
                                res.json({ success: false, message: 'Could not save user. Error: ', err});
                            }
                        }

                    } else {
                        res.json({ success: true, message: 'Account registered'});

                    }
                })
               }
           }
       }

    });
    
    router.get('/checkEmail/:email', (req,res) => {
        if(!req.params.email) {
            res.json({ success: false, message: 'E-mail was not provided' });
        } else {
            User.findOne({ email: req.params.email }, (err, user) => {
                if(err) {
                    res.json({ success: false, message: err });
                } else {
                    if(user) {
                        res.json({ success: false, message: 'E-mail already exists' });
                    } else {
                        res.json({ success: true, message: 'E-mail is available' });
                    }
                }
            });
        }
    });

    router.get('/checkUsername/:username', (req,res) => {
        if(!req.params.username) {
            res.json({ success: false, message: 'Username was not provided' });
        } else {
            User.findOne({ username: req.params.username }, (err, user) => {
                if(err) {
                    res.json({ success: false, message: err });
                } else {
                    if(user) {
                        res.json({ success: false, message: 'Username already exists' });
                    } else {
                        res.json({ success: true, message: 'Username is available' });
                    }
                }
            });
        }
    });

    router.post('/login',(req,res) => {
        if(!req.body.username) {
            res.json({ success: false, message: 'No username was provided'});
        } else {
            if(!req.body.password) {
                res.json({ success: false, message: 'No password was provided'});
            } else {
                User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
                    if(err) {
                         res.json({ success: false, message: err});
                    } else {
                        if(!user) {
                            res.json({ success: false, message: 'Username not found.'})
                        } else {
                            const validPassword = user.comparePassword(req.body.password);
                            if(!validPassword) {
                                res.json({ success: false, message: 'Password invalid' });
                            } else {
                                const token = jwt.sign({ userId: user._id}, config.secret, { expiresIn: '24h'});
                                res.json({ success:true, message: 'Login successful!', token: token, user: { username: user.username } });
                            }
                        }
                    }
                });
            }
        }
    });//middlewares are created with '.use'.
    //middleware to intercept the headers
    router.use((req, res, next) => {
        const token = req.headers['authorization'];//to search for the headers coming from the front end
        if(!token) {
            res.json({ success: false, message: 'No token provided'})
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if(err) {
                    res.json({ success: false, message: 'Token invalid:' + err});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    });//As this is middleware routes mentioned after this middleware will use this middleware. 
    //So, place the routes which require authentication after this middleware and place routes which dont require authentication before this middleware

    router.get('/profile', (req,res) => {
       User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
         if(err) {
             res.json({ success: false, message: err});
         } else {
             if(!user) {
                 res.json({ success: false, message: 'User not found'});
             } else {
                 res.json({ success: true, user: user});
             }
         }
       });
    });
    // Route to get user's public profile data
    router.get('/publicProfile/:username', (req, res) => {
        if (!req.params.username) {
          res.json({ success: false, message: 'No username was provided' }); 
        } else {
          User.findOne({ username: req.params.username }).select('username email').exec((err, user) => {
            if (err) {
              res.json({ success: false, message: 'Something went wrong.' }); 
            } else {
              if (!user) {
                res.json({ success: false, message: 'Username not found.' }); 
              } else {
                res.json({ success: true, user: user });
              }
            }
          });
        }
      });
    
        
    return router;
}