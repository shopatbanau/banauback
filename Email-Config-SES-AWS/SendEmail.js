const AWS = require('aws-sdk');
const { accesskey, secretaccesskey, region, sender } = require('./EmailConfig');
require('dotenv').config();
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const SES_CONFIG = {
    accessKeyId: accesskey,
    secretAccessKey: secretaccesskey,
    region: region,
};

const AWS_SES = new AWS.SES(SES_CONFIG);

const sendEmail = async (recipientEmail, name) => {
    let params = {
        Source: sender,
        Destination: {
            ToAddresses: [
                recipientEmail
            ],
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: '<h1>This is the body of my email! v1</h1>',
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "This is the body of my email!  v1"
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: `Hello, ${name}!`,
            }
        },
    };

    try {
        const res = await AWS_SES.sendEmail(params).promise();
        console.log('Email has been sent!', res);
    } catch (error) {
        console.error({error});
    }
};

sendEmail("karnsameer125@gmail.com", "Nischal Karn");

