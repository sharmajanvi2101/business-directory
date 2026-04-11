import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // Helps with some hosting provider restrictions
    }
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
