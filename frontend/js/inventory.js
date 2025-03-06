document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("th[data-sort]").forEach(th => {
        th.addEventListener("click", () => {
            const column = th.getAttribute("data-sort");
            sortInventory(column);
        });
    });
  const form = document.querySelector(".horizontal-form");
  const tbody = document.querySelector("table tbody");
  const API_URL = "http://localhost:3000/inventory";
  let inventoryData = [];
  let currentSortDirection = "asc"; // Default sorting direction
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

  // Fetch and populate inventory table
  async function fetchInventory(sortBy = "name", direction = "asc") {
    try {
        const response = await fetch(`${API_URL}?sortBy=${sortBy}&direction=${direction}`);
        inventoryData = await response.json();

        // Clear existing table and render new data
        tbody.innerHTML = "";
        inventoryData.forEach(addRowToTable);
    } catch (error) {
        console.error("Error fetching inventory:", error);
    }
}

  // Format date to British format (DD/MM/YYYY)
  function formatDateBritish(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-GB");
  }

  function sortInventory(column) {
    currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
    
    fetchInventory(column, currentSortDirection); // Fetch sorted data from backend

    // Update all headers and set sorting indicator
    document.querySelectorAll("th[data-sort]").forEach(th => {
        if (th.getAttribute("data-sort") === column) {
            th.innerHTML = `${th.textContent.replace("▲", "").replace("▼", "").trim()} ${currentSortDirection === "asc" ? "▲" : "▼"}`;
        } else {
            th.innerHTML = th.textContent.replace("▲", "").replace("▼", "").trim(); // Reset others
        }
    });
}

  // Add row to inventory table
  function addRowToTable(item) {
    const tr = document.createElement("tr");

    // Format expiry date in British format
    const rawExpiry = item.expiry_date || "";
    const formattedExpiryDate = rawExpiry ? formatDateBritish(rawExpiry) : "N/A";

    // Calculate expiry status & color class
    let expiryDisplay = "No expiry date";
    let expiryClass = "expiry-safe"; // Default to green (safe)

    if (rawExpiry) {
        const expiryDate = new Date(rawExpiry);
        const now = new Date();
        const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) {
            expiryDisplay = "Expired";
            expiryClass = "expiry-danger"; // Red (expired)
        } else if (daysRemaining <= 7) {
            expiryDisplay = `Expires in ${daysRemaining} days`;
            expiryClass = "expiry-warning"; // Red (near expiry)
        } else {
            expiryDisplay = `Expires in ${daysRemaining} days`;
        }
    }

    // Determine stock status & color
    const stockStatus = item.quantity <= 5 ? "Low stock" : "In stock";
    const stockClass = item.quantity <= 5 ? "low-stock" : "in-stock";

    tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>${item.unit}</td>
        <td>${item.price_per_unit}</td>
        <td data-expiry="${rawExpiry}">${formattedExpiryDate}</td>
        <td><span class="expiry-status ${expiryClass}">${expiryDisplay}</span></td>
        <td><span class="status ${stockClass}">${stockStatus}</span></td>
        <td>
            <button class="action-btn edit-btn">Edit</button>
            <button class="action-btn remove-btn">Remove</button>
        </td>
    `;

    tbody.appendChild(tr);

    // Attach event listeners for edit and delete buttons
    tr.querySelector(".remove-btn").addEventListener("click", () => deleteInventoryItem(item.ingredient_id, tr));
    tr.querySelector(".edit-btn").addEventListener("click", () => editInventoryItem(item, tr));
}

  // Handle form submission (Add stock)
  form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const itemData = {
          name: document.getElementById("itemName").value.trim(),
          category: document.getElementById("category").value.trim(),
          quantity: parseFloat(document.getElementById("quantity").value),
          unit: document.getElementById("unit").value.trim(),
          price_per_unit: parseFloat(document.getElementById("price").value),
          expiry_date: document.getElementById("expiryDate").value,
          restaurant_id: 1
      };

      try {
          const response = await fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(itemData),
          });

          if (!response.ok) throw new Error("Failed to add inventory");

          const newItem = await response.json();
          addRowToTable(newItem);
          form.reset();
      } catch (error) {
          console.error("Error adding inventory:", error);
      }
  });

  // Handle deletion
  async function deleteInventoryItem(id, row) {
      try {
          const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (!response.ok) throw new Error("Failed to delete item");
          row.remove();
      } catch (error) {
          console.error("Error deleting inventory item:", error);
      }
  }

  // Handle editing inventory item
  function editInventoryItem(item, row) {
      const editBtn = row.querySelector(".edit-btn");
      const cells = row.querySelectorAll("td");

      if (editBtn.textContent === "Edit") {
          console.log("Editing:", item);

          for (let i = 0; i < 5; i++) {
              const cellValue = cells[i].textContent.trim();
              cells[i].innerHTML = `<input type="text" value="${cellValue}" style="width: 100px; max-width: 120px;"/>`;
          }

          const rawExpiry = item.expiry_date || "";
          cells[5].innerHTML = `<input type="date" value="${formatDateBritish(rawExpiry)}" style="width: 120px;" />`;

          editBtn.textContent = "Save";
      } else {
          console.log("Saving:", item);

          const updatedItem = {
              name: cells[0].querySelector("input").value.trim(),
              category: cells[1].querySelector("input").value.trim(),
              quantity: parseFloat(cells[2].querySelector("input").value),
              unit: cells[3].querySelector("input").value.trim(),
              price_per_unit: parseFloat(cells[4].querySelector("input").value),
              expiry_date: cells[5].querySelector("input").value || null,
              restaurant_id: 1
          };

          updateInventoryItem(item.ingredient_id, updatedItem, row);
      }
  }

  // Send PATCH request to update inventory
  async function updateInventoryItem(id, updatedItem, row) {
      try {
          const response = await fetch(`${API_URL}/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedItem),
          });

          if (!response.ok) throw new Error("Failed to update inventory item");

          const updatedData = await response.json();
          addRowToTable(updatedData);
          row.remove();
      } catch (error) {
          console.error("Error updating inventory item:", error);
      }
  }

  fetchInventory();
});

function logout() {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "homepage.html";
}  