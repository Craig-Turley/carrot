class recipe {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.water = data.water ?? 0; 
    this.serving_size = data.serving_size ?? 0; 
    this.calories = data.calories ?? 0;
    this.total_fat = data.total_fat ?? 0;
    this.saturated_fat = data.saturated_fat ?? 0;
    this.cholesterol = data.cholesterol ?? 0;
    this.sodium = data.sodium ?? 0;
    this.choline = data.choline ?? 0;
    this.folate = data.folate ?? 0;
    this.folic_acid = data.folic_acid ?? 0;
    this.niacin = data.niacin ?? 0;
    this.pantothenic_acid = data.pantothenic_acid ?? 0;
    this.riboflavin = data.riboflavin ?? 0;
    this.thiamin = data.thiamin ?? 0;
    this.vitamin_a = data.vitamin_a ?? 0;
    this.vitamin_a_rae = data.vitamin_a_rae ?? 0;
    this.carotene_alpha = data.carotene_alpha ?? 0;
    this.carotene_beta = data.carotene_beta ?? 0;
    this.cryptoxanthin_beta = data.cryptoxanthin_beta ?? 0;
    this.lutein_zeaxanthin = data.lutein_zeaxanthin ?? 0;
    this.lucopene = data.lucopene ?? 0; 
    this.vitamin_b12 = data.vitamin_b12 ?? 0;
    this.vitamin_b6 = data.vitamin_b6 ?? 0;
    this.vitamin_c = data.vitamin_c ?? 0;
    this.vitamin_d = data.vitamin_d ?? 0;
    this.vitamin_e = data.vitamin_e ?? 0;
    this.tocopherol_alpha = data.tocopherol_alpha ?? 0;
    this.vitamin_k = data.vitamin_k ?? 0;
    this.calcium = data.calcium ?? 0;
    this.copper = data.copper ?? 0;
    this.irom = data.irom ?? 0; 
    this.magnesium = data.magnesium ?? 0;
    this.manganese = data.manganese ?? 0;
    this.phosphorous = data.phosphorous ?? 0;
    this.potassium = data.potassium ?? 0;
    this.selenium = data.selenium ?? 0;
    this.zink = data.zink ?? 0;
    this.protein = data.protein ?? 0;
    this.alanine = data.alanine ?? 0;
    this.arginine = data.arginine ?? 0;
    this.aspartic_acid = data.aspartic_acid ?? 0;
    this.cystine = data.cystine ?? 0;
    this.glutamic_acid = data.glutamic_acid ?? 0;
    this.glycine = data.glycine ?? 0;
    this.histidine = data.histidine ?? 0;
    this.hydroxyproline = data.hydroxyproline ?? 0;
    this.isoleucine = data.isoleucine ?? 0;
    this.leucine = data.leucine ?? 0;
    this.lysine = data.lysine ?? 0;
    this.methionine = data.methionine ?? 0;
    this.phenylalanine = data.phenylalanine ?? 0;
    this.proline = data.proline ?? 0;
    this.serine = data.serine ?? 0;
    this.threonine = data.threonine ?? 0;
    this.tryptophan = data.tryptophan ?? 0;
    this.tyrosine = data.tyrosine ?? 0;
    this.valine = data.valine ?? 0;
    this.carbohydrate = data.carbohydrate ?? 0;
    this.fiber = data.fiber ?? 0;
    this.sugars = data.sugars ?? 0;
    this.fructose = data.fructose ?? 0;
    this.galactose = data.galactose ?? 0;
    this.glucose = data.glucose ?? 0;
    this.lactose = data.lactose ?? 0;
    this.maltose = data.maltose ?? 0;
    this.sucrose = data.sucrose ?? 0;
    this.fat = data.fat ?? 0;
    this.saturated_fatty_acids = data.saturated_fatty_acids ?? 0;
    this.monounsaturated_fatty_acids = data.monounsaturated_fatty_acids ?? 0;
    this.polyunsaturated_fatty_acids = data.polyunsaturated_fatty_acids ?? 0;
    this.fatty_acids_total_trans = data.fatty_acids_total_trans ?? 0;
    this.alcohol = data.alcohol ?? 0;
    this.ash = data.ash ?? 0;
    this.caffeine = data.caffeine ?? 0;
    this.theobromine = data.theobromine ?? 0;
    this.name = data.name ?? 'unknown';
  }
}
  
module.exports = recipe;