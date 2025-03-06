document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role"),
        access_code: form.get("accessCode"),
        restaurant_code: form.get("restaurantCode"),
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:3000/users/register",
        options
      );
      const data = await response.json();
      console.log("Response Status:", response.status);
      console.log("Server Response:", data);

      if (response.ok) {
        alert("Registration successful!");
        window.location.assign("login.html");
      } else {
        alert(data.error || "An error occurred during registration.");
      }
    } catch (error) {
      alert("Error connecting to the server: " + error.message);
    }
  });
