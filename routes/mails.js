const express= require('express');
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const {exec} =require('child_process');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const mailparser = require('mailparser');
const readUserMails = require('../utils/mailreader');


///Return all user emails
router.get('/mails', checkAuth, async(req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken=jwt.verify(token,process.env.JWT_KEY,'HS512');
    try {
        const messagesByUser = await readUserMails(decodedToken.email);
        res.send(messagesByUser);
    } catch(err) {
        res.send(err);
    }
});

///json formátumban kap a szerver egy postot, amiben a mail js objektum paraméterei szerepelnek
/// az elkülddendő email paraméterei feladó neve,üzenet,felado, címzett
router.post('/sending',checkAuth ,(req, res,next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedTokenMeesage=jwt.verify(token,process.env.JWT_KEY,'HS512');
    const mail = {
        message: req.body.message,
        cimzett: req.body.felado,
        targy:req.body.targy
    };
    let sendMailText=' echo "' + mail.message + '" | mail -s "'+ mail.targy +'" '+ mail.cimzett+' -aFrom:' + decodedTokenMeesage.email;
    let sendMessageByUser=exec(sendMailText, function (err, stdout,stderr){
        if(err){
            res.status(500).json({
                message:'Sikertelen üzenet küldés' 
            });
        }
        res.status(201).json({
            message:'Sikeres Üzenet' 
        });
     
    });
});


router.delete('/:id',(req,res,next)=>{
    const id=req.params.id;
    res.status(200).json({
        message:'Törölve lett a ' + id +' id-val rendelkező üzenet' 
    });
});




module.exports=router;