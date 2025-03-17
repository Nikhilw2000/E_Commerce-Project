document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".login_button").addEventListener("click", async function (event) {
        event.preventDefault();

        const email = document.getElementById("username").value.trim();
        const password = document.querySelector(".password").value.trim();
        // Clear previous error messages
        document.querySelector(".err_username").innerHTML = "";
        document.querySelector(".err_password").innerHTML = "";

        if (email === "") {
            document.querySelector(".err_username").innerHTML = "Please enter email"
            return;
        }
        if (password === "") {
            document.querySelector(".err_password").innerHTML = "Please enter password"
            return;
        }

        try {
            const response = await fetch("http://localhost:3019/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login Successful! Welcome " + data.user.first_name);
                localStorage.setItem("loggedInUser", JSON.stringify(data.user)); // Store user details
                window.location.href = "dashboard.html"; // Redirect to another page
            } else {
                document.querySelector(".err_password").innerHTML = data.error
                // alert();
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Server error, please try again.");
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    // Retrieve user data from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        document.getElementById("userName").textContent = `Welcome, ${loggedInUser.first_name} ${loggedInUser.last_name || ""}!`;
    } else {
        document.getElementById("userName").textContent = "Welcome, Guest!";
    }
});

const logoutBtn = document.querySelector(".logout_btn")
logoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        localStorage.removeItem("loggedInUser"); // Clear stored user data
        window.location.replace("log_in.html"); // Redirect to login page
    }
})