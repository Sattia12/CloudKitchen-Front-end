document.addEventListener("DOMContentLoaded", function () {
  const ordersTable = document.getElementById("orders-table-body");

  // Function to fetch and update orders
  function fetchOrders() {
    fetch("http://localhost:3000/orders") // API URL
      .then((response) => response.json())
      .then((orders) => {
        ordersTable.innerHTML = ""; // Clear existing rows
        orders.forEach((order) => {
          const row = `<tr>
            <td>${order.order_id}</td>
            <td>${order.order_time}</td>
            <td>${order.total_quantity}</td>
            <td>${order.menu_items}</td>
            <td>${order.order_notes}</td>
            <td>${order.status}</td>`;
          ordersTable.innerHTML += row;
        });
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }

  // Fetch orders every 5 seconds
  setInterval(fetchOrders, 5000);
  fetchOrders(); // Initial call
});