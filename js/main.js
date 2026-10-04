const products = [
  "Country sourdough loaf",
  "Seeded wheat loaf",
  "Soft sandwich loaf",
  "Butter croissant",
  "Fruit hand pie",
  "Cinnamon bun",
  "Celebration cake"
];

const storageKey = "northStarBakeryOrder";

function loadOrder() {
  try {
    const order = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return order && typeof order === "object" && !Array.isArray(order)
      ? order
      : {};
  } catch {
    return {};
  }
}

function showOrder(order, list) {
  list.replaceChildren();

  Object.entries(order).forEach(([name, quantity]) => {
    const item = document.createElement("li");
    item.textContent = `${name} × ${quantity}`;
    list.append(item);
  });
}

const productChoice = document.getElementById("product-choice");

if (productChoice) {
  const quantityInput = document.getElementById("product-quantity");
  const addButton = document.getElementById("add-to-order");
  const feedback = document.getElementById("order-feedback");
  const list = document.getElementById("order-list");
  const order = loadOrder();

  showOrder(order, list);

  addButton.addEventListener("click", () => {
    const name = productChoice.value;
    const quantity = Number(quantityInput.value);

    if (!products.includes(name)) {
      feedback.textContent = "Choose a baked good first.";
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      feedback.textContent = "Choose a quantity from 1 to 20.";
      return;
    }

    order[name] = (order[name] || 0) + quantity;
    localStorage.setItem(storageKey, JSON.stringify(order));
    showOrder(order, list);
    feedback.textContent = `${name} added to your request.`;
  });
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const feedback = document.getElementById("form-feedback");

  const order = loadOrder();
  const details = document.getElementById("item-details");

  if (details && Object.keys(order).length && !details.value.trim()) {
    details.value = Object.entries(order)
      .map(([name, quantity]) => `${name} × ${quantity}`)
      .join("\n");
  }

  contactForm.addEventListener("submit", event => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const requestType = document.getElementById("request-type").value;
    const pickupDate = document.getElementById("pickup-date").value;
    const itemDetails = details.value.trim();

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !validEmail || !requestType || !pickupDate || itemDetails.length < 10) {
      event.preventDefault();
      feedback.textContent =
        "Please complete the required fields and provide at least 10 characters of item details.";
      return;
    }

    event.preventDefault();
    feedback.textContent =
      "Your form passed the checks. This website is a demo, so your request has not been sent.";
  });
}