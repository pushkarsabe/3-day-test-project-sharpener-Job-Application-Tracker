let HOST = 'localhost';

console.log('signup.js loaded');
document.getElementById('signupForm').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Submit event triggered');
    submitData();
});

document.getElementById('loginBtn').addEventListener('click', function () {
    window.location.href = './login.html';
});

//function to display the message
function showMessage(msgText, className) {
    return new Promise((resolve) => {
        const msg = document.getElementById('message');
        const div = document.createElement('div');
        const textNode = document.createTextNode(msgText);
        div.appendChild(textNode);
        msg.appendChild(div);
        msg.classList.add(className);

        setTimeout(() => {
            msg.classList.remove(className);
            msg.removeChild(div);
            resolve();
        }, 3000);
    })
}

async function submitData() {
    // Get values from the form
    const firstName = document.getElementById('firstName').value;
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    console.log('firstName = ' + firstName);
    console.log('email = ' + email);
    console.log('password = ' + password);

    if (firstName == "" || email == "" || password == "") {
        console.log('data is missing');
        await showMessage('please enter the data', 'failureMessage');
    } else {
        const obj = {
            firstName: firstName,
            email: email,
            password: password
        }
        try {
            const response = await axios.post(`http://${HOST}:5000/user/signup`, obj);

            console.log('data added');
            console.log('response data = ' + JSON.stringify(response));
            console.log('response firstName = ' + response.data.newUserData.firstName);
            console.log('response email = ' + response.data.newUserData.email);
            console.log('response password = ' + response.data.newUserData.password);

            await showMessage('new user created successfully', 'succesMessage');
            window.location.href = './login.html';

        } catch (error) {
            if (error.response) {
                console.log('Server Response Data:', error.response.data);
                console.log('Status Code:', error.response.status);
                console.log('Headers:', error.response.headers);
                // Show error message from the backend
                await showMessage(error.response.data.error || 'Signup failed', 'failureMessage');
            } else if (error.request) {
                console.log('No response received from server', error.request);
            } else {
                console.log('Unexpected Error:', error.message);
            }
        }
    }

    //to clear the input feilds after user clicks on submit
    document.getElementById('firstName').value = "";
    document.getElementById('inputEmail').value = "";
    document.getElementById('inputPassword').value = "";

}//submitData
