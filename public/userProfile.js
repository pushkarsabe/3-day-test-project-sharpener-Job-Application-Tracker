
const HOST = 'localhost';

window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found! User might not be logged in.");
        return;
    }

    try {
        let response = await axios.get(`http://${HOST}:5000/user/singleData`, {
            headers: {
                'Authorization': `${token}`
            }
        })
        let user = response.data.singleUserData;
        console.log("Fetched user data:", user);
        document.getElementById("firstName").value = user.firstName || "";
        document.getElementById("lastName").value = user.lastName || "";
        document.getElementById("inputEmail").value = user.email || "";
    }
    catch (err) {
        console.log('err', err);
    }
})

//function to display the message
function showMessage(msgText, className) {
    return new Promise((resolve) => {
        const msg = document.getElementById('message');
        msg.innerHTML = "";

        const div = document.createElement('div');
        div.style.backgroundColor = "green";
        div.style.color = "white";
        div.style.padding = "10px";
        div.style.borderRadius = "5px";
        div.style.marginTop = "10px";
        div.style.width = "fit-content";
        div.textContent = msgText;

        msg.appendChild(div);

        setTimeout(() => {
            msg.removeChild(div);
            resolve();
        }, 3000);
    })
}

document.getElementById('editUserForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log('userProfile.js loaded');
    const token = localStorage.getItem("token");

    const updatedUserData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("inputEmail").value.trim()
    };

    try {
        const response = await axios.put(`http://${HOST}:5000/user/update`, updatedUserData, {
            headers: {
                'Authorization': `${token}`,
            }
        });
        console.log("User updated successfully:", response.data);
        await showMessage('Profile updated successfully', 'succesMessage');
        window.location.href ='./jobTrackerHome.html';
    }
    catch (error) {
        console.error("Error updating user:", error);
    }

})