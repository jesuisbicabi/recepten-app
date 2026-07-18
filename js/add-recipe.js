import { supabaseClient } from "./supabase-client.js";
import { showList } from "./views.js";
import { loadRecipes } from "./recipes.js";

const form = document.getElementById("add-recipe-form");
const errorEl = document.getElementById("form-error");
const saveBtn = document.getElementById("save-recipe-btn");
const backBtn = document.getElementById("back-to-list-btn");

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function hideError() {
  errorEl.hidden = true;
  errorEl.textContent = "";
}

function toNumberOrNull(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toTextOrNull(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

backBtn.addEventListener("click", () => {
  hideError();
  showList();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideError();

  const formData = new FormData(form);
  const title = toTextOrNull(formData.get("title"));

  if (!title) {
    showError("Vul een titel in.");
    return;
  }

  const payload = {
    title,
    description: toTextOrNull(formData.get("description")),
    prep_time: toNumberOrNull(formData.get("prep_time")),
    servings: toNumberOrNull(formData.get("servings")),
    highlight_nutrient: toTextOrNull(formData.get("highlight_nutrient")),
    image_url: toTextOrNull(formData.get("image_url")),
  };

  saveBtn.disabled = true;
  saveBtn.textContent = "Bewaren…";

  const { error } = await supabaseClient.from("recipes").insert(payload);

  saveBtn.disabled = false;
  saveBtn.textContent = "Recept bewaren";

  if (error) {
    console.error("Kon recept niet opslaan:", error);
    showError("Opslaan is niet gelukt. Controleer je verbinding en probeer het opnieuw.");
    return;
  }

  form.reset();
  showList();
  loadRecipes();
});
