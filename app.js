const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const CryptoJs = require('crypto-js');
const readline = require("readline");
const { log } = require('console');

const app = express();

//bodyparser
app.use(bodyParser.urlencoded({extended:true}));

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//signup route
app.post('/signup',(req,res) =>{
    const {firstName, lastName, email} = req.body;
    
    //make sure  fields are filled
    if(!firstName || !lastName || !email){
        res.redirect('/fail.html');
        return;
    }
    //construct req data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const postData = JSON.stringify(data);

    //get api key
    const ApiKey = getDecryptedValue();
  
    const options = {
        url: 'https://us21.api.mailchimp.com/3.0/lists/cbcd6a7386',
        method: 'POST',
        headers: {
            Authorization: `auth ${ApiKey}`
        },
        body: postData
    }
    request(options, (err,response,body)=>{
        if(err){
            res.redirect('/fail.html');
        }else{
            if(response.statusCode === 200){
                res.redirect('/success.html');
            }else{
                res.redirect('/fail.html');
            }
        }
    });
});

//listen to port 
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on ${PORT}`));

//getting secret key
// let inputedSecretKey = '';
const getDecryptedValue = function() {
   
    // const rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    //   });

      
    //   rl.question("Input Secret Key:", function (string) {
    //     inputedSecretKey = string;
    //   rl.close();
    //   });

    //on local machine
    // const decrypted = CryptoJs.AES.decrypt('U2FsdGVkX1/1sM2ZR/fMPf1GkuVA1xhBXCU/dps5h2Zq+yJMQV4LNuY20jGLSY7ygHQKkgU69dN9/SzjRK8Iuw==',`${inputedSecretKey}`);
   
    //web hosting
    const decrypted = CryptoJs.AES.decrypt('U2FsdGVkX1/1sM2ZR/fMPf1GkuVA1xhBXCU/dps5h2Zq+yJMQV4LNuY20jGLSY7ygHQKkgU69dN9/SzjRK8Iuw==',`Pass123!`);

    return decrypted.toString(CryptoJs.enc.Utf8); 
}

getDecryptedValue();




