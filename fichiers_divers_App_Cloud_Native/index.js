const express = require("express");

app = express();

app.get("/", (req,res) => {
    res.send("hello smart students !");
})

app.listen(3000, () => {
    console.log("Express server started on 3000 ...");
});