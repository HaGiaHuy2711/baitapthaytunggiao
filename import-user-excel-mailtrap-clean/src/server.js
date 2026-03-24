require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

console.log('MAIL_HOST:', process.env.MAIL_HOST);
console.log('MAIL_PORT:', process.env.MAIL_PORT);
console.log('MAIL_USER:', process.env.MAIL_USER);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});