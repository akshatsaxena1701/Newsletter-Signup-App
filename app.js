const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');
const app =express();
const https = require('https');
app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",(req,res)=>{
    console.log("post request received");
    var first = req.body.first;
    var last = req.body.last;
    var email = req.body.email;
    console.log(first,last,email);
    //{"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}
    var data = {
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                    FNAME:first,
                    LNAME:last
                }
            }
        ]
    }//fc311e03ad37d9840a5b53e1101b3620-us10
    const url = "https://us10.api.mailchimp.com/3.0/lists/fbf5c60c53"
    const jsondata = JSON.stringify(data);
    const options = {
        method:"POST",
        auth:"akshat:fc311e03ad37d9840a5b53e1101b3620-us10"
    }
    const request=https.request(url,options,(response)=>{
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");        }

        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        });
    });
    request.write(jsondata);
    request.end();


});


app.post("/failure",(req,res)=>{
    res.redirect("/");
})


app.listen(process.env.PORT||3000,()=>{
    console.log("server is running on 3000");
});
