const express = require("express");

const app = express();


app.use("/hello" , (req,res) => {
    res.send("HELLO!!!");
    return;
})

app.use((req,res) => {
    res.send("Hello! from matrix!!!")
})

app.listen(7777 , () => {
    console.log("connection successfull at port 7777....");
})