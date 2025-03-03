document.addEventListener("DOMContentLoaded", renderOrders);

async function renderOrders() {
  const response = await fetch("http://localhost:3000/orders");
  const orders = await response.json();
  console.log(orders);

  const tableBody = document.querySelector("#orderTable tbody");
  tableBody.innerHTML = "";

  orders.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>${order.order_id}</td>
                    <td>${order.order_time}</td>
                    <td>${order.menu_items}</td>
                    <td>${order.total_quantity}</td>
                    <td>${order.order_notes}</td>
                    <td class="status">${order.status}</td>
                    <td><button class="status-btn" data-order-id="${order.order_id}">Change Status</button></td>
                `;
    tableBody.appendChild(row);
  });

  const buttons = document.querySelectorAll(".status-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", handleStatusChange);
  });
}

function handleStatusChange(event) {
  const orderId = event.target.getAttribute("data-order-id");
  const row = event.target.closest("tr");
  const statusCell = row.querySelector(".status");

  if (statusCell.textContent === "Pending") {
    statusCell.textContent = "Completed";
  } else {
    statusCell.textContent = "Pending";
  }

  console.log(
    `Order ID ${orderId} status updated to ${statusCell.textContent}`
  );
}
