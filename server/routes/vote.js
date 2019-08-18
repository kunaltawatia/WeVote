var express = require('express');
var router = express.Router();
var fs = require('fs');
const mysql = require('mysql');
const sha256 = require('sha256');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'pass',
    database: 'voting'
});

const request = require('request');

const subscriptionKey = 'd5a0da7eff65488ea361274ea1fb734d';
const uriBase = 'https://centralindia.api.cognitive.microsoft.com/face/v1.0/detect';

con.connect((err) => {
    if (err) {
        console.log('>>> DATABSE CONNECTION ERROR');
        return;
    }
    console.log('SQL CONNECTED');
});


router.get('/', function (req, res, next) {

    res.send('Voting');
});

router.post('/register', function (req, res, next) {
    var { img, voterAddress, aadharID, pass, alarmpass, email } = req.body;
    const base64Data = img.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    const imageAddr = `./public/images/${new Date().getTime()}.jpeg`;
    fs.writeFile(imageAddr, base64Data, 'base64', (err) => {
        const params = {
            'returnFaceId': 'true',
            'returnFaceLandmarks': 'false',
            'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
                'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
        };
        const imagebuffer = fs.readFileSync(imageAddr);
        const options = {
            uri: uriBase,
            qs: params,
            body: imagebuffer,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        };
        request.post(options, (error, response, body) => {
            if (error) {
                console.log('Error: ', error);
                return;
            }
            let jsonResponse = JSON.parse(body);
            if (jsonResponse[0])
                con.query(`insert into voters values ("${voterAddress}","${jsonResponse[0].faceId}","${imageAddr}","${email}","${sha256(pass)}","${sha256(alarmpass)}","${aadharID}");`, (err) => {
                    if (err) console.log(err);
                });
        });
    });
    res.end();
});

module.exports = router;
