$('#addIngredient').on('click', function() {
    $('#ingredientsContainer').append(`
        <div class="input-group mb-2 ingredient-group">
            <input type="text" class="form-control ingredient" placeholder="Ingredient" required>
            <input type="number" class="form-control quantity" placeholder="Quantity" required>
            <input type="text" class="form-control unit" placeholder="Unit" required>
            <button type="button" class="btn btn-danger remove-ingredient">Remove</button>
        </div>
    `);
});

$(document).on('click', '.remove-ingredient', function() {
    $(this).closest('.ingredient-group').remove();
});

$('#menuForm').on('submit', function(e) {
    e.preventDefault();
    const menuItem = $('#menuItem').val();
    const category = $('#category').val();
    let ingredients = [];
    
    $('.ingredient-group').each(function() {
        let ingredient = $(this).find('.ingredient').val();
        let quantity = $(this).find('.quantity').val();
        let unit = $(this).find('.unit').val();
        ingredients.push(`${ingredient} - ${quantity} ${unit}`);
    });
    
    if (menuItem && category && ingredients.length) {
        alert(`Menu Item: ${menuItem}\nCategory: ${category}\nIngredients:\n${ingredients.join('\n')}`);
    }
});