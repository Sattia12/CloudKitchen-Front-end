document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: form.get("email"),
            password: form.get("password")
        })
    };

    try {
        const response = await fetch("deployment", options);
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            window.location.assign("dashboard.html"); 
        } else {
            alert(data.error || "Login failed.");
        }
    } catch (error) {
        alert("Error connecting to the server: " + error.message);
    }
});
