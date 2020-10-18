const axios = require("axios");

const getPortfolios = async (token) => {
  const config = {
    method: "get",
    url: `${process.env.API_URL}/portfolios`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios(config);
  return result.data;
};

const getEquityPortfolios = async (token) => {
  const config = {
    method: "get",
    url: `${process.env.API_URL}/equity/all`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios(config);
  return result.data;
};

module.exports = { getPortfolios, getEquityPortfolios };
