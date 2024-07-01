const { functionForgotPassword } = require("./MailTemplates");
const { sendEmailv1 } = require("./SendEmailV3");


async function main() {
    try {
        const response = await sendEmailv1("no-replymail.service@shopatbanau.com", "sameerkarn369369@gmail.com", "Subject: Your One-Time Password (OTP) to Access Banau", functionForgotPassword);
        console.log({ 'Mail_SENT': response });
    } catch (error) {
        console.log({ 'Mail_FAILED': error });
    }
}
main();