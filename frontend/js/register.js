document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: form.get("name"),
            username: form.get("username"),
            email: form.get("email"),
            password: form.get("password"),
            role: form.get("role"),
            accessCode: form.get("accessCode"),
            restaurantId: form.get("restaurantId")
        })
    };

    try {
        const response = await fetch("deploymenthere", options);
        const data = await response.json();

        if (response.ok) {
            window.location.assign("login.html");
        } else {
            alert(data.error || "An error occurred during registration.");
        }
    } catch (error) {
        alert("Error connecting to the server: " + error.message);
    }
});
