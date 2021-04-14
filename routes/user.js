const express= require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passwd = require('passwd-linux');


//** teszt adatokkal működik a login, token nélkül,
//https://www.youtube.com/watch?v=0D5EEKH97NA&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=12
//hashelést be kell állítani a passwordea, használni a bcrypt */

//hash passwd
const { request, response } = require('express');
let emails=[];
let users=[];
let i=0;


    let uemails=[];
    let upasswords=[];

router.post('/login',((req, res) => {
    const username=req.body.username;
    const passw=req.body.password
    console.log(username);
  
                    passwd.checkPassword(username,passw,function(err,response){
                        if(err){
                            console.log(err);
                        }else{
                            if(response){
                    
                                const token=jwt.sign({
                                    email:username,
                                    password:passw
                                },
                                "" + process.env.JWT_KEY,
                                {
                                    expiresIn:"1h"
                                }
                                );
                                  return  res.status(201).json({
                                        message:"Logged in",
                                        token:token
                                    })
                            }
                            else{
                               return res.status(500).json({
                                    message:"Authentication Failed"
                                });
                            }
                        }
                      
                        }
                    );
      
}));

module.exports=router;