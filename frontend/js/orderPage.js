$(document).ready(function() {
    $('#foodItem').select2();
    applyCustomStyles();
    
    $('#orderForm').on('change', 'select', function() {
        $(this).select2();
        applyCustomStyles();
    });
});

function applyCustomStyles() {
    $('.select2-container--default .select2-selection--single').css({
        'border-radius': '5px',
        'border': '2px solid #6a0dad',
        'padding': '10px',
        'min-height': 'calc(2.25rem + 12px)',
        'display': 'flex',
        'align-items': 'center',
        'box-sizing': 'border-box',
    });

    $('.select2-container--default .select2-selection--single .select2-selection__rendered').css({
        'line-height': 'calc(2.25rem + 2px)',
        'padding-top': '0',
        'padding-bottom': '0',
    });

    $('.select2-container--default .select2-selection--single .select2-selection__arrow').css({
        'border-left': 'none',
        'border-radius': '0 5px 5px 0',
        'right': '0',
    });

    $('.select2-container--default .select2-selection--single .select2-selection__placeholder').css({
        'line-height': 'calc(2.25rem + 2px)',
        'padding-top': '0',
        'padding-bottom': '0',
    });

    $('.select2-container--default').css({
        'width': '100%',
    });
}

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

    $(row).find('select').select2();
    applyCustomStyles();
}

function removeItem(button) {
    button.closest('.row').remove();
}
 