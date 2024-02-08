const express = require('express');
const pool = require('../config/database');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Nurtition Information");
});

router.get('/:name', async(req, res) => {
    try {
        const food_item = await pool.query(`SELECT id, name, calories, protein FROM nutrition_data WHERE name LIKE '%${req.params.name}%'`);

        res.json(food_item.rows);
    }
    catch (err) {
        console.error(err.message);
    }
});

router.get('/userRecipes/:userId', async(req, res) => {
    const userId = req.params.userId;
    
    try {
        let recipes = await pool.query(`SELECT * FROM recipes WHERE auth0_id = '${userId}'`);
        res.json(recipes.rows);
    } catch (e) {
        console.error(e.stack);
    }
});

router.post('/makeIngredient', async(req, res) => {

    const { userId, recipe } = req.body;

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
        const r = await pool.query(query);
        console.log('Inserted recipe with ID:', r.rows[0].id);
        return r.rows[0].id;
    } catch (e) {
        console.error(e.stack);
    }
})

module.exports = router;