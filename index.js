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

// Email template function - Professional & Clean Design
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f5f5f5;
          padding: 20px;
          line-height: 1.6;
        }
        .email-wrapper {
          max-width: 650px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #e0e0e0;
        }
        .header {
          background-color: #1a1a1a;
          padding: 30px 40px;
          border-bottom: 3px solid #0066cc;
        }
        .logo {
          font-size: 24px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.5px;
        }
        .content {
          padding: 40px;
        }
        .title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 14px;
          color: #666666;
          margin-bottom: 30px;
        }
        .info-section {
          margin-bottom: 25px;
        }
        .info-row {
          display: table;
          width: 100%;
          margin-bottom: 18px;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 18px;
        }
        .info-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .info-label {
          font-size: 13px;
          font-weight: 600;
          color: #555555;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .info-value {
          font-size: 15px;
          color: #1a1a1a;
          word-wrap: break-word;
        }
        .message-section {
          background-color: #fafafa;
          padding: 25px;
          border-left: 3px solid #0066cc;
          margin-top: 30px;
        }
        .message-label {
          font-size: 13px;
          font-weight: 600;
          color: #555555;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .message-content {
          font-size: 15px;
          color: #333333;
          line-height: 1.7;
          white-space: pre-wrap;
        }
        .footer {
          background-color: #f9f9f9;
          padding: 25px 40px;
          border-top: 1px solid #e0e0e0;
        }
        .footer-text {
          font-size: 13px;
          color: #666666;
          text-align: center;
          margin-bottom: 8px;
        }
        .footer-company {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          text-align: center;
          margin-bottom: 12px;
        }
        .timestamp {
          font-size: 12px;
          color: #999999;
          text-align: center;
        }
        .divider {
          height: 1px;
          background-color: #e0e0e0;
          margin: 25px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <div class="logo">HCI ONE PLATFORM</div>
        </div>
        
        <div class="content">
          <div class="title">New Contact Form Submission</div>
          <div class="subtitle">You have received a new inquiry through your website contact form.</div>
          
          <div class="divider"></div>
          
          <div class="info-section">
            <div class="info-row">
              <div class="info-label">Full Name</div>
              <div class="info-value">${name}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">Email Address</div>
              <div class="info-value">${email}</div>
            </div>
          </div>
          
          <div class="message-section">
            <div class="message-label">Message Content</div>
            <div class="message-content">${message}</div>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-company">HCIC Contact System</div>
          <div class="footer-text">This is an automated notification from your contact form system.</div>
          <div class="timestamp">Received: ${new Date().toLocaleString('en-US', { 
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
      to: 'gaurang@aavrti.com, deepak@aavrti.com',
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
