async function checkEmailExists() {
    const email = document.getElementById("email").value.trim();
    const errorElement = document.getElementsByClassName("err_email")[0];

    if (email === "") {
        errorElement.innerHTML = "";
        return false;
    }

    try {
        const response = await fetch("http://localhost:3019/check-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (result.exists) {
            errorElement.style.color = "red";
            errorElement.innerHTML = "This email is already taken";
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error("Error:", error);
        errorElement.style.color = "red";
        errorElement.innerHTML = "Error checking email.";
        return false;
    }
}

async function validate_register_form() {
    const fields = [
        { id: 'firstname', errorClass: 'err_firstname', message: 'Please enter first name' },
        { id: 'lastname', errorClass: 'err_lastname', message: 'Please enter last name' },
        { id: 'email', errorClass: 'err_email', message: 'Please enter email' },
        { id: 'phonenumber', errorClass: 'err_phonenumber', message: 'Please enter phone number' },
        { id: 'DOB', errorClass: 'err_DOB', message: 'Please enter date of birth' },
        { id: 'password', errorClass: 'err_password', message: 'Please enter password' },
        { id: 'confpassword', errorClass: 'err_confpassword', message: 'Please enter confirm password' }
    ];

    for (let field of fields) {
        const value = document.getElementById(field.id).value.trim();
        const errorElement = document.querySelector(`.${field.errorClass}`);

        if (value === "") {
            errorElement.innerHTML = field.message;
            return false;
        } else {
            errorElement.innerHTML = "";
        }

        if ((field.id === "firstname" || field.id === "lastname") && /\d/.test(value)) {
            errorElement.innerHTML = "Name should not contain numbers";
            return false;
        }

        if ((field.id === "firstname" || field.id === "lastname") && value.length < 4) {
            errorElement.innerHTML = "Please enter a valid name (min 4 characters)";
            return false;
        }

        if (field.id === "phonenumber" && value.length !== 10) {
            errorElement.innerHTML = "Phone number should be 10 digits";
            return false;
        }
    }

    // **Check if Email Exists Before Proceeding**
    const emailCheck = await checkEmailExists();
    if (!emailCheck) return false;

    // Confirm password validation
    const password = document.getElementById("password").value.trim();
    const confPassword = document.getElementById("confpassword").value.trim();
    const errorConfPassword = document.querySelector(".err_confpassword");

    if (password !== confPassword) {
        errorConfPassword.innerHTML = "Passwords do not match";
        return false;
    } else {
        errorConfPassword.innerHTML = "";
    }

    return true;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        if (await validate_register_form()) {
            registerUser();
        }
    });
});




async function registerUser() {
    // Collect form data
    const userData = {
        first_name: document.getElementById("firstname").value,
        last_name: document.getElementById("lastname").value,
        email: document.getElementById("email").value,
        phone_no: document.getElementById("phonenumber").value,
        date_of_birth: document.getElementById("DOB").value,
        password: document.getElementById("password").value
    };

    try {
        // Send data to the backend
        const response = await fetch("http://localhost:3019/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.text();
        // document.getElementById("message").innerText = result;
        alert("User successfully registered!")
        console.log("Response:", result);

        // Reset form
        document.getElementById("registerForm").reset();
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("message").innerText = "Error registering user!";
    }
}
