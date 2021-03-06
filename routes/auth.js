const router = require('express').Router();
const bcrypt = require('bcrypt');
const Keys_Model = require('../models/Keys');
const rstring = require('randomstring');
const jwt = require('jsonwebtoken')

router.post('/', async (req, res, next) => {

    const token = req.headers['auth']
    if(token == null) return res.status(401).json({'message':'Unauthorized'});
    try {
        data = jwt.verify(token, process.env.TOKEN_SECRET)
        res.locals.data = data
        next();
    }catch(err) {
        res.status(401).json({'message':'Error', error: err.message});
    }

    /*if(req.headers.host === 'modminers.hu' || req.headers.host === 'localhost:8080' || req.headers.host === 'localhost:3000') {
        next();
    }else{
        if(key != undefined) {
            if(await validateKey(key)) {
                next();
            }else{
                res.status(401).json({'message':'Unauthorized'});
            }
        }else{
            res.status(401).json({'message':'Unauthorized'});
        }
    }*/
});

router.get('/', async (req, res, next) => {

    const token = req.headers['auth']
 
    if(token === null) return res.status(401).json({'message':'Unauthorized'});
    try {
        data = jwt.verify(token, process.env.TOKEN_SECRET)
        res.locals.data = data
        next();
    }catch(err) {
        res.status(401).json({'message':'Error', error: err.message});
    }

    const key = req.headers['authorization'];

    /*if(req.headers.host === 'modminers.hu' || req.headers.host === 'localhost:8080' || req.headers.host === 'localhost:3000') {
        next();
    }else{
        if(key != undefined) {
            if(await validateKey(key)) {
                next();
            }else{
                res.status(401).json({'message':'Unauthorized'});
            }
        }else{
            res.status(401).json({'message':'Unauthorized'});
        }
    }*/
});

router.patch('/', async (req, res, next) => {

    const token = req.headers['auth']

    if(token === null) return res.status(401).json({'message':'Unauthorized'});
    try {
        data = jwt.verify(token, process.env.TOKEN_SECRET)
        res.locals.data = data
        next();
    }catch(err) {
        res.status(401).json({'message':'Error', error: err.message});
    }

    const key = req.headers['authorization'];

    /*if(req.headers.host === 'modminers.hu' || req.headers.host === 'localhost:8080' || req.headers.host === 'localhost:3000') {
        next();
    }else{
        if(key != undefined) {
            if(await validateKey(key)) {
                next();
            }else{
                res.status(401).json({'message':'Unauthorized'});
            }
        }else{
            res.status(401).json({'message':'Unauthorized'});
        }
    }*/
});

router.delete('/', async (req, res, next) => {

    const token = req.headers['auth']

    if(token === null) return res.status(401).json({'message':'Unauthorized'});
    try {
        data = jwt.verify(token, process.env.TOKEN_SECRET)
        res.locals.data = data
        next();
    }catch(err) {
        res.status(401).json({'message':'Error', error: err.message});
    }

    const key = req.headers['authorization'];

    /*if(req.headers.host === 'modminers.hu' || req.headers.host === 'localhost:8080' || req.headers.host === 'localhost:3000') {
        next();
    }else{
        if(key != undefined) {
            if(await validateKey(key)) {
                next();
            }else{
                res.status(401).json({'message':'Unauthorized'});
            }
        }else{
            res.status(401).json({'message':'Unauthorized'});
        }
    }*/
});

router.post('/verifyToken', async (req, res) => {

    const token = req.body['token'];
    if(token == null) return res.status(400).send("Nem megfelelő kérés!")
    try {
        data = jwt.verify(token, process.env.TOKEN_SECRET)
        
        res.status(200).send(data)
    }catch(err) {
        res.status(400).send("Nem megfelelő token!")
    }

})

router.get('/create', async (req, res) => {
    if(req.headers.host === 'modminers.hu' || req.headers.host === 'localhost:8080' || req.headers.host === 'localhost:3000') {
        const newKey = await createKey(req.body.key || null, false);
        res.json({'key': newKey});
    }else{
        if(await validateKey(req.headers['authorization'])) {
            const newKey = await createKey();
            res.json({'key': newKey});
        }else{
            res.status(401).json({'message':'Unauthorized', headers: req.headers.host});
        }
    }
});

async function validateKey(key, del=true){
    let get;
    try {
        get = await Keys_Model.find();
        for (i = 0; i<get.length; i++) {
            const match = await bcrypt.compare(key, get[i].key)
            if(match) {
                if(get[i].permanent === false && del === true) {
                    try{
                        await Keys_Model.deleteOne({key: get[i].key});
                        return true;
                    }catch(err) {
                        res.status(500).json({message: "Hiba történt!", error: err});
                    }                  
                }else{
                    return true;
                }
            }else{
                continue;
            }
        }
    } catch (error) {
        console.log(error)
    }
}

async function createKey(key=null, perm=false){
    if(key == null) { 
        key = rstring.generate(); 
    }
    const token = await bcrypt.hash(key, 10);
    const keyPost = Keys_Model({
        key: token,
        permanent: perm
    });
    try {
        await keyPost.save();
        return key;

    } catch (error) {
        console.log(error)
    }
}




module.exports = router;
module.exports.validateKey = validateKey;
module.exports.createKey = createKey;