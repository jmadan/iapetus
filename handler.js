"use strict";
const awsObject = require("./aws");
const service = require("./portfolioService");
const tokenService = require("./tokenService");
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

function postMessage(portfolioQ, portfolio){
  return awsObject.portfolioQMessage(portfolioQ, portfolio)
}

module.exports.index = async (event) => {
  try{
    const portfolioQueue = await awsObject.getParameter("PORTFOLIOQ");
    const token = await tokenService.getToken();
    const { access_token, expires_in, token_type } = token;
    const portfolios = await service.getPortfolios(access_token);
    const result = await portfolios.map(portfolio => postMessage(portfolioQueue, portfolio));

    return await Promise.all(result)
    .then(values => successResponse(201, `Portfolio pushed to Queue ${values.length}`))

    }
    catch(err){
      rollbar.log('portfolioLFunction', err)
      console.log(err)
      return errorResponse(500, err)
    }
};
