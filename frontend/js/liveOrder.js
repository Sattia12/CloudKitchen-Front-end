document.addEventListener("DOMContentLoaded", function () {
  const ordersTable = document.getElementById("orders-table-body");

  // Function to fetch and update orders
  function fetchOrders() {
    fetch("http://localhost:3000/orders") // API URL
      .then((response) => response.json())
      .then((orders) => {
        ordersTable.innerHTML = ""; // Clear existing rows
        orders.forEach((order) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.order_time}</td>
            <td>${order.total_quantity}</td>
            <td>${order.menu_items}</td>
            <td>${order.order_notes}</td>
            <td class="order-status">${order.status}</td>
            <td>
              <button class="change-status-btn" data-id="${order.order_id}" ${order.status === "complete" ? "disabled" : ""}>
                Change Status
              </button>
            </td>
          `;

          ordersTable.appendChild(row);
        });

        // Attach event listeners to all "Change Status" buttons
        document.querySelectorAll(".change-status-btn").forEach((button) => {
          button.addEventListener("click", function () {
            const orderId = this.getAttribute("data-id");
            updateOrderStatus(orderId, this);
          });
        });
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }

  // Function to update order status
  function updateOrderStatus(orderId, button) {
    fetch(`http://localhost:3000/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          // Update the UI
          button.closest("tr").querySelector(".order-status").textContent = data.status;
          button.disabled = true; // Disable button after updating
        }
      })
      .catch((error) => console.error("Error updating order status:", error));
  }

  // Fetch orders every 5 seconds
  setInterval(fetchOrders, 5000);
  fetchOrders(); // Initial call
});
