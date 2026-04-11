import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
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
    } catch (error) {
        console.error(`❌ Resend Exception: ${error.message}`);
        throw error;
    }
};

export default sendEmail;
