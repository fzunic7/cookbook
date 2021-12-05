const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

module.exports = mongoose => {
	var schema = mongoose.Schema({
		name: String,
		description: String,
		ingredients: Array
	}, {
		timestamps: true
	});

	schema.plugin(aggregatePaginate);
	const Recipe = mongoose.model("recipe", schema);

	return Recipe;
};