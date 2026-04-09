import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        // This forces IPv4 and prevents the ENETUNREACH error
        family: 4
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
