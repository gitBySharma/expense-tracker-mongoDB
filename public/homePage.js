//signup logic

const signupForm = document.getElementById("signUpForm");
const signupBtn = document.getElementById("signupBtn");
const passwordInput = document.getElementById('signUpPassword');
const passwordHelp = document.getElementById('passwordHelp');

signupBtn.disabled = true; //initially disable the button

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userName = document.getElementById('signUpName');
    const email = document.getElementById('signUpEmail');
    const password = document.getElementById('signUpPassword');

    const isValidPassword = validatePassword(password.value);

    if (isValidPassword) {
        const userData = {
            name: userName.value,
            email: email.value,
            password: password.value
        };

        //clearing the input fields
        userName.value = "";
        email.value = "";
        password.value = "";

        axios.post('user/signup', userData)
            .then((result) => {
                alert("Signed up successfully");
                //hide sign-up modal
                const signUpModal = new bootstrap.Modal(document.getElementById('signUpModal'));
                signUpModal.hide();
                // Show sign-in modal
                const signInModal = new bootstrap.Modal(document.getElementById('signInModal'));
                signInModal.show();

                userName.value = "";
                email.value = "";
                password.value = "";

            }).catch((err) => {
                console.log(err);
                if (err.response.data.error) {
                    alert(err.response.data.error);
                }
            });
    } else {
        passwordHelp.textContent = "Enter valid password";
        signupBtn.disabled = true;
    }

});

passwordInput.addEventListener('keyup', () => {
    const isValidPassword = validatePassword(passwordInput.value);
    if (isValidPassword) {
        passwordHelp.textContent = "";
        signupBtn.disabled = false;

    } else {
        passwordHelp.textContent = "Enter valid password";
        signupBtn.disabled = true;
    }
});

function validatePassword(password) {
    const hasMinimumLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    return hasMinimumLength && hasNumber;
}



//login logic
const loginForm = document.getElementById("signInForm");

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('signInEmail');
    const password = document.getElementById('signInPassword');

    const userData = {
        email: email.value,
        password: password.value
    };

    //clearing the input fields
    email.value = "";
    password.value = "";

    axios.post('user/login', userData)
        .then((result) => {
            alert("User logged in successfully");
            localStorage.setItem("token", result.data.token);
            window.location.href = "expense.html";
        }).catch((err) => {
            console.log(err);
            if (err.response.data.error) {
                alert(err.response.data.error);
            }
        });
});
