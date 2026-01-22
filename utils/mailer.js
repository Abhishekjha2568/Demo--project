const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code ',
            text: `Your OTP for account verification is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        console.log(` Email sent successfully to ${email}`);
    } catch (error) {
        console.error(" Email sending failed:", error.message);
    }
};

module.exports = { sendOTP };