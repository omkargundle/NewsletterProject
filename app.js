const { subscribe } = require("diagnostics_channel");
const express = require("express")
const app = express();
const https = require("https");
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
require("dotenv").config();




app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/",function(req, res){
    var email= req.body.Email
    var fname= req.body.Fname
    var lname=req.body.Lname
    const url= "https://us4.api.mailchimp.com/3.0/lists/ac860c934c"

    const data =JSON.stringify({
        members :[{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname
            }
        }] 
    })
    const options ={
        method: "POST",
        auth: "omkar:" + process.env.apiKey 
    }

    const request = https.request(url, options, function (response){
         
        var rawData= "";
        response.on ("data", function(chunk){

            rawData += chunk;
        })
        response.on("end", function(end){
            try{
                const fullyParsedData= JSON.parse(rawData);
                if (response.statusCode=== 200){
                    res.sendFile(__dirname + "/success.html");

                }else{
                    res.sendFile(__dirname +"/failure.html");
                }
                console.log(response.statusCode);
                 
            }catch(err){
                console.log(err)
                res.sendFile(__dirname +"/failure.html");
            }
        })
    })
request.write(data);
request.end();

})

app.post("/failure", function(req,res){
    res.redirect("/");
})


app.listen(process.env.PORT ||3000, function (req, res) {
    console.log("Serve is listening at port 3000");
})