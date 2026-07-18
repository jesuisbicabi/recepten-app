const listView = document.getElementById("view-list");
const addView = document.getElementById("view-add");

export function showList() {
  addView.hidden = true;
  listView.hidden = false;
}

export function showAdd() {
  listView.hidden = true;
  addView.hidden = false;
  window.scrollTo(0, 0);
}
