const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const recipeObject = require('../objects/recipe');
const authCheck = require('../middleware/auth');

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

router.post('/perServing', (req, res) => {
    const ingredient = req.body;

    Object.keys(ingredient).forEach((key) => {
        console.log(`${key}: ${ingredient[key]}`);
    });

    res.json({ cals: Math.round(ingredient.calories / parseInt(ingredient.serving)) });
});

router.get('/', (req, res) => {
    console.log('Calculate Called');
    res.json({ message : 'Use this endpoint to calculate the macros on your recipes!😃' });
});

module.exports = router;