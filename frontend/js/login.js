document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = new FormData(e.target);

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: form.get("email"),
      password: form.get("password"),
    }),
  };

  try {
    const response = await fetch("http://localhost:3000/users/login", options);
    const data = await response.json();

    console.log(data.token);

    if (response.ok) {
      localStorage.setItem("token", data.token);
      window.location.assign("./dashboard.html");
    } else {
      alert(data.error || "Login failed.");
    }
  } catch (error) {
    alert("Error connecting to the server: " + error.message);
  }
});
