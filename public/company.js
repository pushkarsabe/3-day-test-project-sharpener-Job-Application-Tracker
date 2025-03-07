const HOST = 'localhost';
console.log('company.js loaded');

document.getElementById('companyForm').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('HOST = ' + HOST);
    submitData();
});

async function submitData() {
    console.log('inside submitData new company');
    let token = localStorage.getItem('token');
    console.log(token);
    // Get form values
    const name = document.getElementById("name").value.trim();
    const companySize = document.getElementById("companySize").value.trim();
    const companyType = document.getElementById("companyType").value.trim();
    const location = document.getElementById("location").value.trim();
    const website = document.getElementById("website").value.trim();
    const linkedIn = document.getElementById("linkedIn").value.trim();
    const yearFounded = document.getElementById("yearFounded").value.trim();
    const notes = document.getElementById("notes").value.trim();

    if (!name) {
        console.log("Empty name field");
    }
    else {

        const formData = {
            name,
            companySize,
            companyType,
            location,
            website,
            linkedIn,
            yearFounded,
            notes
        };

        try {
            const response = await axios.post(`http://${HOST}:5000/company/add`, formData, {
                headers: {
                    'Authorization': `${token}`
                }
            });
            console.log('response data = ' + JSON.stringify(response.data));
            //this will give the data inside the array
            console.log('Full response:', response.data.newCompany);
            window.location.href = './jobTrackerHome.html';
        }
        catch (error) {
            console.log('error:', error);
            if (error.response) {
                if (error.response.status == 401 || error.response.data == 403 || error.response.data == 404) {
                    console.log('Error object:', error.response.data.message);
                } else {
                    console.log('Unhandled error:', error);
                }
            }

        }
    }
}//submitData
