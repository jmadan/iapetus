"use strict";
const awsObject = require("./aws");
const service = require("./portfolioService");
const Rollbar = require("rollbar");

var rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true
});

const errorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(message) || "Internal Server Error",
});

const successResponse = (statusCode = 200, message) => ({
  statusCode: statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(message),
});

function postMessage(portfolioQ, eq){
  return awsObject.portfolioQMessage(portfolioQ, eq)
}

module.exports.index = async (event) => {
  try{
    const portfolioQueue = await awsObject.getParameter("EQUITYPORTFOLIOQ");
    const access_token = await awsObject.getParameter("auth0Token");
    const eqs = await service.getEquityPortfolios(access_token);
    const result = await eqs.map(eq => postMessage(portfolioQueue, eq));

    return await Promise.all(result)
    .then(values => successResponse(201, `Portfolio pushed to Queue ${values.length}`))

    }
    catch(err){
      rollbar.log('portfolioLFunction', err)
      console.log(err)
      return errorResponse(500, err)
    }
};
