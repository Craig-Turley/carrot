const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const recipeObject = require('../objects/recipe');

const constants = {
    carbs: 4.00,
    protein: 4.00,
    fat: 9.00
};

function calculateFoodItem(foodItem) {
    const proteinCalories = parseFloat(foodItem.protein) * constants.protein;
    const fatCalories = parseFloat(foodItem.fat) * constants.fat;
    const carbsCalories = parseFloat(foodItem.carbs) * constants.carbs;

    const totalCalories = proteinCalories + fatCalories + carbsCalories;

    let percentProtein = Math.round((proteinCalories / totalCalories) * 100);
    let percentFat = Math.round((fatCalories / totalCalories) * 100);

    let percentCarbs = 100 - (percentProtein + percentFat);

    if (Math.round(foodItem.calories) !== Math.round(totalCalories)) {
        percentProtein = Math.round((proteinCalories / foodItem.calories) * 100);
        percentFat = Math.round((fatCalories / foodItem.calories) * 100);
        percentCarbs = 100 - (percentProtein + percentFat);
    }

    return {
        proteinCalories: proteinCalories,
        fatCalories: fatCalories,
        carbsCalories: carbsCalories,
        percentProtein: percentProtein,
        percentFat: percentFat,
        percentCarbs: percentCarbs
    };
}

function calculateServing(value, serving){
    return Math.round(value / 100 * serving)
}

async function calculateRecipeMap(recipe, ingredients) {
    for (const ingredient of ingredients) {
        const request = await pool.query(`SELECT * FROM nutrition_data WHERE id=${ingredient.id}`);
        const cur = request.rows[0];

        delete cur.id;
        delete cur.name;

        Object.keys(cur).forEach((key) => {
            recipe[key] = (recipe[key] || 0) + parseFloat(cur[key]) * parseFloat(ingredient.serving);
        });
    }

    return recipe;
}

async function calculateRecipe(ingredients) {
    let recipe = new recipeObject();

    delete recipe.id;
    delete recipe.name;

    recipe = await calculateRecipeMap(recipe, ingredients);

    recipe = Object.fromEntries(
      Object.entries(recipe).map(([key, value]) => [key, Math.round(value / 100)])
    );

    return recipe;
}

router.post('/', (req, res) => {

    const content = req.body;

    const recipe = new recipeObject;

    content.ingredients.forEach((ingredient) => {
        Object.keys(ingredient).forEach((key) => {
            recipe[key] += parseInt(ingredient[key]);
        });
    });

    recipe.name = content.name;

    res.json(recipe);
});

router.post('/recipe', async(req, res) => {
    const ingredients = req.body.ingredients;

    let json = await calculateRecipe(ingredients);

    res.json(json);
});

router.post('/food_item', (req, res) => {

    const foodItem = req.body.foodItem;
    console.log(foodItem)
    res.json(calculateFoodItem(foodItem));
});

module.exports = router;
