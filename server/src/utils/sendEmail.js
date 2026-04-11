import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000
});

const sendEmail = async (options) => {
    console.log(`📧 Attempting to send email to: ${options.email}...`);

    const mailOptions = {
        from: `BizDirect <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${options.email}`);
    } catch (error) {
        console.error(`❌ Detailed Email Error: ${error.message}`);
        throw error; // Rethrow so it can be caught in the controller
    }
};

export default sendEmail;
