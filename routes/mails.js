const express= require('express');
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const {exec} =require('child_process');
const { json } = require('body-parser');

let AllMails=[];
let i=0;

///vissza adja az összes elküldött email-t
router.get('/mails',(req,res,next)=>{
    console.log("Sss");
    res.send(AllMails); 
});


router.get('/getMails',checkAuth,(req,res,next)=>{
    let user='';
    user=req.body.username;
    const getMessText='sudo cat /var/spool/mail/'+ user;
    let messagesByUser=exec(getMessText, function ( err,stdout,stderr){
        console.log(stdout.toString('utf8'));
        res.send(stdout.toString('utf8')); 
    });
   
});
///json formátumban kap a szerver egy postot, amiben a mail js objektum paraméterei szerepelnek
/// az elkülddendő email paraméterei feladó neve,üzenet,felado, címzett
router.post('/sending',checkAuth ,(req, res, next) => {
    const mail = {
        message: req.body.message,
        felado: req.body.felado,
        cimzett: req.body.cimzett,
        targy:req.body.targy
    };
    let sendMailText=' echo "' + mail.message + '" | mail -s "'+ mail.targy +'" '+ mail.cimzett+' -aFrom:'+mail.felado;
    console.log(sendMailText);
    let sendMessageByUser=exec(sendMailText, function ( err,stdout,stderr){
        if(!err){
            res.status(200).json({
                message:'sikeres email küldés' 
            });
        }else{
            res.status(500).json({
                message:'Probléma akadt az emailküldés küzben' 
            });
        }
     
    });
});


router.delete('/:id',checkAuth,(req,res,next)=>{
    const id=req.params.id;
    res.status(200).json({
        message:'Törölve lett a ' + id +' id-val rendelkező üzenet' 
    });
});




module.exports=router;