const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

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

    const options = {
        url: 'https://us21.api.mailchimp.com/3.0/lists/cbcd6a7386',
        method: 'POST',
        headers: {
            Authorization: 'auth 735ae84cc7ed0102ac592c2505a3b6ee-us21'
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
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on ${PORT}`))
