const submitButton = document.getElementById("expenseForm");
const addExpenseBtn = document.getElementById('submit');
const listToShow = document.querySelector('.list');
const expense = document.getElementById('expenseAmount');
const category = document.querySelector('.chooseCategory');
const description = document.getElementById('expenseDescription');

const previousPageBtn = document.getElementById("previousPage");
const nextPageBtn = document.getElementById("nextPage");
const currentPageSpan = document.getElementById("currentPage");
const rowsPerPageSelect = document.getElementById("rowsPerPage");

let currentPage = 1;
let limit = parseInt(localStorage.getItem('rowsPerPage')) || 5;

rowsPerPageSelect.value = limit;

rowsPerPageSelect.addEventListener('change', (event) => {

    localStorage.setItem('rowsPerPage', event.target.value);
    window.location.reload();

});


//function handling logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'homePage.html';
}


//handling the add expense event
submitButton.addEventListener("submit", function (event) {
    event.preventDefault();

    const storeData = {
        expenseAmount: expense.value,
        expenseCategory: category.value,
        expenseDescription: description.value
    }

    //sending a post request to the backend
    const token = localStorage.getItem('token');
    axios.post("expense/addExpense", storeData, { headers: { "Authorization": token } })
        .then((result) => {
            console.log(result);
            displayDetails(result.data.expenseDetails);
        })
        .catch((error) => {
            console.log(error);
        });

    //clearing the input fields
    expense.value = "";
    description.value = "";
});

//function to display details on dashboard
function displayDetails(storeData) {
    const newDetails = document.createElement("li");
    newDetails.dataset.id = storeData._id; // Adding id to the li element
    newDetails.className = "list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm";

    //adding the entered details to an unordered list and displaying it on DOM
    let expenseInfo = document.createElement('div');
    expenseInfo.className = "ms-2 me-auto d-flex flex-column";

    let amount = document.createElement('span');
    amount.innerText = `₹${storeData.expenseAmount}`;
    amount.className = "fw-bold fs-5 text-success";
    expenseInfo.appendChild(amount);
    // newDetails.appendChild(amount);
    // newDetails.appendChild(document.createTextNode(" - "));


    let categoryValue = document.createElement('div');  //'span'
    categoryValue.innerText = storeData.expenseCategory;
    categoryValue.className = "text-body-secondary text-capitalize";
    expenseInfo.appendChild(categoryValue);
    // newDetails.appendChild(categoryValue);
    // newDetails.appendChild(document.createTextNode(" - "));


    let descriptionValue = document.createElement('div');  //'span'
    descriptionValue.innerText = storeData.expenseDescription;
    descriptionValue.className = "txt-secondary fst-italic";
    expenseInfo.appendChild(descriptionValue);
    // newDetails.appendChild(descriptionValue);
    // newDetails.appendChild(document.createTextNode("   "));

    newDetails.appendChild(expenseInfo);

    //creating two buttons and appending them on the list and displaying on DOM
    let buttonGroup = document.createElement('div');
    buttonGroup.className = "btn-group btn-group-sm";

    const deleteBtn = document.createElement('button');
    const editBtn = document.createElement('button');
    // deleteBtn.appendChild(document.createTextNode("Delete Expense"));
    // editBtn.appendChild(document.createTextNode("Edit Expense"));
    // newDetails.appendChild(deleteBtn);
    // newDetails.appendChild(document.createTextNode("   "));
    // newDetails.appendChild(editBtn);
    deleteBtn.innerText = "Delete";
    editBtn.innerText = "Edit";
    deleteBtn.className = "delete_btn btn btn-outline-danger";
    editBtn.className = "edit_btn btn btn-outline-info";
    // deleteBtn.setAttribute('class', "delete_btn btn btn-outline-danger btn-sm");
    // editBtn.setAttribute('class', "edit_btn btn btn-outline-info btn-sm");
    buttonGroup.appendChild(deleteBtn);
    buttonGroup.appendChild(editBtn);

    newDetails.appendChild(buttonGroup);

    listToShow.appendChild(newDetails);
}

let isEditInProgress = false;  //variable to track edit status, initially set to false

//handling the delete event
listToShow.addEventListener("click", function (event) {
    event.preventDefault();
    if (event.target.classList.contains('delete_btn')) {
        deleteExpense(event.target);
    }
});

//handling the edit event
listToShow.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.classList.contains('edit_btn')) {
        if (!isEditInProgress) {  //check if any edit is in progress or not
            disableEditButtons();
            addExpenseBtn.style.display = 'none';
            editExpense(event.target);
            isEditInProgress = true;
        }
    }
})

//function to delete data from DOM and local storage
function deleteExpense(deleteButton) {
    const listItem = deleteButton.closest("li");
    const id = listItem.dataset.id;  //getting the id of the expense to be deleted

    const token = localStorage.getItem("token");
    axios.delete(`expense/deleteExpense/${id}`, { headers: { "Authorization": token } })
        .then((result) => {
            console.log(result);
            listToShow.removeChild(listItem);
        }).catch(error => {
            console.log(error);
        });
}

//function to edit data whenever any wrong entry is entered
function editExpense(editData) {
    const listItem = editData.closest('li');
    const id = listItem.dataset.id;   //getting the id of the expense to be edited

    //repopulating input fields
    // const spans = listItem.querySelectorAll('span');
    // expense.value = spans[0].innerText;
    // category.value = spans[1].innerText;
    // description.value = spans[2].innerText;
    const expenseInfo = listItem.querySelector('.ms-2.me-auto');
    expense.value = expenseInfo.querySelector('.fw-bold.fs-5.text-success').innerText.replace('₹', '');
    category.value = expenseInfo.querySelector('.text-body-secondary.text-capitalize').innerText;
    description.value = expenseInfo.querySelector('div:last-child').innerText;

    listToShow.removeChild(listItem);

    //creating a save button to save the data after editing
    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    saveBtn.className = "btn btn-outline-success btn-sm ms-2";  //used bootstrap
    submitButton.appendChild(saveBtn);

    //save button functionality
    saveBtn.addEventListener("click", (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        axios.put(`expense/editExpense/${id}`, {
            expenseAmount: expense.value,
            expenseCategory: category.value,
            expenseDescription: description.value
        }, { headers: { "Authorization": token } })
            .then((result) => {
                submitButton.removeChild(saveBtn);
                addExpenseBtn.style.display = 'block';
                displayDetails(result.data.updatedExpense);

                //clearing the input  fields
                expense.value = "";
                category.value = "";
                description.value = "";

                enableEditButtons();
                isEditInProgress = false;

            }).catch(err => {
                console.log(err);
            })
    });
}

//function to disable edit buttons
function disableEditButtons() {
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {  //disable all the edit buttons
        button.disabled = true;
    });
}

//function to enable edit buttons
function enableEditButtons() {
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.disabled = false;  //enable all the edit buttons
    });
}


//function handling the pagination
async function fetchExpenses(page) {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`expense/getExpense?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });

        listToShow.innerHTML = "";
        if (response.data.expenses) {
            response.data.expenses.forEach(expense => {
                displayDetails(expense);
            });
            currentPageSpan.textContent = page;
            currentPage = page;
            handlePaginationButtons(response.data.totalPages, response.data.totalItems);

        } else {
            alert("No data found");
        }

        const isPremiumUser = response.data.isPremiumUser; //|| localStorage.getItem("isPremiumUser") === "true";
        handlePremiumButton(isPremiumUser);

    } catch (error) {
        console.log(error);
    }
}


//function handling the pagination buttons
function handlePaginationButtons(totalPages, totalExpenses) {

    if (totalExpenses <= 5 || totalExpenses <= parseInt(rowsPerPageSelect.value)) {  //hiding pagination buttons
        const paginationBtn = document.getElementsByClassName('pagination');
        paginationBtn[0].style.display = 'none';
        return;
    }

    if (currentPage <= 1) {
        previousPageBtn.disabled = true;
    } else {
        previousPageBtn.disabled = false;
    }

    if (currentPage >= totalPages) {
        nextPageBtn.disabled = true;
    } else {
        nextPageBtn.disabled = false;
    }
}


previousPageBtn.addEventListener('click', (event) => {
    if (currentPage > 1) {
        fetchExpenses(currentPage - 1);
    }
});

nextPageBtn.addEventListener('click', () => {
    fetchExpenses(currentPage + 1);

});




//function to display data on dashboard on page reload
document.addEventListener("DOMContentLoaded", () => {
    fetchExpenses(currentPage);
});




//handling the buy premium button - to display only for non premium users
function handlePremiumButton(isPremiumUser) {
    const premiumButton = document.getElementById("rzp-button1");
    const premiumMessage = document.getElementById("premiumMessage");
    //const leaderboard = document.getElementById("leaderboard");

    if (isPremiumUser) {
        premiumButton.style.display = "none";
        premiumMessage.style.display = "block";
        // leaderboard.style.display = "block";

    } else {
        premiumButton.style.display = "block";
        premiumMessage.style.display = "none";
        // leaderboard.style.display = "none";

    }
}


//handling the premium membership feature
document.getElementById('rzp-button1').onclick = async function (event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const response = await axios.get('purchase/premiumMembership', { headers: { 'Authorization': token } });
    console.log(response);

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,

        "handler": async function (response) {
            await axios.post('purchase/updateTransactionStatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { 'Authorization': token } })

            //updating local storage with premium status
            if (response.razorpay_payment_id) {
                localStorage.setItem("isPremiumUser", true);

            }

            alert("You are a premium user now");

            handlePremiumButton(true);  //updating the dashboard to show the premium message
        }
    };

    const rzp1 = new Razorpay(options);

    rzp1.on('payment.failed', async function (response) {
        console.log(response);
        if (response.error) {
            alert("Something went wrong");
            await axios.post('purchase/updateTransactionStatus', {
                order_id: options.order_id,
                payment_id: "payment_failed",
            }, { headers: { 'Authorization': token } });
        }
    });

    rzp1.open();
}
