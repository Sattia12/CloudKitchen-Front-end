$("#addIngredient").on("click", function () {
  $("#ingredientsContainer").append(`
        <div class="input-group mb-2 ingredient-group">
            <input type="text" class="form-control ingredient" placeholder="Ingredient" required>
            <input type="number" class="form-control quantity" placeholder="Quantity" required>
            <input type="text" class="form-control unit" placeholder="Unit" required>
            <button type="button" class="btn btn-danger remove-ingredient">Remove</button>
        </div>
    `);
});

$(document).on("click", ".remove-ingredient", function () {
  $(this).closest(".ingredient-group").remove();
});

$("#menuForm").on("submit", function (e) {
  e.preventDefault();
  const menuItem = $("#menuItem").val();
  const category = $("#category").val();
  let ingredients = [];

  $(".ingredient-group").each(function () {
    let ingredient = $(this).find(".ingredient").val();
    let quantity = $(this).find(".quantity").val();
    let unit = $(this).find(".unit").val();
    ingredients.push(`${ingredient} - ${quantity} ${unit}`);
  });

  if (menuItem && category && ingredients.length) {
    alert(
      `Menu Item: ${menuItem}\nCategory: ${category}\nIngredients:\n${ingredients.join(
        "\n"
      )}`
    );
  }
});

document.getElementById("menuForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  const menuItem = formData.get("menuItem");
  const category = formData.get("category");
  let ingredients = [];

  document.querySelectorAll(".ingredient-group").forEach((group) => {
    let ingredientObj = {
      ingredient_name: group.querySelector(".ingredient").value,
      quantity: group.querySelector(".quantity").value,
      unit: group.querySelector(".unit").value,
    };
    ingredients.push(ingredientObj);
  });

  const menuData = {
    name: menuItem,
    category: category,
    ingredients: ingredients,
  };

  const token = localStorage.getItem("token");

  fetch("http://localhost:3000/menu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(menuData),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Menu item added successfully!");
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
