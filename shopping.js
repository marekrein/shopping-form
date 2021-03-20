const shoppingForm = document.querySelector(".shopping");
const shoppingLIst = document.querySelector(".list");

let items = [];

function handleSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.item.value;
  if (!name) return;
  const item = {
    name: name,
    id: Date.now(),
    completed: false,
  };
  items.push(item);
  console.log(`There are now ${items.length} items`);
  e.currentTarget.item.value = "";
  shoppingLIst.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function displayItems() {
  const html = items
    .map(
      (item) => `<li class="shopping-item">
        <input
            value="${item.id}"
            type="checkbox"
            ${item.completed && "checked"}
            >
        <span class="itemName">${item.name}</span>
        <button
            aria-label="Remove ${item.name}"
            value="${item.id}"
            >&times;</button>
        </li>`
    )
    .join("");

  shoppingLIst.innerHTML = html;
}

function saveItemsIntoLocalStorage() {
  localStorage.setItem("items", JSON.stringify(items));
}

function restoreItemsFromLocalStorage() {
  const lsItems = JSON.parse(localStorage.getItem("items"));
  if (lsItems.length) {
    items.push(...lsItems);
    shoppingLIst.dispatchEvent(new CustomEvent("itemsUpdated"));
  }
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  shoppingLIst.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function markAsCompleted(id) {
  const itemRef = items.find((item) => item.id === id);
  itemRef.completed = !itemRef.completed;
  shoppingLIst.dispatchEvent(new CustomEvent("itemsUpdated"));
}

shoppingForm.addEventListener("submit", handleSubmit);
shoppingLIst.addEventListener("itemsUpdated", displayItems);
shoppingLIst.addEventListener("itemsUpdated", saveItemsIntoLocalStorage);
shoppingLIst.addEventListener("click", function (e) {
  const id = parseInt(e.target.value);
  if (e.target.matches("button")) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsCompleted(id);
  }
});

restoreItemsFromLocalStorage();
