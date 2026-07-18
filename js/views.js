const listView = document.getElementById("view-list");
const addView = document.getElementById("view-add");
const detailView = document.getElementById("view-detail");

export function showList() {
  addView.hidden = true;
  detailView.hidden = true;
  listView.hidden = false;
}

export function showAdd() {
  listView.hidden = true;
  detailView.hidden = true;
  addView.hidden = false;
  window.scrollTo(0, 0);
}

export function showDetail() {
  listView.hidden = true;
  addView.hidden = true;
  detailView.hidden = false;
  window.scrollTo(0, 0);
}
