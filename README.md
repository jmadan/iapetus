# Equity portfolio events

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)

## General info

Lambda function to fetch active equity portfolios in system and convert them to events for SQS queue

## Technologies

Project is created with:

- Nodejs
- Serverless
- aws-sdk library
- axios library

## Setup

To run this project locally, install it locally using npm:

```
$ cd ../iapetus
$ yarn install
$ serverless invoke local --function getEquityPortfolios
```
