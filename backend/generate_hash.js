const bcrypt = require('bcrypt');
async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function generateAndLogHash() {
    const plainPassword = "mysecretpassword"; // Replace with your password
    const hashedPassword = await hashPassword(plainPassword);
    console.log("Hashed Password:", hashedPassword);
}
generateAndLogHash();

