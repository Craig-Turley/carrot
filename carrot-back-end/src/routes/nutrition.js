const express = require('express');
const pool = require('../config/database');
const router = express.Router();
const crypto = require('crypto');

function sha256(ascii) {
    return crypto.createHash('sha256').update(ascii).digest('hex');
}

async function makeIngredient(ingredient) {
    const query = `
        INSERT INTO nutrition_data(
          name, calories, water, serving_size, total_fat,
          saturated_fat, cholesterol, sodium, choline, folate,
          folic_acid, niacin, pantothenic_acid, riboflavin, thiamin,
          vitamin_a, vitamin_a_rae, carotene_alpha, carotene_beta,
          cryptoxanthin_beta, lutein_zeaxanthin, lucopene, vitamin_b12,
          vitamin_b6, vitamin_c, vitamin_d, vitamin_e, tocopherol_alpha,
          vitamin_k, calcium, copper, irom, magnesium, manganese,
          phosphorous, potassium, selenium, zink, protein, alanine,
          arginine, aspartic_acid, cystine, glutamic_acid, glycine,
          histidine, hydroxyproline, isoleucine, leucine, lysine,
          methionine, phenylalanine, proline, serine, threonine,
          tryptophan, tyrosine, valine, carbohydrate, fiber, sugars,
          fructose, galactose, glucose, lactose, maltose, sucrose,
          fat, saturated_fatty_acids, monounsaturated_fatty_acids,
          polyunsaturated_fatty_acids, fatty_acids_total_trans,
          alcohol, ash, caffeine, theobromine)
        VALUES(
          ${ingredient.name ? `'${ingredient.name}'` : 'NULL'},
          ${ingredient.calories || 'NULL'}, ${ingredient.water || 'NULL'}, ${ingredient.serving_size || 'NULL'},
          ${ingredient.total_fat || 'NULL'}, ${ingredient.saturated_fat || 'NULL'}, ${ingredient.cholesterol || 'NULL'},
          ${ingredient.sodium || 'NULL'}, ${ingredient.choline || 'NULL'}, ${ingredient.folate || 'NULL'},
          ${ingredient.folic_acid || 'NULL'}, ${ingredient.niacin || 'NULL'}, ${ingredient.pantothenic_acid || 'NULL'},
          ${ingredient.riboflavin || 'NULL'}, ${ingredient.thiamin || 'NULL'}, ${ingredient.vitamin_a || 'NULL'},
          ${ingredient.vitamin_a_rae || 'NULL'}, ${ingredient.carotene_alpha || 'NULL'}, ${ingredient.carotene_beta || 'NULL'},
          ${ingredient.cryptoxanthin_beta || 'NULL'}, ${ingredient.lutein_zeaxanthin || 'NULL'}, ${ingredient.lucopene || 'NULL'},
          ${ingredient.vitamin_b12 || 'NULL'}, ${ingredient.vitamin_b6 || 'NULL'}, ${ingredient.vitamin_c || 'NULL'},
          ${ingredient.vitamin_d || 'NULL'}, ${ingredient.vitamin_e || 'NULL'}, ${ingredient.tocopherol_alpha || 'NULL'},
          ${ingredient.vitamin_k || 'NULL'}, ${ingredient.calcium || 'NULL'}, ${ingredient.copper || 'NULL'},
          ${ingredient.irom || 'NULL'}, ${ingredient.magnesium || 'NULL'}, ${ingredient.manganese || 'NULL'},
          ${ingredient.phosphorous || 'NULL'}, ${ingredient.potassium || 'NULL'}, ${ingredient.selenium || 'NULL'},
          ${ingredient.zink || 'NULL'}, ${ingredient.protein || 'NULL'}, ${ingredient.alanine || 'NULL'},
          ${ingredient.arginine || 'NULL'}, ${ingredient.aspartic_acid || 'NULL'}, ${ingredient.cystine || 'NULL'},
          ${ingredient.glutamic_acid || 'NULL'}, ${ingredient.glycine || 'NULL'}, ${ingredient.histidine || 'NULL'},
          ${ingredient.hydroxyproline || 'NULL'}, ${ingredient.isoleucine || 'NULL'}, ${ingredient.leucine || 'NULL'},
          ${ingredient.lysine || 'NULL'}, ${ingredient.methionine || 'NULL'}, ${ingredient.phenylalanine || 'NULL'},
          ${ingredient.proline || 'NULL'}, ${ingredient.serine || 'NULL'}, ${ingredient.threonine || 'NULL'},
          ${ingredient.tryptophan || 'NULL'}, ${ingredient.tyrosine || 'NULL'}, ${ingredient.valine || 'NULL'},
          ${ingredient.carbohydrate || 'NULL'}, ${ingredient.fiber || 'NULL'}, ${ingredient.sugars || 'NULL'},
          ${ingredient.fructose || 'NULL'}, ${ingredient.galactose || 'NULL'}, ${ingredient.glucose || 'NULL'},
          ${ingredient.lactose || 'NULL'}, ${ingredient.maltose || 'NULL'}, ${ingredient.sucrose || 'NULL'},
          ${ingredient.fat || 'NULL'}, ${ingredient.saturated_fatty_acids || 'NULL'},
          ${ingredient.monounsaturated_fatty_acids || 'NULL'}, ${ingredient.polyunsaturated_fatty_acids || 'NULL'},
          ${ingredient.fatty_acids_total_trans || 'NULL'}, ${ingredient.alcohol || 'NULL'}, ${ingredient.ash || 'NULL'},
          ${ingredient.caffeine || 'NULL'}, ${ingredient.theobromine || 'NULL'}
        )
        RETURNING id;`;

        try {
            const r = await pool.query(query);
            console.log('Inserted ingredient with ID:', r.rows[0].id);
            return r.rows[0].id;
        } catch (e) {
            console.error(e.stack);
            return -1;
        }
}

router.get('/', (req, res) => {
    res.send("Nutrition Information");
});

//Individual Item
router.get('/item/:name', async(req, res) => {
    try {

        const food_item = await pool.query(`SELECT * FROM nutrition_data WHERE LOWER(name) LIKE LOWER('%${req.params.name}%')`);

        res.json(food_item.rows);
    }
    catch (err) {
        console.error(err.message);
    }
});

router.get('/recipe/:name', async(req, res) => {
    try {
        const recipe = await pool.query(`SELECT * FROM recipes WHERE LOWER(name) LIKE LOWER('%${req.params.name}%')`);

        res.json(recipe.rows);
    }
    catch (err) {
        console.error(err.message);
    }
});

//Get users recipes
router.get('/user_recipes/:userId', async (req, res) => {
    console.log(req.params.userId);

    const userId = sha256(req.params.userId);

    console.log(userId);

    try {
        const recipesResult = await pool.query('SELECT * FROM recipes WHERE auth0_id = $1', [userId]);
        const recipes = recipesResult.rows;

        for (const recipe of recipes) {
            const ingredientDetailsResult = await pool.query('SELECT ingredient_id, serving FROM recipe_ingredients WHERE recipe_id = $1', [recipe.id]);
            const ingredientDetails = ingredientDetailsResult.rows;

            const ingredients = [];
            for (const { ingredient_id, serving } of ingredientDetails) {
                const ingredientResult = await pool.query('SELECT name FROM nutrition_data WHERE id = $1', [ingredient_id]);
                if (ingredientResult.rows.length > 0) {
                    const ingredientInfo = ingredientResult.rows[0];
                    ingredients.push({
                        name: ingredientInfo.name,
                        serving: serving
                    });
                }
            }

            recipe.ingredients = ingredients;
        }

        res.json({ recipes });
    } catch (e) {
        console.error(e.stack);
        res.status(500).send('An error occurred while fetching recipes');
    }
});

//Make an recipe
/* TEST THIS END POINT MAKE SURE IT IS INSERTING VALUES AS EXPECTING */
router.post('/make_recipe', async(req, res) => {

    const { recipe, ingredients, id } = req.body;
    const userId = sha256(id);

    console.log(ingredients);

    const query = `
        INSERT INTO recipes(
          name, calories, water, serving_size, total_fat,
          saturated_fat, cholesterol, sodium, choline, folate,
          folic_acid, niacin, pantothenic_acid, riboflavin, thiamin,
          vitamin_a, vitamin_a_rae, carotene_alpha, carotene_beta,
          cryptoxanthin_beta, lutein_zeaxanthin, lucopene, vitamin_b12,
          vitamin_b6, vitamin_c, vitamin_d, vitamin_e, tocopherol_alpha,
          vitamin_k, calcium, copper, irom, magnesium, manganese,
          phosphorous, potassium, selenium, zink, protein, alanine,
          arginine, aspartic_acid, cystine, glutamic_acid, glycine,
          histidine, hydroxyproline, isoleucine, leucine, lysine,
          methionine, phenylalanine, proline, serine, threonine,
          tryptophan, tyrosine, valine, carbohydrate, fiber, sugars,
          fructose, galactose, glucose, lactose, maltose, sucrose,
          fat, saturated_fatty_acids, monounsaturated_fatty_acids,
          polyunsaturated_fatty_acids, fatty_acids_total_trans,
          alcohol, ash, caffeine, theobromine, auth0_id)
        VALUES(
          ${recipe.name ? `'${recipe.name}'` : 'NULL'},
          ${recipe.calories || 'NULL'}, ${recipe.water || 'NULL'}, ${recipe.serving_size || 'NULL'},
          ${recipe.total_fat || 'NULL'}, ${recipe.saturated_fat || 'NULL'}, ${recipe.cholesterol || 'NULL'},
          ${recipe.sodium || 'NULL'}, ${recipe.choline || 'NULL'}, ${recipe.folate || 'NULL'},
          ${recipe.folic_acid || 'NULL'}, ${recipe.niacin || 'NULL'}, ${recipe.pantothenic_acid || 'NULL'},
          ${recipe.riboflavin || 'NULL'}, ${recipe.thiamin || 'NULL'}, ${recipe.vitamin_a || 'NULL'},
          ${recipe.vitamin_a_rae || 'NULL'}, ${recipe.carotene_alpha || 'NULL'}, ${recipe.carotene_beta || 'NULL'},
          ${recipe.cryptoxanthin_beta || 'NULL'}, ${recipe.lutein_zeaxanthin || 'NULL'}, ${recipe.lucopene || 'NULL'},
          ${recipe.vitamin_b12 || 'NULL'}, ${recipe.vitamin_b6 || 'NULL'}, ${recipe.vitamin_c || 'NULL'},
          ${recipe.vitamin_d || 'NULL'}, ${recipe.vitamin_e || 'NULL'}, ${recipe.tocopherol_alpha || 'NULL'},
          ${recipe.vitamin_k || 'NULL'}, ${recipe.calcium || 'NULL'}, ${recipe.copper || 'NULL'},
          ${recipe.irom || 'NULL'}, ${recipe.magnesium || 'NULL'}, ${recipe.manganese || 'NULL'},
          ${recipe.phosphorous || 'NULL'}, ${recipe.potassium || 'NULL'}, ${recipe.selenium || 'NULL'},
          ${recipe.zink || 'NULL'}, ${recipe.protein || 'NULL'}, ${recipe.alanine || 'NULL'},
          ${recipe.arginine || 'NULL'}, ${recipe.aspartic_acid || 'NULL'}, ${recipe.cystine || 'NULL'},
          ${recipe.glutamic_acid || 'NULL'}, ${recipe.glycine || 'NULL'}, ${recipe.histidine || 'NULL'},
          ${recipe.hydroxyproline || 'NULL'}, ${recipe.isoleucine || 'NULL'}, ${recipe.leucine || 'NULL'},
          ${recipe.lysine || 'NULL'}, ${recipe.methionine || 'NULL'}, ${recipe.phenylalanine || 'NULL'},
          ${recipe.proline || 'NULL'}, ${recipe.serine || 'NULL'}, ${recipe.threonine || 'NULL'},
          ${recipe.tryptophan || 'NULL'}, ${recipe.tyrosine || 'NULL'}, ${recipe.valine || 'NULL'},
          ${recipe.carbohydrate || 'NULL'}, ${recipe.fiber || 'NULL'}, ${recipe.sugars || 'NULL'},
          ${recipe.fructose || 'NULL'}, ${recipe.galactose || 'NULL'}, ${recipe.glucose || 'NULL'},
          ${recipe.lactose || 'NULL'}, ${recipe.maltose || 'NULL'}, ${recipe.sucrose || 'NULL'},
          ${recipe.fat || 'NULL'}, ${recipe.saturated_fatty_acids || 'NULL'},
          ${recipe.monounsaturated_fatty_acids || 'NULL'}, ${recipe.polyunsaturated_fatty_acids || 'NULL'},
          ${recipe.fatty_acids_total_trans || 'NULL'}, ${recipe.alcohol || 'NULL'}, ${recipe.ash || 'NULL'},
          ${recipe.caffeine || 'NULL'}, ${recipe.theobromine || 'NULL'}, '${userId}'
        )
        RETURNING id;`;

    try {
        const response = await pool.query(query);
        let recipe_id = response.rows[0].id;

        console.log('Inserted recipe with ID:', recipe_id);

        for(let i = 0; i < ingredients.length; i++){
            let r = await pool.query(`INSERT INTO recipe_ingredients
                        (recipe_id, ingredient_id, serving)
                        VALUES(${recipe_id}, ${ingredients[i].id}, ${ingredients[i].serving})`);
        };
        res.send({ recipe: response.rows[0].id, ingredients: ingredients });
    } catch (e) {
        console.error(e.stack);
        res.err;
    }
})

router.post('/make_ingredient', async(req, res) => {

    const { ingredient } = req.body;

    let result = makeIngredient(ingredient);

    res.json( {result: result });

})

module.exports = router;
