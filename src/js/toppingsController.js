import { API_URL } from "./const";
import getProducts from "./getProducts";
import renderProducts from "./renderProducts";

export const toggleToppings = () => {
  const toppingButton = document.querySelector(".topping__button");
  const toppingList = document.querySelector(".topping__list");

  toppingButton.addEventListener("click", (e) => {
    if (toppingList.classList.contains("topping__list_active")) {
      e.target.classList.remove("topping__button_active");
      toppingList.classList.remove("topping__list_active");
    } else {
      e.target.classList.add("topping__button_active");
      toppingList.classList.add("topping__list_active");
    }
  });
};

export const renderToppings = async () => {
  const { en: enToppings, ru: ruToppings } = await getProducts(`${API_URL}/api/toppings`);

  const toppingsContainer = document.querySelector(".topping__list");
  toppingsContainer.textContent = "";
  const toppingElements = enToppings.map((enTopping, index) => {
    const li = document.createElement("li");
    li.classList.add("topping__item");
    li.innerHTML = ` 
                   <input class="topping__input" id="${enTopping}" type="checkbox" name="topping" value="${enTopping}" />
                   <label class="topping__label" for="${enTopping}">${ruToppings[index]}</label>`;
    return li;
  });
  toppingsContainer.append(...toppingElements);
};

const createToppingReset = () => {
  const li = document.createElement("li");
  li.classList.add("topping__item");
  const toppingResetEl = document.createElement("button");
  toppingResetEl.classList.add("topping__label");
  toppingResetEl.textContent = "Сбросить";
  toppingResetEl.type = "reset";
  li.append(toppingResetEl);
  return li;
};

export const changeTopping = () => {
  const toppingsForm = document.querySelector(".topping__form");
  const toppingsContainer = document.querySelector(".topping__list");
  const toppingResetEl = createToppingReset();

  toppingsForm.addEventListener("change", () => {
    const formData = new FormData(toppingsForm);
    const pickedToppings = [];
    for (const [_, value] of formData.entries()) {
      pickedToppings.push(value);
    }
    renderProducts(pickedToppings);
    if (pickedToppings.length) {
      toppingsContainer.append(toppingResetEl);
    } else {
      toppingResetEl.remove();
    }
  });

  toppingResetEl.addEventListener("click", () => {
    toppingResetEl.remove();
    toppingsForm.reset();
    renderProducts();
  });
};
