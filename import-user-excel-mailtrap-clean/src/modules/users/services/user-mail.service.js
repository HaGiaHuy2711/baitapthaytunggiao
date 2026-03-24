const { mailTransporter } = require('../../../config/mail.config');

async function sendAccountEmail(toEmail, username, plainPassword) {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: toEmail,
    subject: 'Thong tin tai khoan cua ban',
    html: `
      <h2>Chao ${username},</h2>
      <p>Tai khoan cua ban da duoc tao thanh cong.</p>
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Password:</strong> ${plainPassword}</p>
      <p>Vui long doi mat khau sau lan dang nhap dau tien.</p>
    `
  };

  return await mailTransporter.sendMail(mailOptions);
}

module.exports = {
  sendAccountEmail
};