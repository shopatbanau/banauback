const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { accesskey, secretaccesskey, region, sender } = require("./EmailConfig");

const SES_CONFIG = {
  credentials: {
    accessKeyId: accesskey,
    secretAccessKey: secretaccesskey,
  },
  region: region,
};

console.log({ SES_CONFIG });
// Create SES service object.
const sesClient = new SESClient(SES_CONFIG);

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
          Data: '<h1>This is the body of my email!</h1> v3',
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the body of my email! v3"
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Hello, ${name}!`,
      }
    },
  };

  try {
    const sendEmailCommand = new SendEmailCommand(params);
    const res = await sesClient.send(sendEmailCommand);
    console.log('Email has been sent! v3', res);
  } catch (error) {
    console.error(error);
  }
};

const sendEmailv1 = (from, to, subject, msg) => {
  return new Promise(async (resolve, reject) => {
    let params = {
      Source: from,
      Destination: {
        ToAddresses: [
          to
        ],
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: msg,
          },
          Text: {
            Charset: "UTF-8",
            Data: msg
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        }
      },
    };

    try {
      const sendEmailCommand = new SendEmailCommand(params);
      const res = await sesClient.send(sendEmailCommand);
      console.log('Email has been sent! v3', res);
      return resolve(res);
    } catch (error) {
      console.error(error);
      return reject(error);
    }
  });
};

// sendEmail("nischalkarn369369@gmail.com", "Sahil Karn");
// sendEmailv1("no-replymail.service@shopatbanau.com", "saikanepal@gmail.com", "Order:Confirmed", "Details");

module.exports = {
  sendEmailv1
};