const express= require('express');
const router = express.Router();
const checkAuth=require('../middleware/check-auth');


let AllMails=[];
let i=0;

///vissza adja az összes elküldött email-t
router.get('/mails',checkAuth,(req,res,next)=>{
    res.send(AllMails); 
});
///json formátumban kap a szerver egy postot, amiben a mail js objektum paraméterei szerepelnek
/// az elkülddendő email paraméterei feladó neve,üzenet,felado, címzett
router.post('/sending',checkAuth ,(req, res, next) => {
    const mail = {
        name: req.body.name,
        message: req.body.message,
        felado: req.body.felado,
        cimzett: req.body.cimzett,
        targy:req.body.targy
    };
    AllMails[i]=mail;
    i++;
    res.status(201).json({
        message: 'Sendind an email',
        mail: mail

    });
});


router.delete('/:id',checkAuth,(req,res,next)=>{
    const id=req.params.id;
    res.status(200).json({
        message:'Törölve lett a ' + id +' id-val rendelkező üzenet' 
    });
});




module.exports=router;