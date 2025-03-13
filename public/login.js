//local variables
const HOST = 'localhost';
console.log('login.js loaded');

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('HOST = ' + HOST);
    console.log('Submit event triggered');
    submitData();
});
document.getElementById('signupBtn').addEventListener('click', function () {
    window.location.href = './signup.html';
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
    // event.preventDefault();
    console.log('inside submitData login');
    // Get values from the form
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    // console.log('HOST = ' + HOST);
    console.log('email = ' + email);
    console.log('password = ' + password);

    if (email == "" || password == "") {
        console.log("Empty user fields");
        await showMessage('please enter the data', 'failureMessage');
    }
    else {
        const obj = {
            email: email,
            password: password
        }

        try {
            const response = await axios.post(`http://${HOST}:5000/user/login`, obj);
            console.log('response data = ' + JSON.stringify(response.data));
            //this will give the data inside the array
            console.log('Full response:', response);
            console.log('email = ' + response.data.userDetails.email);
            console.log('password = ' + response.data.userDetails.password);
            console.log('token = ' + response.data.token);
            localStorage.setItem('token', response.data.token);

            await showMessage('Email and Password verified', 'succesMessage');
            window.location.href = './jobTrackerHome.html';
        }
        catch (error) {
            if (error.response) {
                // Server responded with a status outside 2xx
                const status = error.response.status;
                const errorMessage = error.response.data.message || 'An error occurred';

                if (status === 401) {
                    await showMessage('Incorrect password. Please try again.', 'failureMessage');
                } else if (status === 403) {
                    await showMessage('Access denied. Something went wrong.', 'failureMessage');
                } else if (status === 404) {
                    await showMessage('User not found. Please register first.', 'failureMessage');
                } else {
                    await showMessage(errorMessage, 'failureMessage');
                }
            } else {
                // Network error or server didn't respond
                await showMessage('Network error. Please try again later.', 'failureMessage');
            }
        }
    }

    //to clear the fields
    document.getElementById('inputEmail').value = "";
    document.getElementById('inputPassword').value = "";
}//submitData
