# Email Setup Guide for Placify Feedback System

This guide will help you set up the nodemailer-based email system for the feedback functionality.

## 📧 Email Configuration Setup

### 1. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
   - Copy the 16-character password (remove spaces)

### 2. Environment Variables

Create a `.env` file in the `server` directory with these variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/placify-db

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration for Nodemailer
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
FEEDBACK_EMAIL=placify.feedback@gmail.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Email Service Configuration

The email service supports multiple providers:

#### Gmail (Default)
```javascript
service: 'gmail'
```

#### Outlook/Hotmail
```javascript
service: 'hotmail'
```

#### Yahoo
```javascript
service: 'yahoo'
```

#### Custom SMTP
```javascript
host: 'smtp.your-provider.com',
port: 587,
secure: false
```

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Set up Environment Variables**:
   - Copy `.env.example` to `.env`
   - Fill in your email credentials

3. **Start the Server**:
   ```bash
   npm start
   ```

4. **Test Email Configuration**:
   - Visit: `http://localhost:5000/api/feedback/test`
   - Or use the frontend feedback form

## 📋 API Endpoints

### Send Feedback
```
POST /api/feedback
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "rating": 5,
  "testimonial": "Great platform!",
  "improvements": ["Better UI", "Faster loading"],
  "additionalFeedback": "Keep up the great work!"
}
```

### Test Email Configuration
```
GET /api/feedback/test
```

## 🛠️ Troubleshooting

### Common Issues

1. **Authentication Error**:
   - Ensure 2FA is enabled on Gmail
   - Use App Password, not regular password
   - Check EMAIL_USER and EMAIL_PASS in .env

2. **Connection Timeout**:
   - Check internet connection
   - Verify email service settings
   - Try different email provider

3. **"Less Secure Apps" Error**:
   - Use App Passwords instead
   - Enable 2FA on Gmail account

### Testing Commands

1. **Test from Terminal**:
   ```bash
   curl -X GET http://localhost:5000/api/feedback/test
   ```

2. **Test Feedback Submission**:
   ```bash
   curl -X POST http://localhost:5000/api/feedback \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","rating":5,"testimonial":"Test feedback"}'
   ```

## 📧 Email Template

The system automatically formats feedback emails with:

- User information (name, email)
- Star rating
- Testimonial content
- Improvement suggestions
- Additional feedback
- Timestamp

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use App Passwords, not regular passwords
- Consider using environment variables in production
- Monitor email usage to avoid rate limits

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_USER` | Your email address | `your-email@gmail.com` |
| `EMAIL_PASS` | App password (16 chars) | `abcd efgh ijkl mnop` |
| `FEEDBACK_EMAIL` | Where to send feedback | `feedback@yourcompany.com` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## ✅ Verification Checklist

- [ ] Gmail 2FA enabled
- [ ] App password generated
- [ ] `.env` file configured
- [ ] Nodemailer dependency installed
- [ ] Server running on correct port
- [ ] Test endpoint returns success
- [ ] Feedback form submits successfully
- [ ] Email received in inbox

## 📞 Support

If you encounter issues:

1. Check the server console for error messages
2. Verify all environment variables are set
3. Test with the `/api/feedback/test` endpoint
4. Check Gmail security settings
5. Ensure the server is running and accessible
