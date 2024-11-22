const showLeaderboard = document.getElementById("showLeaderboard");
const leaderboard = document.getElementById("leaderboard");
const leaderBoardDiv = document.getElementById("leaderBoardDiv");

showLeaderboard.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        leaderboard.style.display = "block";
        const token = localStorage.getItem('token');

        const response = await axios.get('leaderBoard/showLeaderboard', { headers: { 'Authorization': token } });
        //console.log(response);

        leaderBoardDiv.innerHTML = `<div  class="text-center mb-3">
            <span id="leaderboard" class="fw-bold fs-4">Leader Board</span>
        </div>`;   //clear previous content

        const centeredContainer = document.createElement("div");
        centeredContainer.className = 'container d-flex justify-content-center';

        const ul = document.createElement('ul');
        ul.className = 'list-group w-75 text-center';

        response.data.leaderBoardData.forEach((userDetails) => {
            const li = document.createElement("li");
            li.className = 'list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm rounded';
            li.innerHTML = `<span class="fw-bold fs-5"> ${userDetails.name}</span>
                <span class="fw-bold fs-5">Total Expense - ₹${userDetails.totalExpense}</span>`;

            ul.appendChild(li);
        });
        centeredContainer.appendChild(ul);
        leaderBoardDiv.appendChild(centeredContainer);

    } catch (error) {
        alert("Error ", error);
    }

});


const downloadReportBtn = document.getElementById("downloadReport");

downloadReportBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('user/download', { headers: { 'Authorization': token } });

        if (response.status === 201) {
            let a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myExpense.csv';
            a.click();
            alert("Report Downloaded Successfully");

        } else {
            alert("Something went wrong  " + response.data.message);
        }

    } catch (error) {
        console.log(error);

    }
});


const downloadHistory = document.getElementById("downloadHistory");
const downloadUrlsSpan = document.getElementById("downloadUrls");
const downloadUrlsDiv = document.getElementById("downloadUrlsDiv");

downloadHistory.addEventListener('click', async (event) => {
    event.preventDefault();

    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('user/downloadHistory', { headers: { Authorization: token } });

        downloadUrlsSpan.style.display = "block";

        const fileUrls = response.data.history.map(item => item.fileUrl);
        downloadUrlsDiv.innerHTML = `<div class="text-center mb-2">
            <span id="downloadUrls" class="fw-bold fs-4">Previous Reports</span>
        </div>`;

        const centeredContainer = document.createElement("div");
        centeredContainer.className = 'container d-flex justify-content-center flex-wrap';

        fileUrls.forEach(url => {
            let a = document.createElement("a");
            a.href = url;
            a.textContent = url;
            a.className = "btn btn-outline-primary shadow-sm align-items-center btn-sm me-2 mb-2";
            a.style.display = "inline-block";
            centeredContainer.appendChild(a);
        });
        //console.log(response);
        downloadUrlsDiv.appendChild(centeredContainer);

    } catch (error) {
        alert("Error ", error);
    }
});