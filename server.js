require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

var len = 0;
var origUrl = "";

app.post("/api/shorturl", (req, res, next) => {
  let regex = /(https|www)/gm; //regex to check for valid url
  if (regex.test(req.body.url)) {
    res.json({
      original_url: req.body.url,
      short_url: req.body.url.length
    });
  } else {
    res.json({ error: "invalid url" });
  }

  console.log("the url", req.body.url);
  origUrl = req.body.url;
  len = req.body.url.length;
  // console.log(`short url ${req.headers["content-length"]}  len ${len}`);
  next(); 
});

app.get("/api/shorturl/:short_url", (req, res) => {
  // console.log(`1 ${len} 2 ${req.params.short_url} 3 ${origUrl.length}`);
  if (len == origUrl.length) {
    if (origUrl.charAt(0) == "h") {
      res.redirect(origUrl);
    } else {
      res.redirect("https://" + origUrl);
    }
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
