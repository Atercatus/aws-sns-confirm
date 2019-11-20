require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");

const PORT = 8080;

const app = express();

console.log(process.env.ACCESS_KEY_ID);

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.BUCKET_REGION
});

const sns = new AWS.SNS();

app.use((req, res, next) => {
  if (req.get("x-amz-sns-message-type")) {
    req.headers["content-type"] = "application/json";
  }
  next();
});
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

app.post("/", (req, res) => {
  const options = {
    TopicArn: req.headers["x-amz-sns-topic-arn"],
    Token: req.body.Token
  };

  console.log(options);
  sns.confirmSubscription(options);
  res.send();
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}.............`);
});
