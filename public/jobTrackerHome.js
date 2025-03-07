console.log('jobTrackerHome loaded');
const HOST = 'localhost';
let allJobs = [];

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

        const response2 = await axios.get(`http://${HOST}:5000/company/data`, {
            headers: {
                Authorization: `${token}`
            }
        });
        displayCompany(response2.data.allCompanyData);

    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
});

function displayJobs(jobs) {
    console.log('displayJobs jobs', jobs);
    const jobTrackerList = document.getElementById("jobTrackerList");
    jobTrackerList.innerHTML = ""; // Clear previous data

    jobs.forEach(job => {
        //print only not deleted jobs
        if (job.isDeleted === false) {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>Company:</strong> ${job.company} <br>
                <strong>Job Position:</strong> ${job.jobPosition} <br>
                <strong>Job Description:</strong> ${job.jobDescription} <br>
                <strong>Location:</strong> ${job.location} <br>
                <strong>Posted Date:</strong> ${job.postedDate} <br>
                <strong>Saved Date:</strong> ${job.savedDate} <br>
                <strong>Deadline Date:</strong> ${job.deadlineDate} <br>
                <strong>Applied Date:</strong> ${job.appliedDate} <br>
                <strong>Follow-up Date:</strong> ${job.followUpDate} <br>
                <strong>Minimum Salary:</strong> ${job.minimumSalary} ${job.currency} <br>
                <strong>Maximum Salary:</strong> ${job.maximumSalary} ${job.currency} <br>
                <strong>Status:</strong> ${job.status} <br>
                <strong>Excitement Level:</strong> ${job.excitement} <br>
                <button onclick="editJob(${job.id})">Edit</button>
                <button onclick="deleteJob(${job.id})">Delete</button>
                <hr>
            `;
            jobTrackerList.appendChild(li);
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
    }
    catch (err) {
        console.log(('err', err));
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
        <button onclick="cancelJobEdit()">Cancel</button>
    `;
        document.getElementById("editJobContainer").innerHTML = formHtml;
    }
    catch (err) {
        console.log(('err', err));
    }
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
        alert("Job updated successfully!");
    }
    catch (err) {
        console.log(('err', err));
    }
    document.getElementById("editJobContainer").innerHTML = "";
}

function cancelJobEdit() {
    document.getElementById("editJobContainer").innerHTML = "";
}

function filterJobs() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const statusFilter = document.getElementById("statusFilter").value.toLowerCase();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    console.log('searchInput = ', searchInput);
    console.log('statusFilter = ', statusFilter);
    console.log('startDate = ', startDate);
    console.log('endDate = ', endDate);

    const filteredJobs = allJobs.filter(job => {
        const companyMatch = job.company.toLowerCase().includes(searchInput);
        const positionMatch = job.jobPosition.toLowerCase().includes(searchInput);
        const statusMatch = job.status.toLowerCase().includes(searchInput) || (statusFilter ? job.status.toLowerCase() === statusFilter : true);
        console.log('companyMatch = ', companyMatch);
        console.log('positionMatch = ', positionMatch);
        console.log('statusMatch = ', statusMatch);

        const jobDate = new Date(job.appliedDate);
        const startMatch = startDate ? jobDate >= new Date(startDate) : true;
        const endMatch = endDate ? jobDate <= new Date(endDate) : true;

        return (companyMatch || positionMatch || statusMatch) && startMatch && endMatch;
    });
    displayJobs(filteredJobs);
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
    const companyList = document.getElementById("companyList");
    companyList.innerHTML = "";

    companies.forEach(company => {
        if (company.isDeleted === false) {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>Company Name:</strong> ${company.name} <br>
                <strong>Company Size:</strong> ${company.companySize} <br>
                <strong>Company Type:</strong> ${company.companyType} <br>
                <strong>Location:</strong> ${company.location} <br>
                <strong>Website:</strong> <a href="${company.website}" target="_blank">${company.website}</a> <br>
                <strong>LinkedIn:</strong> <a href="${company.linkedIn}" target="_blank">${company.linkedIn}</a> <br>
                <strong>Year Founded:</strong> ${company.yearFounded} <br>
                <strong>Notes:</strong> ${company.notes} <br>
                <button onclick="editCompany(${company.id})">Edit</button>
                <button onclick="deleteCompany(${company.id})">Delete</button>
                <hr>
            `;
            companyList.appendChild(li);
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

        // Generate an edit form with the company's details
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
            <button onclick="cancelCompanyEdit()">Cancel</button>
        `;
        document.getElementById("editCompanyContainer").innerHTML = formHtml;

    } catch (err) {
        console.error("Error fetching company data:", err);
    }
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
        alert("Company updated successfully!");

        document.getElementById("editCompanyContainer").innerHTML = "";
    }
    catch (err) {
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
        alert("Company deleted successfully!");
    } catch (err) {
        console.error("Error deleting company:", err);
    }
}

function cancelCompanyEdit() {
    document.getElementById("editCompanyContainer").innerHTML = "";
}
