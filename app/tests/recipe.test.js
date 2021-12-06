const request = require('supertest')
const app = require('../../server')

const recipeRoute = "/api/recipe/";

let recipeId;

describe('Post Endpoints', () => {
    it('should create a new recipe', async () => {
        const res = await request(app)
            .post(recipeRoute + 'create')
            .send({
                "name": "Test recipe",
                "description": "Test recipe description",
                "ingredients": [
                    "Onion",
                    "Tomato",
                    "Flour"
                ]
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toHaveProperty('name');
        expect(res.body.success).toHaveProperty('description');
        expect(res.body.success).toHaveProperty('ingredients');

        recipeId = res.body.success._id;
    });

    it('should fail to create a new recipe without name', async () => {
        const res = await request(app)
            .post(recipeRoute + 'create')
            .send({
                "description": "Test recipe description",
                "ingredients": [
                    "Onion",
                    "Tomato",
                    "Flour"
                ]
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });
});


describe('Get Endpoints', () => {
    it('should retrieve a list of all recipes', async () => {
        const res = await request(app)
            .get(recipeRoute);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toHaveProperty('recipes');
    });

    it('should retrieve an empty filtered list of recipe', async () => {
        const res = await request(app)
        .get(recipeRoute + '?name=dsasdadasdsadasdasdasdas');

        expect(res.statusCode).toEqual(200);
        expect(res.body.success.totalRecipes).toEqual(0);
    })
});

describe('Delete Endpoints', () => {
    it('should delete recipe', async () => {
        const res = await request(app)
        .delete(recipeRoute + '/delete/' + recipeId);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toEqual('Recipe has been deleted');
    });

})