const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });

let SSM = new AWS.SSM({ apiVersion: "2014-11-06" });
let SQS = new AWS.SQS({ apiVersion: "2012-11-05" });

const getParameter = (parameter) => {
  let params = {
    Name: parameter,
    WithDecryption: true,
  };
  return new Promise((resolve) => {
    SSM.getParameter(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        resolve(data.Parameter.Value);
      }
    });
  });
};

const portfolioQMessage = (queueUrl, message) => {
  let params = {
    DelaySeconds: 0,
    MessageBody: JSON.stringify(message),
    QueueUrl: queueUrl,
  };
  return SQS.sendMessage(params).promise();
};

module.exports = {
  getParameter,
  portfolioQMessage,
};
