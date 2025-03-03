$(document).ready(function () {
  $("#foodItem").select2();
  applyCustomStyles();
  if ($("#orderItems").length) {
    fetchMenuItems();
  }

  $("#orderForm").on("change", "select", function () {
    $(this).select2();
    applyCustomStyles();
  });
});

async function fetchMenuItems() {
  try {
    const response = await fetch("http://localhost:3000/menu/names");
    const data = await response.json();

    if (response.ok) {
      window.menuItems = data;
      populateMenuItems(data);
    } else {
      console.error(
        "Error fetching menu items:",
        data.error || "Unknown error"
      );
    }
  } catch (error) {
    console.error("Failed to connect to the server:", error.message);
  }
}

function populateMenuItems(menuItems) {
  console.log(menuItems);
  const foodItemSelect = $("#foodItem");
  foodItemSelect.empty();
  foodItemSelect.append(new Option("Select a menu item", "", true, true));

  menuItems.forEach((item) => {
    foodItemSelect.append(new Option(item.name, item.name));
  });

  foodItemSelect.select2();
  applyCustomStyles();
}

function applyCustomStyles() {
  $(".select2-container--default .select2-selection--single").css({
    "border-radius": "5px",
    border: "2px solid #6a0dad",
    padding: "10px",
    "min-height": "calc(2.25rem + 12px)",
    display: "flex",
    "align-items": "center",
    "box-sizing": "border-box",
  });

  $(
    ".select2-container--default .select2-selection--single .select2-selection__rendered"
  ).css({
    "line-height": "calc(2.25rem + 2px)",
    "padding-top": "0",
    "padding-bottom": "0",
  });

  $(
    ".select2-container--default .select2-selection--single .select2-selection__arrow"
  ).css({
    "border-left": "none",
    "border-radius": "0 5px 5px 0",
    right: "0",
  });

  $(
    ".select2-container--default .select2-selection--single .select2-selection__placeholder"
  ).css({
    "line-height": "calc(2.25rem + 2px)",
    "padding-top": "0",
    "padding-bottom": "0",
  });

  $(".select2-container--default").css({
    width: "100%",
  });
}

function addItem() {
  var container = document.getElementById("orderItems");
  var row = document.createElement("div");
  row.classList.add("row", "mb-3");

  row.innerHTML = `
    <div class="col-md-4">
        <label class="form-label">Menu Item</label>
        <select class="form-select food-item-dropdown" name="foodItem">
            <option selected>Select a menu item</option>
        </select>
    </div>

    <div class="col-md-4">
        <label class="form-label">Quantity</label>
        <input type="number" class="form-control" name="quantity" placeholder="Enter quantity">
    </div>

    <div class="col-md-4 d-flex align-items-end">
        <button type="button" class="btn btn-danger" onclick="removeItem(this)">Remove</button>
    </div>
  `;
  container.appendChild(row);

  const newSelect = row.querySelector(".food-item-dropdown");
  populateMenuItemsDropdown(newSelect);

  $(newSelect).select2();
  applyCustomStyles();
}

function removeItem(button) {
  button.closest(".row").remove();
}

function populateMenuItemsDropdown(selectElement) {
  selectElement.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a menu item";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  selectElement.appendChild(defaultOption);

  if (window.menuItems) {
    window.menuItems.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.name;
      option.textContent = item.name;
      selectElement.appendChild(option);
    });
  }

  $(selectElement).select2();
}

document
  .getElementById("orderForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    let orderItems = [];
    document.querySelectorAll("#orderItems .row").forEach((row) => {
      let foodItem = row.querySelector("select[name='foodItem']").value;
      let quantity = row.querySelector("input[name='quantity']").value;

      if (foodItem && quantity) {
        orderItems.push({ foodItem, quantity });
      }
    });

    const token = localStorage.getItem("token");
    const tableNumber = document.getElementById("tableNumber");
    const orderNotes = document.getElementById("orderNotes").value;

    let orderData = {
      table_number: tableNumber.value,
      user_id: 123,
      items: orderItems,
      order_notes: orderNotes,
    };

    try {
      let response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(orderData),
      });

      let data = await response.json();
      if (response.ok) {
        alert("Order placed successfully!");
        document.getElementById("orderForm").reset();
        document.getElementById("orderItems").innerHTML = "";
        document.querySelectorAll("select").forEach((select) => {
          select.value = "";
        });
        tableNumber.value = "";
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Failed to connect to the server: " + error.message);
    }
  });
