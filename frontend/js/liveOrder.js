document.addEventListener("DOMContentLoaded", function () {
  const ordersTable = document.getElementById("orders-table-body");

  const token = localStorage.getItem("token");
  options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };

  function fetchOrders() {
    fetch("http://localhost:3000/orders", options)
      .then((response) => response.json())
      .then((orders) => {
        ordersTable.innerHTML = "";
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

  setInterval(fetchOrders, 5000);
  fetchOrders();
});
