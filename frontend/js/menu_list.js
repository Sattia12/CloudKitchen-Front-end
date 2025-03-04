document.addEventListener("DOMContentLoaded", function () {
  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/menu", {
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
      displayMenuItems(menuItems);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const displayMenuItems = (menuItems) => {
    const tableBody = document.getElementById("menuTableBody");
    tableBody.innerHTML = "";

    menuItems.forEach((item) => {
      const row = document.createElement("tr");
      const menuItemCell = document.createElement("td");
      menuItemCell.textContent = item.name;
      row.appendChild(menuItemCell);

      const categoryCell = document.createElement("td");
      categoryCell.textContent = item.category;
      row.appendChild(categoryCell);

      tableBody.appendChild(row);
    });
  };

  fetchMenuItems();
});
