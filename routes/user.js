const express= require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');



//** teszt adatokkal működik a login, token nélkül,
//https://www.youtube.com/watch?v=0D5EEKH97NA&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=12
//hashelést be kell állítani a passwordea, használni a bcrypt */

//hash passwd
const bcrypt = require('bcrypt');
const { request, response } = require('express');
let emails=[];
let users=[];
let i=0;

router.post('/signup',((req, res, next) =>{

    //email duplikácó elleni validáció
    if(emails.includes(req.body.email))
    {
        return res.status(409).json({
            message:"User létezik"
        });
    }
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if (err){
            return res.status(500).json({
                message:err
            });
        }else{
            const user={
                id:i,
                email:req.body.email,
                password:hash
            }
            
            emails[i]=req.body.email;
            users[i]=user;
            i++;
            //mentett felhasználók tesztelésre
            console.log(users);
          return res.status(201).json({
                user:user
            });
        }
    });
    
} ));
    let uemails=[];
    let upasswords=[];


router.get('/getallusers',(request, response) =>{
    response.send(users);
    
        
    
    
});

router.post('/login',((req, res) => {
    const mail=req.body.email;
    const passw=req.body.password;
    var i=0;
    for (i in users) {
        uemails[i]=users[i].email;
        upasswords[i]=users[i].password;
    }
        if (uemails.includes(mail)){


            //upasswords.includes(passw)
                if (bcrypt.compare(""+req.body.password,""+upasswords)) {
                    
                 const token=jwt.sign({
                     email:uemails,
                     password:upasswords
                 },
                "" + process.env.JWT_KEY,
                 {
                     expiresIn:"1h"
                 }
                 );
                    res.status(201).json({
                        message:"Logged in",
                        token:token
                    })
                }else{
                    res.status(409).json({
                        message:"Auth failed"
                    })
                }
            }else{
                     res.status(409).json({
                     message:"Auth failed"
                 }); 
            }
        
}));

module.exports=router;