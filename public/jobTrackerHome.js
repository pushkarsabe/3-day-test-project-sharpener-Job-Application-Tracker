console.log('jobTrackerHome loaded');
const HOST = 'localhost';
let allJobs = [];
let allCompanies = [];
let myChartInstance = null;

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found! User might not be logged in.");
        return;
    }

    try {
        const response1 = await axios.get(`http://${HOST}:5000/jobTracker/data`, {
            headers: {
                Authorization: `${token}`
            }
        });
        allJobs = response1.data.allJobData;
        displayJobs(allJobs);
        // console.log('allJobs = ', allJobs);
        displayChart();

        const response2 = await axios.get(`http://${HOST}:5000/company/data`, {
            headers: {
                Authorization: `${token}`
            }
        });
        allCompanies = response2.data.allCompanyData;
        displayCompany(response2.data.allCompanyData);

    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
});

function displayChart() {
    const ctx = document.getElementById('myChart');

    // If chart already exists, update the dataset
    if (myChartInstance) {
        myChartInstance.data.datasets[0].data = calculateChartData();
        myChartInstance.update(); // Refresh the chart
    } else {
        myChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['All Statuses', 'Interview', 'Rejected', 'Offer', 'Accepted', 'Applied'],
                datasets: [{
                    label: 'Jobs and Status',
                    data: calculateChartData(), // Get updated values
                    backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple', 'orange'],
                    borderColor: ['rgba(0, 0, 0, 0.8)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

function calculateChartData() {
    let allStatusCount = allJobs.length,
        interviewCount = 0, rejectedcount = 0, offerCount = 0,
        acceptedCount = 0, appliedCount = 0;

    allJobs.forEach(job => {
        switch (job.status.trim().toLowerCase()) {
            case 'interview': interviewCount++; break;
            case 'rejected': rejectedcount++; break;
            case 'offer': offerCount++; break;
            case 'accepted': acceptedCount++; break;
            case 'applied': appliedCount++; break;
        }
    });
    console.log('allStatusCount', allStatusCount, 'interviewCount', interviewCount, 'rejectedcount', rejectedcount, 'offerCount', offerCount, 'acceptedCount', acceptedCount, 'appliedCount', appliedCount);
    return [allStatusCount, interviewCount, rejectedcount, offerCount, acceptedCount, appliedCount];
}




function openProfilePopup() {
    document.getElementById('profilePopup').style.display = 'block';
    loadUserData();
}
function closeProfilePopup() {
    document.getElementById('profilePopup').style.display = 'none';
}
async function loadUserData() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found! User might not be logged in.");
        return;
    }

    try {
        let response = await axios.get(`http://${HOST}:5000/user/singleData`, {
            headers: { 'Authorization': `${token}` }
        });

        let user = response.data.singleUserData;
        console.log("Fetched user data:", user);
        document.getElementById("firstName").value = user.firstName || "";
        document.getElementById("lastName").value = user.lastName || "";
        document.getElementById("inputEmail").value = user.email || "";
    } catch (err) {
        console.log('Error fetching user data:', err);
    }
}
function showMessage(msgText, status) {
    return new Promise((resolve) => {
        const existingMsg = document.getElementById("floatingMessage");
        if (existingMsg) {
            existingMsg.remove();
        }

        const msgDiv = document.createElement("div");
        msgDiv.id = "floatingMessage";
        msgDiv.classList.add("message-box", status === "success" ? "success" : "failure");
        msgDiv.textContent = msgText;

        document.body.prepend(msgDiv);

        setTimeout(() => {
            msgDiv.remove();
            resolve();
        }, 2000);
    });
}
document.getElementById('editUserForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log('Updating user profile...');

    const token = localStorage.getItem("token");
    const updatedUserData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("inputEmail").value.trim()
    };

    try {
        const response = await axios.put(`http://${HOST}:5000/user/update`, updatedUserData, {
            headers: { 'Authorization': `${token}` }
        });

        console.log("User updated successfully:", response.data);
        closeProfilePopup();
        await showMessage('Profile updated successfully', "success");
    } catch (error) {
        console.error("Error updating user:", error);
        await showMessage('Could Not Update Profile', "failure");
    }
});


function displayJobs(jobs) {
    console.log('displayJobs jobs', jobs);
    const jobTrackerTableBody = document.getElementById("jobTrackerTableBody");
    jobTrackerTableBody.innerHTML = "";

    jobs.forEach(job => {
        if (!job.isDeleted) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${job.company}</td>
                <td>${job.jobPosition}</td>
                <td>${job.status}</td>
                <td>${job.location}</td>
                <td>${job.appliedDate || "N/A"}</td>
                <td>${job.minimumSalary} - ${job.maximumSalary} ${job.currency}</td>
                <td>
                    <button onclick="editJob(${job.id})">Edit</button>
                    <button onclick="deleteJob(${job.id})">Delete</button>
                </td>
            `;

            jobTrackerTableBody.appendChild(row);
        }
    });
}

async function deleteJob(jobId) {
    console.log(`deleteJob job with ID: ${jobId}`);
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found! User might not be logged in.");
        return;
    }
    const isConfirmed = confirm("Are you sure you want to delete this job?");
    if (!isConfirmed) {
        console.log("Job deletion canceled.");
        return;
    }
    try {
        const response = await axios.delete(`http://${HOST}:5000/jobTracker/delete/${jobId}`, {
            headers: {
                Authorization: `${token}`
            }
        });
        console.log("Job deleted successfully:", response);
        await showMessage('Job Deleted successfully', "success");

        const updatedJobResponse = await axios.get(`http://${HOST}:5000/jobTracker/data`, {
            headers: {
                Authorization: `${token}`
            }
        });

        allJobs = updatedJobResponse.data.allJobData;
        displayJobs(allJobs);
        displayChart();
    }
    catch (err) {
        console.log(('err', err));
        await showMessage('Can Not Delete Job', "failure");
    }
}

async function editJob(jobId) {
    console.log(`Editing job with ID: ${jobId}`);
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found! User might not be logged in.");
        return;
    }
    try {
        const response = await axios.get(`http://${HOST}:5000/jobTracker/data/${jobId}`, {
            headers: {
                Authorization: `${token}`
            }
        });
        let job = response.data.singleJobData;
        console.log(('job', job));

        const formHtml = `
        <h3>Edit Job</h3>
        <label>Company: <input type="text" id="editCompany" value="${job.company}"></label><br>
        <label>Job Position: <input type="text" id="editJobPosition" value="${job.jobPosition}"></label><br>
        <label>Job Description: <textarea id="editJobDescription">${job.jobDescription}</textarea></label><br>
        <label>Location: <input type="text" id="editLocation" value="${job.location}"></label><br>
        <label>Status: <input type="text" id="editStatus" value="${job.status}"></label><br>
        <button onclick="saveJob(${job.id})">Save</button>
        <button onclick="closeEditJobModal()">Cancel</button>
    `;
        document.getElementById("editJobContainer").innerHTML = formHtml;
        document.getElementById("editJobModal").style.display = "block";
    }
    catch (err) {
        console.log(('err', err));
    }
}
function closeEditJobModal() {
    document.getElementById("editJobModal").style.display = "none";
    document.getElementById("editJobContainer").innerHTML = "";
}

async function saveJob(jobId) {
    console.log(`saveJob job with ID: ${jobId}`);
    const token = localStorage.getItem("token");

    const updatedJobData = {
        company: document.getElementById("editCompany").value,
        jobPosition: document.getElementById("editJobPosition").value,
        jobDescription: document.getElementById("editJobDescription").value,
        location: document.getElementById("editLocation").value,
        status: document.getElementById("editStatus").value
    };

    try {
        const response = await axios.put(`http://${HOST}:5000/jobTracker/update/${jobId}`, updatedJobData, {
            headers: {
                Authorization: `${token}`
            }
        });
        console.log("Update response:", response.data);
        closeEditJobModal();
        showMessage("Job Updated Successfully", 'success');

        const updatedJobResponse = await axios.get(`http://${HOST}:5000/jobTracker/data`, {
            headers: {
                Authorization: `${token}`
            }
        });

        allJobs = updatedJobResponse.data.allJobData;
        displayJobs(allJobs);
        displayChart();
    }
    catch (err) {
        showMessage("Could Not Update Job", 'failure');
        console.log(('err', err));
    }
}

function cancelJobEdit() {
    document.getElementById("editJobContainer").innerHTML = "";
}

async function filterJobs() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const statusFilter = document.getElementById("statusFilter").value.toLowerCase();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const token = localStorage.getItem("token");

    console.log('searchInput =', searchInput);
    console.log('statusFilter =', statusFilter);
    console.log('startDate =', startDate);
    console.log('endDate =', endDate);

    const params = new URLSearchParams();
    if (searchInput) params.append('search', searchInput);
    if (statusFilter) params.append('status', statusFilter);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    console.log('params =', params);

    try {
        const response = await axios.get(`http://localhost:5000/jobTracker/filter?${params.toString()}`, {
            headers: {
                Authorization: `${token}`
            }
        });
        console.log('response =', response.data.filteredJobs);
        displayJobs(response.data.filteredJobs);
    }
    catch (error) {
        console.error("Error fetching jobs:", error);
    }
}

document.getElementById("searchInput").addEventListener("input", filterJobs);
document.getElementById("statusFilter").addEventListener("change", filterJobs);
document.getElementById("startDate").addEventListener("change", filterJobs);
document.getElementById("endDate").addEventListener("change", filterJobs);

function clearFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("statusFilter").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    displayJobs(allJobs);
}



function displayCompany(companies) {
    console.log('displayCompany companies', companies);
    const tableBody = document.getElementById("companyTableBody");
    tableBody.innerHTML = "";

    companies.forEach(company => {
        if (company.isDeleted === false) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${company.name}</td>
                <td>${company.location}</td>
                <td>${company.companySize}</td>
                <td>${company.companyType}</td>
                <td><a href="${company.website}" target="_blank">${company.website}</a></td>
                <td><a href="${company.linkedIn}" target="_blank">${company.linkedIn}</a></td>
                <td>${company.yearFounded}</td>
                <td>${company.notes}</td>
                <td>
                    <button onclick="editCompany(${company.id})">Edit</button>
                    <button onclick="deleteCompany(${company.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        }
    });
}

async function editCompany(companyId) {
    console.log(`Editing company with ID: ${companyId}`);
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found! User might not be logged in.");
        return;
    }

    try {
        // Fetch company details
        const response = await axios.get(`http://${HOST}:5000/company/data/${companyId}`, {
            headers: {
                Authorization: `${token}`
            }
        });

        let company = response.data.singleCompanyData;
        console.log('Company data:', company);

        // Generate an edit form inside modal
        const formHtml = `
            <h3>Edit Company</h3>
            <label>Company Name: <input type="text" id="editCompanyName" value="${company.name}"></label><br>
            <label>Company Size: <input type="text" id="editCompanySize" value="${company.companySize}"></label><br>
            <label>Company Type: <input type="text" id="editCompanyType" value="${company.companyType}"></label><br>
            <label>Location: <input type="text" id="editLocation" value="${company.location}"></label><br>
            <label>Website: <input type="text" id="editWebsite" value="${company.website}"></label><br>
            <label>LinkedIn: <input type="text" id="editLinkedIn" value="${company.linkedIn}"></label><br>
            <label>Year Founded: <input type="number" id="editYearFounded" value="${company.yearFounded}"></label><br>
            <label>Notes: <textarea id="editNotes">${company.notes}</textarea></label><br>
            <button onclick="saveCompany(${company.id})">Save</button>
            <button onclick="closeEditCompanyModal()">Cancel</button>
        `;
        document.getElementById("editCompanyContainer").innerHTML = formHtml;
        document.getElementById("editCompanyModal").style.display = "block";

    } catch (err) {
        console.error("Error fetching company data:", err);
    }
}

function closeEditCompanyModal() {
    document.getElementById("editCompanyModal").style.display = "none";
    document.getElementById("editCompanyContainer").innerHTML = "";
}

async function saveCompany(companyId) {
    console.log(`Saving company with ID: ${companyId}`);
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found! User might not be logged in.");
        return;
    }

    // Get updated values from form inputs
    const updatedCompanyData = {
        name: document.getElementById("editCompanyName").value,
        companySize: document.getElementById("editCompanySize").value,
        companyType: document.getElementById("editCompanyType").value,
        location: document.getElementById("editLocation").value,
        website: document.getElementById("editWebsite").value,
        linkedIn: document.getElementById("editLinkedIn").value,
        yearFounded: document.getElementById("editYearFounded").value,
        notes: document.getElementById("editNotes").value
    };

    try {
        const response = await axios.put(`http://${HOST}:5000/company/update/${companyId}`, updatedCompanyData, {
            headers: {
                "Authorization": `${token}`
            }
        });
        console.log("Company updated successfully:", response.data);
        document.getElementById("editCompanyContainer").innerHTML = "";
        showMessage("Company Updated Successfully", 'success');

        closeEditCompanyModal();

        const response2 = await axios.get(`http://${HOST}:5000/company/data`, {
            headers: {
                Authorization: `${token}`
            }
        });
        allCompanies = response2.data.allCompanyData;
        displayCompany(response2.data.allCompanyData);
    }
    catch (err) {
        showMessage("Could Not Update Company", 'failure');
        console.error("Error updating company:", err);
    }
}
async function deleteCompany(companyId) {
    console.log(`Deleting company with ID: ${companyId}`);
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found! User might not be logged in.");
        return;
    }

    // Confirm before deleting
    const isConfirmed = confirm("Are you sure you want to delete this company?");
    if (!isConfirmed) {
        console.log("Company deletion canceled.");
        return;
    }

    try {
        const response = await axios.delete(`http://${HOST}:5000/company/delete/${companyId}`, {
            headers: {
                Authorization: `${token}`
            }
        });

        console.log("Company deleted successfully:", response);
        showMessage("Company Deleted Successfully!", 'success');

        const response2 = await axios.get(`http://${HOST}:5000/company/data`, {
            headers: {
                Authorization: `${token}`
            }
        });
        allCompanies = response2.data.allCompanyData;
        displayCompany(response2.data.allCompanyData);
    } catch (err) {
        showMessage("Could Not Update Company", 'failure');
        console.error("Error deleting company:", err);
    }
}

function cancelCompanyEdit() {
    document.getElementById("editCompanyContainer").innerHTML = "";
}

async function searchCompany() {
    const searchInputCompany = document.getElementById("companySearchInput").value.trim().toLowerCase();
    const token = localStorage.getItem("token");
    console.log('searchInputCompany =', searchInputCompany);

    if (!searchInputCompany) {
        console.log("Search input is empty, clearing results.");
        displayCompany(allCompanies);
        return;
    }

    if (!token) {
        console.error("No token found! User might not be logged in.");
        return;
    }
    try {
        const response = await axios.get(`http://localhost:5000/company/search/${searchInputCompany}`, {
            headers: {
                Authorization: `${token}`
            }
        });
        console.log('response =', response.data.filteredCompany);
        displayCompany(response.data.filteredCompany);
    }
    catch (error) {
        console.error("Error fetching companie:", error);
    }
}
document.getElementById("companySearchInput").addEventListener("input", searchCompany);
