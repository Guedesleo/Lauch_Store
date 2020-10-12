const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "a56fb549536c49",
      pass: "c5298cac1e1614"
    }
  });
