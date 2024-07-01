
// DONT USE THESE ONLY FOR DEVELOPMENT
const dotenv = require('dotenv');
dotenv.config();

const accesskey = process.env.SES_ACCESSKEY;
const secretaccesskey = process.env.SES_SECRETACCESSKEY;
const sender = '';
const region = process.env.SES_REGION;

module.exports = {
    accesskey,
    secretaccesskey,
    sender,
    region
};

