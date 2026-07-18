import { supabaseClient } from "./supabase-client.js";

const listEl = document.getElementById("recipe-list");
const countEl = document.getElementById("recipe-count");
const addBtn = document.getElementById("add-recipe-btn");

function onAddRecipe() {
  // Volgt in een volgende stap: nieuw recept toevoegen
}

function renderSkeleton() {
  listEl.setAttribute("aria-busy", "true");
  listEl.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const card = document.createElement("div");
    card.className = "recipe-card recipe-card-skeleton";
    card.innerHTML = `
      <div class="recipe-card-image skeleton-shimmer"></div>
      <div class="recipe-card-body">
        <div class="skeleton-line skeleton-shimmer skeleton-title"></div>
        <div class="skeleton-line skeleton-shimmer"></div>
        <div class="skeleton-line skeleton-shimmer skeleton-short"></div>
      </div>
    `;
    listEl.appendChild(card);
  }
}

function renderError() {
  listEl.setAttribute("aria-busy", "false");
  listEl.innerHTML = "";
  const el = document.createElement("div");
  el.className = "state-message state-error";
  el.innerHTML = `
    <span class="state-icon">⚠️</span>
    <p>Kon geen verbinding maken met je recepten. Controleer je internetverbinding en probeer het opnieuw.</p>
  `;
  listEl.appendChild(el);
  countEl.textContent = "Niet beschikbaar";
}

function renderEmpty() {
  listEl.setAttribute("aria-busy", "false");
  listEl.innerHTML = "";
  const el = document.createElement("div");
  el.className = "state-message state-empty";
  el.innerHTML = `
    <span class="state-icon">🍽</span>
    <p>Nog geen recepten — tik op + om te beginnen</p>
  `;
  const bigAddBtn = document.createElement("button");
  bigAddBtn.type = "button";
  bigAddBtn.className = "add-btn add-btn-large";
  bigAddBtn.setAttribute("aria-label", "Nieuw recept toevoegen");
  bigAddBtn.textContent = "+";
  bigAddBtn.addEventListener("click", onAddRecipe);
  el.appendChild(bigAddBtn);
  listEl.appendChild(el);
  countEl.textContent = "0 recepten";
}

function formatCount(n) {
  return `${n} ${n === 1 ? "recept" : "recepten"}`;
}

function createRecipeCard(recipe) {
  const card = document.createElement("article");
  card.className = "recipe-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.dataset.id = recipe.id;

  const imageWrap = document.createElement("div");
  imageWrap.className = "recipe-card-image";
  if (recipe.image_url) {
    const img = document.createElement("img");
    img.src = recipe.image_url;
    img.alt = "";
    img.loading = "lazy";
    imageWrap.appendChild(img);
  } else {
    imageWrap.classList.add("recipe-card-placeholder");
    imageWrap.textContent = "🍽";
  }

  const body = document.createElement("div");
  body.className = "recipe-card-body";

  const title = document.createElement("h2");
  title.className = "recipe-card-title";
  title.textContent = recipe.title || "Naamloos recept";

  const desc = document.createElement("p");
  desc.className = "recipe-card-desc";
  desc.textContent = recipe.description || "";

  const meta = document.createElement("div");
  meta.className = "recipe-card-meta";

  const time = document.createElement("span");
  time.textContent = recipe.prep_time != null ? `⏱ ${recipe.prep_time} min` : "⏱ –";

  const servings = document.createElement("span");
  servings.textContent = recipe.servings != null ? `🍽 ${recipe.servings} porties` : "🍽 –";

  meta.append(time, servings);
  body.append(title, desc, meta);
  card.append(imageWrap, body);

  const openRecipe = () => console.log(recipe.id);
  card.addEventListener("click", openRecipe);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openRecipe();
    }
  });

  return card;
}

function renderRecipes(recipes) {
  listEl.setAttribute("aria-busy", "false");
  listEl.innerHTML = "";
  const fragment = document.createDocumentFragment();
  recipes.forEach((recipe) => fragment.appendChild(createRecipeCard(recipe)));
  listEl.appendChild(fragment);
  countEl.textContent = formatCount(recipes.length);
}

async function loadRecipes() {
  renderSkeleton();

  const { data, error } = await supabaseClient
    .from("recipes")
    .select("id, title, description, image_url, prep_time, servings")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Kon recepten niet ophalen:", error);
    renderError();
    return;
  }

  if (!data || data.length === 0) {
    renderEmpty();
    return;
  }

  renderRecipes(data);
}

addBtn.addEventListener("click", onAddRecipe);

loadRecipes();
