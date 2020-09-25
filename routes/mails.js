const express= require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({

        message:'Egy GET kérés a mailingből'
    });
});
///json formátumban kap a szerver egy postot, amiben a mail js objektum paraméterei szerepelnek
/// az elkülddendő email paraméterei feladó neve,üzenet,felado, címzett
router.post('/:sending', (req, res, next) => {
    const mail = {
        name: req.body.name,
        message: req.body.message,
        felado: req.body.felado,
        cimzett: req.body.cimzett
    };
    res.status(201).json({
        message: 'Sendind an email',
        mail: mail
    });
});


module.exports=router;