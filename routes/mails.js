const express= require('express');
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const {exec} =require('child_process');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const simpleParser = require('mailparser').simpleParser;
let AllMails=[];
let i=0;

///vissza adja az összes elküldött email-t
router.get('/mails',checkAuth,(req,res,next)=>{
const token = req.headers.authorization.split(" ")[1];
const decodedToken=jwt.verify(token,process.env.JWT_KEY,'HS512');
let AllMails=[];
AllMails=[
    felado="asd",
    cimzett="sad",
    message="asd",
    targy="sfdsfds"
];
    let getMessText='cat /var/spool/mail/'+ decodedToken.email;
    let messagesByUser;
    messagesByUser=exec('sudo cat /var/spool/mail/'+ decodedToken.email, function ( err,stdout,stderr){
      
        simpleParser(stdout.toString("utf-8"), (err, parsed) => {
            console.log(parsed);
            res.send(stdout);
        });
        
    });
    console.log(getMessText)
});


router.post('/getalMails',checkAuth,(req,res,next)=>{
    let user='';
    user=req.body.username;
    console.log("frfr");
    const getMessText='sudo cat /var/spool/mail/'+ user;
    let messagesByUser=exec(getMessText, function ( err,stdout,stderr){
        
        let allEmails=stdout;
        simpleParser(stdout, (err, parsed) => {
            console.log(parsed.mail);
        });
        res.send(allEmails.split("Received:")); 
    });
   
});
///json formátumban kap a szerver egy postot, amiben a mail js objektum paraméterei szerepelnek
/// az elkülddendő email paraméterei feladó neve,üzenet,felado, címzett
router.post('/sending',checkAuth ,(req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken=jwt.verify(token,process.env.JWT_KEY,'HS512');
    const mail = {
        message: req.body.message,
        felado: req.body.felado,
        cimzett: req.body.cimzett,
        targy:req.body.targy
    };
    let sendMailText=' echo "' + mail.message + '" | mail -s "'+ mail.targy +'" '+ mail.cimzett+' -aFrom:' + decodedToken.email;
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