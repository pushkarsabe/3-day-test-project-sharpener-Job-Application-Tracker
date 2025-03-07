const HOST = 'localhost';
console.log('newjob.js loaded');

document.getElementById('submitJobApplication').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('HOST = ' + HOST);
    submitData();
});

async function submitData() {
    console.log('inside submitData newjob');
    let token = localStorage.getItem('token');
    console.log(token);
    const formData = new FormData();
    formData.append('jobDescription', document.getElementById('jobDescription').value);
    formData.append('notes', document.getElementById('notes').value);
    formData.append('postedDate', document.getElementById('postedDate').value);
    formData.append('savedDate', document.getElementById('savedDate').value);
    formData.append('deadlineDate', document.getElementById('deadlineDate').value);
    formData.append('appliedDate', document.getElementById('appliedDate').value);
    formData.append('followUpDate', document.getElementById('followUpDate').value);
    formData.append('jobPosition', document.getElementById('jobPosition').value);
    formData.append('company', document.getElementById('company').value);
    formData.append('minimumSalary', document.getElementById('minimumSalary').value);
    formData.append('maximumSalary', document.getElementById('maximumSalary').value);
    formData.append('currency', document.getElementById('currency').value);
    formData.append('salaryPayPeriod', document.getElementById('salaryPayPeriod').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('status', document.getElementById('status').value);
    formData.append('excitement', document.getElementById('excitement').value);

    const resumes = document.getElementById('resumes').files[0];
    const coverLetter = document.getElementById('coverLetter').files[0];
    if (resumes) {
        formData.append('resumes', resumes);
    }

    if (coverLetter) {
        formData.append('coverLetter', coverLetter);
    }

    console.log('Form Data:', Object.fromEntries(formData.entries()));

    if (savedDate == "") {
        console.log("Empty savedDate field");
    }
    else {

        try {
            const response = await axios.post(`http://${HOST}:5000/jobTracker/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${token}`
                }
            });
            console.log('response data = ' + JSON.stringify(response.data));
            console.log('Full response:', response);
            window.location.href = './jobTrackerHome.html'
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
