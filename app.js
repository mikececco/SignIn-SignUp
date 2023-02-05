const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));//public will be our static folder
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){

    const firstName = req.body.fName; //fName is what is defined in HTML input name
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = { //build data that Mailchimp can read, look at example code
        
        members : [{

            email_address: email, //formatting so that Mailchimp API can read the data and store it correctly
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }

        }]

    }

    var jsonData = JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/d1bd419181"//coming from Mailchimp endpoint
    const options = {
        method: "post",
        auth: "mike1:8abf62e57b6f4acd26bfdf36e995c41d-us11" //way to authenticate through http req
    }
    
    const request = https.request(url, options, function(response){//we put it inside a constant as required per Mailchimp, function that gives a response coming from Mailchimp API
        
        if (response.statusCode === 200){//statusCode is 200-300-400
            res.sendFile(__dirname + "/success.html") //we use res since is response to http request
        } else {
            res.sendFile(__dirname + "/failure.html")
        };
        response.on("data", function (data){//check from the response, the data
            console.log(JSON.parse(data)); //JSON parse to turn it into readable object

        }) 

    }); 
     request.write(jsonData); //we using the request we created, on which we write our data that we want to send to our Mailchim API
    request.end();
});

app.post("/failure", function (req, res) {

    res.redirect("/")
    
});


app.listen(3000, function () {
    console.log("Listening on 3000");
});


/* //mailchimp API
8abf62e57b6f4acd26bfdf36e995c41d-us11
//audience list
d1bd419181 */

