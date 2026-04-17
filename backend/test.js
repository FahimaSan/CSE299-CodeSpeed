bconst axios = require('axios');

axios.post('http://localhost:5000/register', {
    username: "testuser",
    email: "test@example.com",
    passwordHash: "hashedpassword123"
})
.then(response => console.log("Response:", response.data))
.catch(error => console.error("Error:", error.response ? error.response.data : error.message));
