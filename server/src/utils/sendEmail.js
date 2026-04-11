import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options) => {
    console.log(`📧 Attempting to send email via Resend to: ${options.email}...`);

    try {
        const { data, error } = await resend.emails.send({
            from: 'BizDirect <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            html: options.html,
        });

        if (error) {
            console.error(`❌ Resend Error: ${error.message}`);
            throw new Error(error.message);
        }

        console.log(`✅ Email sent successfully via Resend. ID: ${data.id}`);
        return data;
    } catch (error) {
        console.error(`❌ Resend Exception: ${error.message}`);
        throw error;
    }
};

export const sendEmailTest = async () => {
    try {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev', // default testing email
            to: 'your_email@gmail.com',
            subject: 'Hello from Resend',
            html: '<h1>Email working 🚀</h1>',
        });

        console.log("Email sent:", response);
    } catch (error) {
        console.log("Error sending email:", error);
    }
};
