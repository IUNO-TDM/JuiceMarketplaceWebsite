$.getJSON('/components', function(data) {
    ingredients = [];
    data.forEach(function(element) {
        var id = element['id'];
        var name = element['name'];
        var description = element['description'];
        var ingredient = new Ingredient(id, name, description);
        ingredients.push(ingredient);
        console.log("Component: id = "+id+", name = '"+name+"', description = '"+description+"'.");
    });
    componentsLoaded(true);
}).fail(function() {
    ingredients = [];
    componentsLoaded(false);
    console.log("Error");
})

function componentsLoaded(success) {
    if (success) {
        var table = $("#ingredientTable");
        var template = $("#ingredientTable .ingredient")[0];
        $("#ingredientTable .ingredient").remove();
        ingredients.forEach(function(element) {
            var row = $(template).clone();

			row.find('.name').html(element.name);
			row.find('.description').html(element.description);
            row.click(function() {
                openAddIngredientAmountDialog(element.id);
            });
            table.append(row);
            // table.crea
        });
        var recipe = new Recipe("Apfel-/Bananenschorle");
        // var sequence = new Sequence(ingredients[3]);
        // sequence.addPhase(new Phase(0, 100, 100));
        // sequence.addPhase(new Phase(110, 130, 100));
        // recipe.addSequence(sequence);

        // sequence = new Sequence(ingredients[1]);
        // sequence.addPhase(new Phase(0, 80, 100));
        // sequence.addPhase(new Phase(100, 40, 80));
        // sequence.addPhase(new Phase(150, 100, 100));
        // recipe.addSequence(sequence);

        // sequence = new Sequence(ingredients[2]);
        // sequence.addPhase(new Phase(60, 200, 70));
        // recipe.addSequence(sequence);

        var recipeConfigurator = new RecipeConfigurator(recipe, "recipe");
        recipeConfigurator.render();
    } else {

    }
}

function ingredientSearch() {
  // Declare variables 
  var input, filter, table, tr, td, i;
  input = document.getElementById("ingredientSearchBox");
  filter = input.value.toUpperCase();
  table = document.getElementById("ingredientTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}
