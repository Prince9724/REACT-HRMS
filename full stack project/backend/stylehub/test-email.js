import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const testEmail = async () => {
  try {
    console.log('📧 Testing Email...');
    console.log('From:', process.env.EMAIL_USER);
    console.log('To: your_email@gmail.com');
    
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: 'your_email@gmail.com', // अपनी email डालें
      subject: 'Test Email from StyleHub',
      html: '<h1>✅ Test Email Working!</h1><p>If you see this, email is configured correctly.</p>'
    });
    
    console.log('✅ Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full Error:', error);
  }
};

testEmail();