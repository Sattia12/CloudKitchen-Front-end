function addItem() {
    var container = document.getElementById("orderItems");
    var row = document.createElement("div");
    row.classList.add("row", "mb-3");
    row.innerHTML = `
        <div class="col-md-4">
            <label class="form-label">Food Item</label>
            <select class="form-select" name="foodItem">
                <option selected>Select a food item</option>
                <option value="1">Pizza</option>
                <option value="2">Pasta</option>
                <option value="3">Burger</option>
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
}

function removeItem(button) {
    button.closest('.row').remove();
}
