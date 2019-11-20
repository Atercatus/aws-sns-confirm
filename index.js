require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");

const PORT = 8080;

const app = express();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.BUCKET_REGION
});

const sns = new AWS.SNS();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/", (req, res) => {
  const options = {
    TopicArn: req.headers["x-amz-sns-topic-arn"],
    Token: req.body.Token
  };

  sns.confirmSubscription(options);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}.............`);
});
