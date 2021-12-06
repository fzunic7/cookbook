const db = require("../models");
const Recipe = db.recipe;

/**
 * @api {post} /recipe/create Create recipe
 * @apiName createRecipe
 * @apiGroup Recipe
 * 
 * @apiBody {String} name Name of recipe
 * @apiBody {String} [description] Short description of recipe
 * @apiBody {Array} ingredients Recipe's ingredients
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success":
 *       {
 *         "name": "Pizza",
 *         "description": "This recipe is a hearty, zesty main dish with a crisp, golden crust. Feel free to add your favorite toppings.",
 *         "ingredients": [
 *             "1 teaspoon sugar",
 *             "1-1/4 cups warm water (110° to 115°)",
 *             "1/4 cup canola oil",
 *             "1 teaspoon salt",
 *             "1 small onion, chopped"
 *         ],
 *         "_id": "61acabecc6d8f55580cf240f",
 *         "createdAt": "2021-12-05T12:09:16.027Z",
 *         "updatedAt": "2021-12-05T12:09:16.027Z",
 *         "__v": 0
 *       }
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Name can not be empty!"
 *     }
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Some error occurred while creating the Recipe"
 *     }
 */
exports.createRecipe = (req, res) => {
	// Validate request
	if (!req.body.name) {
		res.status(400).send({
			error: "Name can not be empty!"
		});
		return;
	}
	if (!req.body.ingredients) {
		res.status(400).send({
			error: "Ingredients can not be empty!"
		});
		return;
	}

	// Create a Recipe
	const recipe = new Recipe({
		name: req.body.name,
		description: req.body.description,
		ingredients: req.body.ingredients
	});

	// Save Recipe in the database
	recipe
		.save(recipe)
		.then(data => {
			res.send({
				success: data
			});
		})
		.catch(err => {
			res.status(500).send({
				error: err.message || "Some error occurred while creating the Recipe."
			});
		});
};

/**
 * @api {get} /recipe Retrieve all recipes
 * @apiName getAllRecipes
 * @apiGroup Recipe
 * 
 * @apiQuery {String} [name] Name of recipe to filter with
 * @apiQuery {String} [ingredient] Ingredient of recipe to filter with
 * @apiQuery {Number} [page] Page of recipe list
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success":
 *       {
 *         "recipes": [
 *           {
 *               "_id": "61acabecc6d8f55580cf240f",
 *               "name": "Pizza",
 *               "description": "This recipe is a hearty, zesty main dish with a crisp, golden crust. Feel free to add your favorite toppings.",
 *               "ingredients": [
 *                   "1 teaspoon sugar",
 *                   "1-1/4 cups warm water (110° to 115°)",
 *                   "1/4 cup canola oil",
 *                   "1 teaspoon salt",
 *                   "1 small onion, chopped"
 *               ],
 *               "createdAt": "2021-12-05T12:09:16.027Z",
 *               "updatedAt": "2021-12-05T12:09:16.027Z",
 *               "__v": 0
 *           }
 *         ],
 *         "totalRecipes": 1,
 *         "limit": 5,
 *         "page": 1,
 *         "totalPages": 1,
 *         "pagingCounter": 1,
 *         "hasPrevPage": false,
 *         "hasNextPage": false,
 *         "prevPage": null,
 *         "nextPage": null
 *       }
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Recipes not found"
 *     }
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Error while retrieving recipes"
 *     }
 */
exports.getAllRecipes = (req, res) => {
	let aggregateOptions = [];

	//PAGINATION
	let page = parseInt(req.query.page) || 1;
	let limit = parseInt(req.query.limit) || 5;

	//set the options for pagination
	const customLabels = {
		totalDocs: 'totalRecipes',
		docs: 'recipes',
	};

	const options = {
		page,
		limit,
		customLabels
	};

	// Filtering
	let match = {};

	// Filter by recipe name
	if (req.query.name) match.name = {
		$regex: req.query.name,
		$options: 'i'
	};

	// Filter by ingredient
	if (req.query.ingredient) match.ingredients = {
		$regex: req.query.ingredient,
		$options: 'i'
	};

	aggregateOptions.push({
		$match: match
	});

	// Set up the aggregationvar
	myAggregate = Recipe.aggregate(aggregateOptions);
	Recipe
		.aggregatePaginate(myAggregate, options)
		.then(data => {
			if (!data)
				res.status(404).send({
					error: "Recipes not found"
				});
			else res.send({
				success: data
			});
		})
		.catch(err => {
			res.status(500).send({
				error: "Error while retrieving recipes"
			});
		});

};

/**
 * @api {get} /recipe/:id Retrieve a single recipe by id
 * @apiName getSingleRecipe
 * @apiGroup Recipe
 * 
 * @apiParam {Number} id Recipe's unique id.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success":
 *       {
 *         "name": "Pizza",
 *         "description": "This recipe is a hearty, zesty main dish with a crisp, golden crust. Feel free to add your favorite toppings.",
 *         "ingredients": [
 *             "1 teaspoon sugar",
 *             "1-1/4 cups warm water (110° to 115°)",
 *             "1/4 cup canola oil",
 *             "1 teaspoon salt",
 *             "1 small onion, chopped"
 *         ],
 *         "_id": "61acabecc6d8f55580cf240f",
 *         "createdAt": "2021-12-05T12:09:16.027Z",
 *         "updatedAt": "2021-12-05T12:09:16.027Z",
 *         "__v": 0
 *       }
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Recipes with id 61acabecc6d8f55580cf240f not found"
 *     }
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Error while retrieving recipe with id 61acabecc6d8f55580cf240f"
 *     }
 */
exports.getSingleRecipe = (req, res) => {
	const id = req.params.id;

	Recipe.findById(id)
		.then(data => {
			if (!data)
				res.status(404).send({
					error: "Recipe with id " + id + " not found"
				});
			else res.send({
				success: data
			});
		})
		.catch(err => {
			res.status(500).send({
				error: "Error while retrieving recipe with id " + id
			});
		});
};

/**
 * @api {put} /recipe/update/:id Update a Recipe by the id in the request
 * @apiName updateRecipe
 * @apiGroup Recipe
 * 
 * @apiParam {Number} id Recipe's unique id.
 * 
 * @apiBody {String} [name] Name of recipe
 * @apiBody {String} [description] Short description of recipe
 * @apiBody {Array} [ingredients] Recipe's ingredients
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Recipe has been updated"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Data can not be empty!"
 *     }
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Recipe with id 61ab1cadfd833d0e048941b3 not found"
 *     }
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Error while updating recipe with id 61ab1cadfd833d0e048941b3"
 *     }
 */
exports.updateRecipe = (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			error: "Data can not be empty!"
		});
	}

	const id = req.params.id;

	Recipe.findByIdAndUpdate(id, req.body, {
			useFindAndModify: false
		})
		.then(data => {
			if (!data) {
				res.status(404).send({
					error: `Recipe with id ${id} not found`
				});
			} else res.send({
				success: "Recipe has been updated."
			});
		})
		.catch(err => {
			res.status(500).send({
				error: "Error while updating recipe with id " + id
			});
		});
};


/**
 * @api {delete} /recipe/delete/:id Delete recipe
 * @apiName deleteRecipe
 * @apiGroup Recipe
 * 
 * @apiParam {Number} id Recipe's unique id.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Recipe has been deleted"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Recipes with id 61acabecc6d8f55580cf240f not found"
 *     }
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Error while deleting recipe with id 61acabecc6d8f55580cf240f"
 *     }
 */
exports.deleteRecipe = (req, res) => {
	const id = req.params.id;

	Recipe.findByIdAndRemove(id)
		.then(data => {
			if (!data) {
				res.status(404).send({
					error: `Recipe with id ${id} not found`
				});
			} else {
				res.send({
					success: "Recipe has been deleted"
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				error: "Error while deleting recipe with id " + id
			});
		});
};