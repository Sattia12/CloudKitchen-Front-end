document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("locationSearchBtn").addEventListener("click", searchByLocation);
    document.getElementById("ingredientSearchBtn").addEventListener("click", searchByIngredient);
    const userEmail = localStorage.getItem("email");
    const usernameDisplay = document.querySelector("#username");
    const authButton = document.querySelector("#auth-btn");

    if (userEmail) {
      usernameDisplay.textContent = userEmail;
      authButton.textContent = "Log Out";
  
      authButton.removeEventListener("click", logout); // Ensure no duplicate listeners
      authButton.addEventListener("click", logout); //  Attach logout function
    } else {
      usernameDisplay.textContent = "Guest";
      authButton.textContent = "Log In";
  
      authButton.removeEventListener("click", loginRedirect); //  Ensure no duplicate listeners
      authButton.addEventListener("click", loginRedirect); //  Attach login function
    }
  
  function loginRedirect() {
      window.location.href = "login.html"; // Redirect to login page
  }


    fetchFoodBanks();
  });



  // Initialize the Leaflet map
  const map = L.map('map').setView([51.5, -0.12], 7);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
attribution: '© OpenStreetMap & Carto'
}).addTo(map);

  const markers = L.markerClusterGroup();

  async function fetchFoodBanks() {
    try {
      const response = await fetch("https://www.givefood.org.uk/api/2/foodbanks/");
      const foodBanks = await response.json();

      foodBanks.forEach(foodBank => {
        if (foodBank.lat_lng) {
          const [lat, lng] = foodBank.lat_lng.split(',').map(Number);
          const name = foodBank.name || "Unknown Food Bank";
          const address = foodBank.address ? foodBank.address.replace(/\r\n/g, ", ") : "Address not available";
          const needs = foodBank.needs ? foodBank.needs.needs || "Needs info unavailable" : "Needs info unavailable";
          const googleMapsLink = `<a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank">View on Google Maps</a>`;

          const marker = L.marker([lat, lng]).bindPopup(`
            <strong>${name}</strong><br>
            📍 ${address}<br>
            ${googleMapsLink}
          `);
          markers.addLayer(marker);
        }
      });

      map.addLayer(markers);
      
      renderResultsLocation(foodBanks);
    } catch (error) {
      console.error("Error fetching food bank data:", error);
    }
  }

  async function searchByLocation() {
    const location = document.getElementById("locationInput").value.trim();
    if (!location) return alert("Please enter a valid postcode or city.");
    
    try {
      const url = `https://www.givefood.org.uk/api/2/foodbanks/search/?address=${encodeURIComponent(location)}`;
      const foodbanks = await fetch(url).then(res => res.json());

      if (!foodbanks.length) return alert("No food banks found in this area.");
      
      renderResultsLocation(foodbanks);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  }

  async function searchByIngredient() {
    const ingredient = document.getElementById("ingredientInput").value.trim().toLowerCase();
    if (!ingredient) return alert("Please enter an ingredient.");
    
    try {
      const needsData = await fetch("https://www.givefood.org.uk/api/2/needs/").then(res => res.json());
      const filtered = needsData.filter(item => item.needs.toLowerCase().includes(ingredient));

      if (!filtered.length) return alert("No food banks need this ingredient.");

      const results = await Promise.all(filtered.map(async (item) => {
        const details = await fetch(`https://www.givefood.org.uk/api/2/foodbank/${item.foodbank.slug}/`).then(res => res.json());
        return { ...details, needs: item.needs };
      }));

      renderResults(results, ingredient);
    } catch (error) {
      console.error("Error fetching ingredient data:", error);
    }
  }

  function renderResults(data, ingredientKeyword = "") {
    const resultsList = document.getElementById("resultsList");
    resultsList.innerHTML = "";
    
    data.forEach(item => {
      const needsText = (typeof item.needs === "object") ? item.needs.needs : item.needs;
      const highlightedNeeds = ingredientKeyword ? needsText.replace(new RegExp(`(${ingredientKeyword})`, "gi"), `<span class="highlight">$1</span>`) : needsText;
      const googleMapsLink = item.lat_lng ? `<a href="https://www.google.com/maps?q=${item.lat_lng}" target="_blank">View on Google Maps</a>` : "";

      const websiteLink = item.urls && item.urls.homepage 
          ? `<a href="${item.urls.homepage}" target="_blank">Visit Website</a>` 
          : "No website available";

      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `
          <strong>${item.name}</strong><br>
          📍 ${item.address}<br>
          🛒 <strong>Needs:</strong> ${highlightedNeeds}<br>
          🔗 ${websiteLink} | ${googleMapsLink}
      `;        resultsList.appendChild(li);
    });
  }

  function renderResultsLocation(data, ingredientKeyword = "") {
    const resultsList = document.getElementById("resultsList");
    resultsList.innerHTML = "";
    
    data.forEach(item => {
      const needsText = (typeof item.needs === "object") ? item.needs.needs : item.needs;
      const highlightedNeeds = ingredientKeyword ? needsText.replace(new RegExp(`(${ingredientKeyword})`, "gi"), `<span class="highlight">$1</span>`) : needsText;
      const googleMapsLink = item.lat_lng ? `<a href="https://www.google.com/maps?q=${item.lat_lng}" target="_blank">View on Google Maps</a>` : "";

      const websiteLink = item.urls && item.urls.homepage 
          ? `<a href="${item.urls.homepage}" target="_blank">Visit Website</a>` 
          : "No website available";

      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `
          <strong>${item.name}</strong><br>
          📍 ${item.address}<br>
          🔗 ${websiteLink} | ${googleMapsLink}
      `;        resultsList.appendChild(li);
    });
  }

  async function searchLocation() {
    const input = document.getElementById("searchInput").value.trim();
    if (!input) return alert("Enter a postcode or address.");

    try {
      const data = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`).then(res => res.json());
      if (!data.length) return alert("Location not found.");

      const { lat, lon } = data[0];
      map.setView([lat, lon], 12);
    } catch (error) {
      console.error("Error finding location:", error);
    }
  }

  function logout() {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "homepage.html";
}  