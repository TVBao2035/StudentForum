const bcrypt = require('bcryptjs');
const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const newPassword = bcrypt.hashSync(password, salt);
    return newPassword;
}
module.exports = hashPassword;