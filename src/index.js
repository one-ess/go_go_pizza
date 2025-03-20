import { initCartModalHandlers } from "./js/modalCartController";
import { initProductModalHandlers } from "./js/modalProductController";
import { changeTopping, renderToppings, toggleToppings } from "./js/toppingsController";
import renderProducts from "./js/renderProducts";

const init = () => {
  toggleToppings();
  renderToppings();
  changeTopping();
  renderProducts();
  initProductModalHandlers();
  initCartModalHandlers();
};

init();
