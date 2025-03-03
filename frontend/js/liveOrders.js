document.addEventListener("DOMContentLoaded", function () {
    fetchLiveOrders();
});

// 🛒 Fetch live orders from the backend
async function fetchLiveOrders() {
    try {
        const response = await fetch("http://localhost:3000/orders"); // Fetch from your backend
        const orders = await response.json();

        console.log("Fetched Orders:", orders); // Debugging
        populateOrdersTable(orders);
    } catch (error) {
        console.error("Error fetching live orders:", error);
    }
}

//  Populate the live orders table
function populateOrdersTable(orders) {
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing data

    if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No live orders found.</td></tr>`;
        return;
    }

    orders.forEach(order => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${order.order_id}</td>
            <td>${new Date(order.order_time).toLocaleString()}</td>
            <td>${order.menu_items || "N/A"}</td>
            <td>${order.total_quantity}</td>
            <td>${order.order_notes || "N/A"}</td>
            <td>
                <span class="${order.status === 'complete' ? 'text-success' : 'text-warning'}">
                    ${order.status}
                </span>
            </td>
            <td>
                ${order.status === "preparing" ? 
                    `<button class="btn btn-success btn-sm" onclick="markOrderComplete(${order.order_id})">
                        Mark Complete
                    </button>` 
                : "Completed"}
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Update order status to 'complete'
async function markOrderComplete(orderId) {
    try {
        const response = await fetch(`http://localhost:3000/orders/${orderId}/complete`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Failed to update order status");
        }

        console.log(`Order ${orderId} marked as complete`);
        fetchLiveOrders(); // Refresh the orders list
    } catch (error) {
        console.error("Error updating order status:", error);
    }
}
