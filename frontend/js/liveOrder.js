document.addEventListener("DOMContentLoaded", function () {
  const ordersTable = document.getElementById("orders-table-body");
  const API_URL = "http://localhost:3000/orders";
  let currentSortColumn = "order_id"; // Default sorting column
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

    const token = localStorage.getItem("token");


  // Fetch and render orders in a single function
  async function fetchAndRenderOrders(sortBy = "order_id", direction = "asc") {
      try {
          const options = {
              headers: {
                  Authorization: localStorage.getItem("token"),
              },
          };

          const response = await fetch(`${API_URL}?sortBy=${sortBy}&direction=${direction}`, options);
          
          if (response.status === 403) {
            unauthorizedMessage.style.display = "block";
            ordersSection.style.display = "none";
            return;
        }
          
          const ordersData = await response.json();
          ordersTable.innerHTML = ""; // Clear existing rows

          ordersData.forEach((order) => {
              const row = document.createElement("tr");
              row.innerHTML = `
                  <td>${order.order_id}</td>
                  <td>${formatDateTimeBritish(order.order_time)}</td>
                  <td>${order.total_quantity}</td>
                  <td>${order.menu_items}</td>
                  <td>${order.order_notes}</td>
                  <td class="order-status">${order.status}</td>
                  <td>
                      <button class="change-status-btn" data-id="${order.order_id}" 
                          ${order.status === "complete" ? "disabled" : ""}>
                          Change Status
                      </button>
                  </td>
              `;
              ordersTable.appendChild(row);
          });

          // Attach event listeners to "Change Status" buttons
          document.querySelectorAll(".change-status-btn").forEach((button) => {
              button.addEventListener("click", function () {
                  const orderId = this.getAttribute("data-id");
                  updateOrderStatus(orderId, this);
              });
          });
      } catch (error) {
          console.error("Error fetching orders:", error);
      }
  }

  // Function to update order status
  function updateOrderStatus(orderId, button) {
      fetch(`${API_URL}/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
      })
          .then((response) => response.json())
          .then((data) => {
              if (data.status) {
                  button.closest("tr").querySelector(".order-status").textContent = data.status;
                  button.disabled = true; // Disable button after updating
              }
          })
          .catch((error) => console.error("Error updating order status:", error));
  }

  function formatDateTimeBritish(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Handle invalid dates
      return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB", { hour12: false })}`;
  }

  function sortOrders(column) {
      currentSortDirection = currentSortColumn === column && currentSortDirection === "asc" ? "desc" : "asc";
      currentSortColumn = column;

      fetchAndRenderOrders(currentSortColumn, currentSortDirection);

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
          sortOrders(column);
      });
  });

  // Fetch and update orders every 5 seconds
  setInterval(() => fetchAndRenderOrders(currentSortColumn, currentSortDirection), 5000);
  fetchAndRenderOrders(); // Initial call
});

function logout() {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "homepage.html";
}  