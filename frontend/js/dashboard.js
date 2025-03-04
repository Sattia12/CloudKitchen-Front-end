document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:3000/analytics"; // Adjust if hosted

        // Fetch Total Orders
        fetch(`${API_URL}/live-order-status`)
        .then(response => response.json())
        .then(data => {
            let totalOrders = data.reduce((sum, item) => sum + parseInt(item.total_orders), 0);
            document.getElementById("totalOrders").textContent = totalOrders;
        });

    // Fetch Total Revenue
    fetch(`${API_URL}/revenue-trends`)
        .then(response => response.json())
        .then(data => {
            let totalRevenue = data.reduce((sum, item) => sum + parseFloat(item.total_revenue), 0);
            document.getElementById("totalRevenue").textContent = `$${totalRevenue.toFixed(2)}`;
        });

    // Fetch Low Stock Items
    fetch(`${API_URL}/stock-levels-category`)
        .then(response => response.json())
        .then(data => {
            let lowStockCount = data.filter(item => item.total_quantity < 5).length;
            document.getElementById("lowStockCount").textContent = lowStockCount;
        });

            // Fetch Preparing Orders Count
    fetch(`${API_URL}/live-order-status`)
    .then(response => response.json())
    .then(data => {
        // Find the preparing status and extract the count
        const preparingOrder = data.find(order => order.status === "preparing");
        const preparingOrdersCount = preparingOrder ? preparingOrder.total_orders : 0;
        document.getElementById("preparingOrdersCount").textContent = preparingOrdersCount;
    });


    // Fetch Expiring Soon Count
    fetch(`${API_URL}/expiring-soon`)
        .then(response => response.json())
        .then(data => {
            const expiringSoonCount = data.length;
            document.getElementById("expiringSoonCount").textContent = expiringSoonCount;
        });

    // Revenue Trends (Line Chart)
    fetch(`${API_URL}/revenue-trends`)
        .then(response => response.json())
        .then(data => {
            const dates = data.map(item => item.date);
            const revenue = data.map(item => parseFloat(item.total_revenue));

            Plotly.newPlot("revenueTrendsChart", [{
                x: dates, y: revenue, type: "scatter", mode: "lines+markers"
            }], { title: "Revenue Trends Over Time" });
        });

    // Stock Value by Category (Pie Chart)
    fetch(`${API_URL}/stock-value-category`)
        .then(response => response.json())
        .then(data => {
            const categories = data.map(item => item.category);
            const values = data.map(item => parseFloat(item.total_value));

            Plotly.newPlot("stockValueChart", [{
                labels: categories, values, type: "pie"
            }], { title: "Stock Value by Category" });
        });

    // Most Ordered Dishes (Bar Chart)
    fetch(`${API_URL}/most-ordered-dishes`)
        .then(response => response.json())
        .then(data => {
            const dishes = data.map(item => item.name);
            const orders = data.map(item => parseInt(item.total_orders));

            Plotly.newPlot("mostOrderedDishesChart", [{
                x: dishes, y: orders, type: "bar"
            }], { title: "Most Ordered Dishes" });
        });

    // Most Used Ingredients (Horizontal Bar Chart)
    fetch(`${API_URL}/most-used-ingredients`)
        .then(response => response.json())
        .then(data => {
            const ingredients = data.map(item => item.ingredient_name);
            const usage = data.map(item => parseFloat(item.total_used));

            Plotly.newPlot("mostUsedIngredientsChart", [{
                x: usage, y: ingredients, type: "bar", orientation: "h"
            }], { title: "Most Used Ingredients" });
        });

    // Stock Usage Trend (Line Chart)
    fetch(`${API_URL}/stock-usage-trend`)
        .then(response => response.json())
        .then(data => {
            const dates = data.map(item => item.date);
            const usage = data.map(item => parseFloat(item.total_used));

            Plotly.newPlot("stockUsageTrendChart", [{
                x: dates, y: usage, type: "scatter", mode: "lines"
            }], { title: "Stock Usage Trend" });
        });

    // Stock Levels by Category (Stacked Bar Chart)
    fetch(`${API_URL}/stock-levels-category`)
        .then(response => response.json())
        .then(data => {
            const categories = data.map(item => item.category);
            const levels = data.map(item => parseFloat(item.total_quantity));

            Plotly.newPlot("stockLevelsChart", [{
                x: categories, y: levels, type: "bar"
            }], { title: "Stock Levels by Category" });
        });

 // Dish Category Distribution (Pie Chart)
fetch("http://localhost:3000/analytics/dish-category-distribution")
.then(response => response.json())
.then(data => {
    console.log("Dish Category Distribution API Response:", data); // Debugging

    if (!data || data.length === 0) {
        console.warn("No data received for dish category distribution");
        document.getElementById("dishCategoryChart").innerHTML = "<p>No data available.</p>";
        return;
    }

    const categories = data.map(item => item.category);
    const orders = data.map(item => parseInt(item.total_orders));

    Plotly.newPlot("dishCategoryChart", [{
        labels: categories,
        values: orders,
        type: "pie"
    }], { title: "Dish Category Distribution" });
})
.catch(error => console.error("Error fetching dish category distribution:", error));

    // Restaurant Performance (Stacked Bar Chart)
    fetch(`${API_URL}/restaurant-performance`)
        .then(response => response.json())
        .then(data => {
            const restaurants = data.map(item => item.restaurant);
            const orders = data.map(item => parseInt(item.total_orders));
            const revenue = data.map(item => parseFloat(item.total_revenue));

            Plotly.newPlot("restaurantPerformanceChart", [
                { x: restaurants, y: orders, name: "Orders", type: "bar" },
                { x: restaurants, y: revenue, name: "Revenue", type: "bar" }
            ], { title: "Restaurant Performance", barmode: "stack" });
        });

    // Live Order Status (Donut Chart)
    fetch(`${API_URL}/live-order-status`)
        .then(response => response.json())
        .then(data => {
            const statuses = data.map(item => item.status);
            const counts = data.map(item => parseInt(item.total_orders));

            Plotly.newPlot("liveOrderStatusChart", [{
                labels: statuses, values: counts, type: "pie", hole: 0.4
            }], { title: "Live Order Status" });
        });

    // Expiring Soon (Simple List)
    fetch(`${API_URL}/expiring-soon`)
        .then(response => response.json())
        .then(data => {
            const expiringList = document.getElementById("expiringSoonList");
            expiringList.innerHTML = ""; 

            data.forEach(item => {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item list-group-item-warning";
                listItem.textContent = `${item.name} - Expires on ${item.expiry_date}`;
                expiringList.appendChild(listItem);
            });
        });

    // Ingredient Category Distribution (Pie Chart)
    fetch(`${API_URL}/ingredient-category-distribution`)
        .then(response => response.json())
        .then(data => {
            const categories = data.map(item => item.category);
            const counts = data.map(item => parseInt(item.ingredient_count));

            Plotly.newPlot("ingredientCategoryChart", [{
                labels: categories, values: counts, type: "pie"
            }], { title: "Ingredient Category Distribution" });
        });


        
});