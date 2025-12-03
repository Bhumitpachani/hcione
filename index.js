const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// CORS Configuration - Allow all origins
app.use(cors({
  origin: '*', // Allow all origins, or specify your frontend URL like 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Middleware to parse JSON
app.use(express.json());

// Email template function
const getEmailTemplate = (name, email, message) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Submission</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f7fa;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .info-card {
          background-color: #f8f9fc;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 8px;
        }
        .info-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .info-value {
          font-size: 16px;
          color: #2d3748;
          word-wrap: break-word;
        }
        .message-box {
          background-color: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }
        .message-box .info-label {
          color: #764ba2;
          border-left: none;
        }
        .message-box .info-value {
          line-height: 1.6;
          color: #4a5568;
        }
        .footer {
          background-color: #f8f9fc;
          padding: 25px 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          font-size: 13px;
          color: #718096;
          margin-bottom: 8px;
        }
        .timestamp {
          font-size: 12px;
          color: #a0aec0;
          margin-top: 10px;
        }
        .badge {
          display: inline-block;
          background-color: #48bb78;
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>HCI ONE Platform</h1>
        </div>
        
        <div class="content">
          <div class="info-card">
            <div class="info-label">👤 Full Name</div>
            <div class="info-value">${name}</div>
          </div>
          
          <div class="info-card">
            <div class="info-label">📧 Email Address</div>
            <div class="info-value">${email}</div>
          </div>
          
          <div class="message-box">
            <div class="info-label">💬 Message</div>
            <div class="info-value">${message}</div>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>HCIC Contact System</strong></p>
          <p>This is an automated message from your contact form</p>
          <div class="timestamp">Received on: ${new Date().toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'bhumit@aavrti.com',
    pass: 'vbidldtilmpcemqg'
  }
});

// API endpoint to send email
app.post('/api/send-contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const htmlTemplate = getEmailTemplate(name, email, message);

    // Email options - FIXED SYNTAX ERROR
    const mailOptions = {
      from: '"aavrti Contact Form" <bhumit@aavrti.com>',
      to: 'gaurang@aavrti.com, deepak@aavrti.com, arpan@aavrti.com',
      subject: `New Contact Form Submission from ${name}`,
      html: htmlTemplate,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` // Fixed: Added closing quote
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Nodemailer API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
