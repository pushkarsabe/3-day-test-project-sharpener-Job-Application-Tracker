const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const sendEmail = async (recipientEmail, subject, message) => {
    try {
        console.log('inside sendEmail recipientEmail = ', recipientEmail);
        console.log('subject = ', subject);
        const apiKey = process.env.apiKey;
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;

        const emailContent = `
        <html>
            <body>
                <h1>${subject}</h1>
                <p>${message}</p>
            </body>
        </html>
         `;

        const emailData = {
            sender: {
                name: 'Job Tracker',
                email: 'sabepushkar@gmail.com',
            },
            to: [
                {
                    email: 'pushkarsabe1@gmail.com',
                },
            ],
            subject: subject,
            htmlContent: emailContent,
        };

        await apiInstance.sendTransacEmail(emailData);
        console.log('Email sent successfully!');
    }
    catch (err) {
        console.error('Error sending email:', err);
        throw new Error('Error sending email');
    }
};

module.exports = sendEmail;
