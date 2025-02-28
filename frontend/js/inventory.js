document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".horizontal-form");
  const tbody = document.querySelector("table tbody");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get values from the form inputs
    const itemName = document.getElementById("itemName").value.trim();
    const category = document.getElementById("category").value.trim();
    const price = document.getElementById("price").value.trim();
    const quantity = document.getElementById("quantity").value.trim();
    const unit = document.getElementById("unit").value.trim();
    const expiryDateValue = document.getElementById("expiryDate").value;

    // Calculate expiry status based on expiryDateValue
    let expiryDisplay = "";
    if (expiryDateValue) {
      const expiryDate = new Date(expiryDateValue);
      const now = new Date();
      const timeDiff = expiryDate - now;
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      expiryDisplay = daysRemaining >= 0 ? `Expires in ${daysRemaining} days` : "Expired";
    } else {
      expiryDisplay = "No expiry date";
    }

    // Determine stock status
    const numericQuantity = parseFloat(quantity);
    const stockStatus = numericQuantity <= 5 ? "Low stock" : "In stock";

    // Create a new table row with non-editable Expiry status, Stock status, and Action cells
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${itemName}</td>
      <td>${category}</td>
      <td>${quantity}</td>
      <td>${unit}</td>
      <td>${price}</td>
      <td>${expiryDateValue}</td>
      <td><span class="expiry-status">${expiryDisplay}</span></td>
      <td><span class="status">${stockStatus}</span></td>
      <td>
        <button class="action-btn edit-btn">Edit</button>
        <button class="action-btn remove-btn">Remove</button>
      </td>
    `;
    tbody.appendChild(tr);

    // Remove functionality
    const removeBtn = tr.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => {
      tr.remove();
    });

    // Edit functionality: Toggle between "Edit" and "Save"
    const editBtn = tr.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      // Editable cells: indexes 0 to 5 (Item Name, Category, Quantity, Unit, Price, Expiry Date)
      const cells = tr.querySelectorAll("td");
      if (editBtn.textContent === "Edit") {
        for (let i = 0; i < 6; i++) {
          const cellValue = cells[i].textContent;
          // For the Expiry Date cell (index 5), use a date input; otherwise, use text input.
          if (i === 5) {
            cells[i].innerHTML = `<input type="date" value="${cellValue}" />`;
          } else {
            cells[i].innerHTML = `<input type="text" value="${cellValue}" />`;
          }
        }
        editBtn.textContent = "Save";
      } else {
        // Save mode: Retrieve new values from inputs and update the row
        const newItemName = cells[0].querySelector("input").value;
        const newCategory = cells[1].querySelector("input").value;
        const newQuantity = cells[2].querySelector("input").value;
        const newUnit = cells[3].querySelector("input").value;
        const newPrice = cells[4].querySelector("input").value;
        const newExpiryDate = cells[5].querySelector("input").value;
        
        // Update editable cells with new text
        cells[0].textContent = newItemName;
        cells[1].textContent = newCategory;
        cells[2].textContent = newQuantity;
        cells[3].textContent = newUnit;
        cells[4].textContent = newPrice;
        cells[5].textContent = newExpiryDate;
        
        // Re-calculate Expiry status using the new Expiry Date
        let newExpiryDisplay = "";
        if (newExpiryDate) {
          const expiryDate = new Date(newExpiryDate);
          const now = new Date();
          const timeDiff = expiryDate - now;
          const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          newExpiryDisplay = daysRemaining >= 0 ? `Expires in ${daysRemaining} days` : "Expired";
        } else {
          newExpiryDisplay = "No expiry date";
        }
        
        // Re-calculate Stock status using the new Quantity
        const newNumericQuantity = parseFloat(newQuantity);
        const newStockStatus = newNumericQuantity <= 5 ? "Low stock" : "In stock";
        
        // Update the non-editable cells for Expiry status and Stock status
        cells[6].innerHTML = `<span class="expiry-status">${newExpiryDisplay}</span>`;
        cells[7].innerHTML = `<span class="status">${newStockStatus}</span>`;
        
        // Change button text back to "Edit"
        editBtn.textContent = "Edit";
      }
    });

    form.reset();
  });
});
