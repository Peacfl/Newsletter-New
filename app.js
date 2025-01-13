const express = require("express");
const bodyParser = require("body-parser")
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));
app.listen(process.env.PORT || 3000, () => {
    console.log("server running at port 3000");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

mailchimp.setConfig({
    apiKey: "09997fe0a912e2475d9ac67ef6c658be-us13",
    server: "us13",
});

app.post("/", (req, res) => {

    var fName = req.body.fName;
    var lName = req.body.lName;
    var mail = req.body.email;
    console.log(fName, lName, mail);


    const listId = "857a3536b";
    const subscribingUser = {
        firstName: fName,
        lastName: lName,
        email: mail
    };

    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });

            console.log(
                `Successfully added contact as an audience member. The contact's id is ${response.id}.`
            )
        } catch {
           res.sendFile(__dirname + "/failure.html");

        }

        res.sendFile(__dirname + "/success.html");
    }

    run();

})


// list id 857a3536bb
// api key 09997fe0a912e2475d9ac67ef6c658be-us13