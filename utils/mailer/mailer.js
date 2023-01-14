//****** Objetivo del archivo ********
// Este archivo crea el transporter de nodemailer para ser utilizado

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
  }
});

module.exports = transporter