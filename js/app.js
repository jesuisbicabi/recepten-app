/*
 * Datamodel (schema staat in supabase/schema.sql)
 * ---------------------------------------------------------
 * recipes
 *   id, title, description, created_at, user_id
 *
 * ingredients
 *   id, name, kcal, protein, carbs, sugars, fat, saturated_fat,
 *   unsaturated_fat, fiber, salt   — waarden per 100g
 *
 * recipe_ingredients
 *   recipe_id, ingredient_id, grams, note
 *
 * recipe_steps
 *   recipe_id, step_number, instruction, timer_seconds, why
 *
 * journal_entries
 *   recipe_id, date, stars, note
 *
 * user_id staat overal al in het model klaar voor toekomstig delen
 * tussen gebruikers, maar wordt nu nog niet gebruikt.
 */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}
