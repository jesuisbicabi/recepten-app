import { supabaseClient } from "./supabase-client.js";
import { showList, showDetail } from "./views.js";

const heroEl = document.getElementById("detail-hero");
const heroImg = document.getElementById("detail-hero-img");
const backBtn = document.getElementById("detail-back-btn");
const photoBtn = document.getElementById("detail-photo-btn");
const photoInput = document.getElementById("detail-photo-input");
const kickerEl = document.getElementById("detail-kicker");
const titleEl = document.getElementById("detail-title");
const metaEl = document.getElementById("detail-meta");
const descEl = document.getElementById("detail-desc");
const toastEl = document.getElementById("toast");

let currentRecipeId = null;
let toastTimer = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("toast-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("toast-visible"), 3500);
}

function setHeroImage(url) {
  if (url) {
    heroImg.src = url;
    heroImg.hidden = false;
    heroEl.classList.remove("noimg");
  } else {
    heroImg.hidden = true;
    heroImg.removeAttribute("src");
    heroEl.classList.add("noimg");
  }
}

function renderRecipe(recipe) {
  titleEl.textContent = recipe.title || "Naamloos recept";
  kickerEl.textContent = recipe.category || "Recept";

  if (recipe.description) {
    descEl.textContent = recipe.description;
    descEl.hidden = false;
  } else {
    descEl.textContent = "";
    descEl.hidden = true;
  }

  metaEl.innerHTML = "";
  const time = document.createElement("span");
  time.textContent = recipe.prep_time != null ? `⏱ ${recipe.prep_time} min` : "⏱ –";
  const servings = document.createElement("span");
  servings.textContent = recipe.servings != null ? `🍽 ${recipe.servings} porties` : "🍽 –";
  metaEl.append(time, servings);

  setHeroImage(recipe.image_url);
}

export async function openDetail(recipeId) {
  currentRecipeId = recipeId;
  showDetail();

  titleEl.textContent = "Laden…";
  kickerEl.textContent = "Recept";
  descEl.hidden = true;
  metaEl.innerHTML = "";
  setHeroImage(null);

  const { data, error } = await supabaseClient
    .from("recipes")
    .select("id, title, description, image_url, prep_time, servings, highlight_nutrient")
    .eq("id", recipeId)
    .single();

  if (error || !data) {
    console.error("Kon recept niet laden:", error);
    titleEl.textContent = "Recept niet gevonden";
    showToast("Kon dit recept niet laden.");
    return;
  }

  renderRecipe(data);
}

backBtn.addEventListener("click", () => {
  currentRecipeId = null;
  showList();
});

photoBtn.addEventListener("click", () => {
  if (!currentRecipeId) return;
  photoInput.click();
});

photoInput.addEventListener("change", async () => {
  const file = photoInput.files && photoInput.files[0];
  photoInput.value = "";
  if (!file || !currentRecipeId) return;

  photoBtn.disabled = true;
  photoBtn.classList.add("chip-btn-loading");

  const path = `${currentRecipeId}/cover.jpg`;

  const { error: uploadError } = await supabaseClient.storage
    .from("recipe-images")
    .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });

  if (uploadError) {
    console.error("Upload mislukt:", uploadError);
    showToast("Foto uploaden is niet gelukt. Probeer het opnieuw.");
    photoBtn.disabled = false;
    photoBtn.classList.remove("chip-btn-loading");
    return;
  }

  const { data: publicUrlData } = supabaseClient.storage
    .from("recipe-images")
    .getPublicUrl(path);

  const imageUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

  const { error: updateError } = await supabaseClient
    .from("recipes")
    .update({ image_url: imageUrl })
    .eq("id", currentRecipeId);

  photoBtn.disabled = false;
  photoBtn.classList.remove("chip-btn-loading");

  if (updateError) {
    console.error("Kon recept niet bijwerken:", updateError);
    showToast("Foto is geüpload, maar opslaan is mislukt.");
    return;
  }

  setHeroImage(imageUrl);
});
