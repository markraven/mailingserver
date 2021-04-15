const express= require('express');
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const {exec} =require('child_process');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');

let AllMails=[];
let i=0;

///vissza adja az összes elküldött email-t
router.get('/mails',checkAuth,(req,res,next)=>{
const token = req.headers.authorization.split(" ")[1];
const decodedToken=jwt.verify(token,process.env.JWT_KEY,'HS512');

    let messagesByUser;
    messagesByUser=exec('sudo cat /var/spool/mail/'+ decodedToken.email, function ( err,stdout,stderr){      
       

            res.send(stdout);    
         
    });
   
});

///json formátumban kap a szerver egy postot, amiben a mail js objektum paraméterei szerepelnek
/// az elkülddendő email paraméterei feladó neve,üzenet,felado, címzett
router.post('/sending',checkAuth ,(req, res) => {
    
    const token = req.headers.authorization.split(" ")[1];
    const decodedTokenMeesage=jwt.verify(token,process.env.JWT_KEY,'HS512');
    const mail = {
        message: req.body.message,
        cimzett: req.body.felado,
        targy:req.body.targy
    };
    
    let sendMailText=' echo "' + mail.message + '" | mail -s "'+ mail.targy +'" '+ mail.cimzett+' -aFrom:' + decodedTokenMeesage.email;

    let sendMessageByUser=exec(sendMailText, function ( err,stdout,stderr){
        
        res.status(200).json({
            message:'Sikeres Üzenet' 
        });
     
    });
});


router.delete('/:id',checkAuth,(req,res,next)=>{
    const id=req.params.id;
    res.status(200).json({
        message:'Törölve lett a ' + id +' id-val rendelkező üzenet' 
    });
});




module.exports=router;