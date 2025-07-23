const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: `"Comics Viñeta" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
}

module.exports = sendEmail;
