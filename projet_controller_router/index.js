const express = require("express");
const exampleRouter = require("./routerExample");

app = express();

app.use("/example", exampleRouter);

app.listen(3000, () => {
    console.log("app launched in the port 3000 !");
})