
const functionForgotPassword = (user = 'User', otp = 123456) => {
    return `
Subject: Your One-Time Password (OTP) to Access Banau

Dear ${user},

We've sent you an OTP as part of our security protocol. This ensures that only authorized users can access your account.

One-Time Password (OTP): [${otp}]


If you encounter any issues or have concerns, please feel free to reach out to our support team at contactbanau@gmail.com.

Thank you for your understanding and cooperation in maintaining the security of your account!

Best regards,

Banau PVT LTD

`;
};

module.exports = {
    functionForgotPassword
};