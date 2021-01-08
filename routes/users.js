const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendgrid = require('@sendgrid/mail');
const { body, validationResult} = require('express-validator');
const db = require('../models');
const router = express.Router();

// @desc GET request to login page
// @route /user/signin
router.get('/', (req, res) => {
    res.send('HEllO from login page')
});

// @desc GET request to sign up page
// @route /user/signup
router.get('/signup', (req, res) => {
   
});

// @desc POST request to create acoount
// @route /user/signup
router.post('/signup', body('email').isEmail(), body('password').isLength({min:6}), async(req, res) => {
    try {
        let errors = [];
        let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        
        // check if user already exists
        const user = await db.user.findOne({
            where:{
                email:req.body.email
            }
        });

        if(user){
            errors.push({msg:"An account with that email already exists"});
            // render view with requiered parameters
            res.send('booo')
        }  else{
            // check fields
            if(!req.body.name || !req.body.email || !req.body.password || !req.body.c_password){
             errors.push({msg:"Make sure to fill in all forms"})
           }

             if(req.body.password !== req.body.c_password){  
            errors.push({msg:"Make  sure the password match"});
             }

            //  if(validationResult(req)){
            //      errors.push({msg:validationResult(req)})
            //  }

            if(req.body.password.length < 6){
                errors.push({msg:"Make sure your password has al least six Characters"});
            }
             
        // check if the array contain any errors
             if(errors.length > 0){
                res.send(errors)
             }
                else {
                 
                    // generate salt 
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(req.body.password, salt);
                    
                    // generate random string
                    let token = crypto.randomBytes(20).toString('hex');
                    // create a new user
                    await db.user.create({
                        name:req.body.name,
                        email:req.body.email,
                        password:hash,
                        activation_token:token,
                        active:false
                    });

                    // send email for validation of email
                    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = {
                        to:req.body.email,
                        from:process.env.FROM_EMAIL,
                        subject:"Email Validation",
                        text:"Email Validation",
                        html:`You are receiving this because \n Please click the link Confirm your account http://${req.headers.host}/user/confirm/${token}`
                    }

                    sendgrid.send(msg);
                    // redirect to a different page
                    
              }
        }
            
        
        
    } catch (err) {
        console.error(err);
    }
})

module.exports = router;