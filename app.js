const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.port || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const data = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us20.api.mailchimp.com/3.0/lists/8394c6a2f2/members"
    const options = {
        method: "POST",
        auth: "kalki:86b85af8b957dcf5f5265801864112e8-us20"
    };

    const request = https.request(url, options, function (response) {
        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        }
        else{
            res.sendFile(__dirname + '/failure.html');
        }
        
        response.on("data", function (data) {
            console.log(JSON.parse(data))
        })
    });

    request.write(jsonData);
    request.end();

})


//://   in case of Failure, REDIRECTION 
app.post('/failure', (req, res) => {
    res.redirect('/');
})


app.listen(port, () => {
    console.log("Server listening on port: " + port);
});

//:?    process.env.port   ->   is used to listen for Heroku Server, as the port may not always be fixed like by us done locally 


//  API Key
//  86b85af8b957dcf5f5265801864112e8-us20

//  Audience ID
//  8394c6a2f2