const express = require("express");
const serveIndex = require("serve-index");

const app = express();

app.use((request, response, next) => {
    console.log("Time: ", Date.now());
    next();
});

app.use("/request-type", (req, res, next) => {
    console.log("Request type: ", req.method);
    next();
});

app.use("/", express.static("public"));
app.use("/", serveIndex("public"));

// app.get("/", (req, res) => {
//     res.send("Successful response.");
// });

app.listen(8000, "127.0.0.1", () => {
    console.log("Listening on port 8000.");
});
