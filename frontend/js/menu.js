document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:3000/menu";
    const menuTableBody = document.getElementById("menuTableBody");
    let currentSortColumn = "name"; // Default sorting column
    let currentSortDirection = "asc"; // Default sorting direction
    const userEmail = localStorage.getItem("email");
    const usernameDisplay = document.querySelector("#username");
    const authButton = document.querySelector("#auth-btn");

    document.getElementById("searchMenu").addEventListener("input", function () {
        fetchAndRenderMenu(currentSortColumn, currentSortDirection, this.value);
    });

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

    // Fetch and render menu items
    async function fetchAndRenderMenu(sortBy = "name", direction = "asc", search = "") {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}?sortBy=${sortBy}&direction=${direction}&search=${encodeURIComponent(search)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch menu items");
            }
    
            const menuItems = await response.json();
            menuTableBody.innerHTML = ""; // Clear table before inserting rows
    
            menuItems.forEach((item) => {
                const ingredientsList = Array.isArray(item.ingredients) && item.ingredients.length
                    ? item.ingredients.map(ing => `${ing.ingredient_name} (${ing.quantity} ${ing.unit})`).join(", ")
                    : "No ingredients listed";
    
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>${ingredientsList}</td>
                `;
                menuTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error fetching menu items:", error);
        }
    }

    function sortMenu(column) {
        currentSortDirection = currentSortColumn === column && currentSortDirection === "asc" ? "desc" : "asc";
        currentSortColumn = column;

        fetchAndRenderMenu(currentSortColumn, currentSortDirection);

        // Update sorting UI
        document.querySelectorAll("th[data-sort]").forEach(th => {
            if (th.getAttribute("data-sort") === column) {
                th.innerHTML = `${th.textContent.replace("▲", "").replace("▼", "").trim()} ${currentSortDirection === "asc" ? "▲" : "▼"}`;
            } else {
                th.innerHTML = th.textContent.replace("▲", "").replace("▼", "").trim();
            }
        });
    }

    // Attach sorting functionality to table headers
    document.querySelectorAll("th[data-sort]").forEach(th => {
        th.addEventListener("click", () => {
            const column = th.getAttribute("data-sort");
            sortMenu(column);
        });
    });

    // Add new menu item functionality
    document.getElementById("menuForm")?.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const menuItem = formData.get("menuItem");
        const category = formData.get("category");
        let ingredients = [];

        document.querySelectorAll(".ingredient-group").forEach((group) => {
            let ingredientObj = {
                ingredient_name: group.querySelector(".ingredient").value,
                quantity: group.querySelector(".quantity").value,
                unit: group.querySelector(".unit").value,
            };
            ingredients.push(ingredientObj);
        });

        const menuData = {
            name: menuItem,
            category: category,
            ingredients: ingredients,
        };

        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token);
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(menuData),
            });

            if (!response.ok) {
                throw new Error("Failed to add menu item");
            }

            alert("Menu item added successfully!");
            fetchAndRenderMenu(); // Refresh menu after adding
        } catch (error) {
            console.error("Error adding menu item:", error);
        }
    });

    // Add ingredient fields dynamically
    document.getElementById("addIngredient")?.addEventListener("click", function () {
        document.getElementById("ingredientsContainer").insertAdjacentHTML(
            "beforeend",
            `
            <div class="input-group mb-2 ingredient-group">
                <input type="text" class="form-control ingredient" placeholder="Ingredient" required>
                <input type="number" class="form-control quantity" placeholder="Quantity" required>
                <input type="text" class="form-control unit" placeholder="Unit" required>
                <button type="button" class="btn btn-danger remove-ingredient">Remove</button>
            </div>
            `
        );
    });

    // Remove ingredient fields dynamically
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-ingredient")) {
            e.target.closest(".ingredient-group").remove();
        }
    });

    fetchAndRenderMenu(); // Initial fetch
});

function logout() {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "homepage.html";
}  