const nodemailer = require("nodemailer");

try {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "developertest1401@gmail.com",
      pass: "fubs qbll xfgf uamo",
    },
  });
  const mailOptions = {
    from: "prasannajung08@gmail.com",
    to: "sujanshress33@gmail.com",
    subject: "Test email",
    html: "<p>HUTIYA</p>",
  };
  transporter.sendMail(mailOptions, (e, info) => {
    if (e) {
      console.log(e);
    } else {
      console.log("email has been sent", info.response);
    }
  });
} catch (e) {
  console.log(e.message);
}
