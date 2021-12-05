module.exports = app => {
	const recipeController = require("../controllers/recipe.controller.js");
	var router = require("express").Router();

	// Create a new Recipe
	router.post("/create", recipeController.createRecipe);
	// Retrieve all recipes
	router.get("/", recipeController.getAllRecipes);
	// Retrieve a single recipe
	router.get("/:id", recipeController.getSingleRecipe);
	// Update a recipe
	router.put("/update/:id", recipeController.updateRecipe);
	// Delete a single recipe
	router.delete("/delete/:id", recipeController.deleteRecipe);

	app.use('/api/recipe', router);
};