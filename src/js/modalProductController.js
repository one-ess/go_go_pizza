import { cartControl } from "./cartControl";
import { API_URL } from "./const";
import { modalProductCart, modalProductForm, modalProductImg, modalProductPrice, modalProductSize, modalProductSizeInputs, modalProductTitle, modalProductToppings, productModal, productList } from "./elements";
import { removePreloader, startPreloader } from "./preloader";
import { scrollController } from "./scrollController";
import getProducts from "./getProducts";

const renderProductModal = async (id) => {
  startPreloader(document.body);
  const product = await getProducts(`${API_URL}/api/products/${id}`);
  removePreloader();
  modalProductTitle.textContent = product.name.ru;
  modalProductImg.src = product.images[0];
  modalProductImg.alt = product.name.ru;
  modalProductImg.previousElementSibling.srcset = product.images[1];
  modalProductToppings.textContent = product.toppings.ru;
  modalProductSize.textContent = `${Object.keys(product.price)[0].slice(0, -2)} см`;
  modalProductPrice.textContent = `${Object.values(product.price)[0]} ₽`;
  modalProductForm.id = id;
  modalProductCart.dataset.id = id;
  productModal.classList.add("modal_active");

  const updatePrice = () => {
    const selectedSizeInput = modalProductForm.querySelector('input[name="size"]:checked');
    modalProductPrice.textContent = `${product.price[selectedSizeInput.value]} ₽`;
    modalProductSize.textContent = `${parseInt(selectedSizeInput.value)} см`;
  };

  modalProductSizeInputs.forEach((input) => {
    input.addEventListener("change", updatePrice);
  });
};

export const initProductModalHandlers = () => {
  let timerId = null;
  modalProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = modalProductForm.querySelector(".modal-product__cart").dataset.id;
    const formData = new FormData(e.target);
    const product = {
      cardId: crypto.randomUUID(),
      id,
      crust: formData.get("crust"),
      size: formData.get("size"),
    };
    cartControl.addCart(product);

    modalProductCart.disabled = true;
    modalProductCart.textContent = "Добавлено";

    timerId = setTimeout(() => {
      modalProductCart.disabled = false;
      modalProductCart.textContent = "В корзину";
    }, 3000);
  });

  modalProductForm.addEventListener("change", () => {
    clearTimeout(timerId);
    modalProductCart.disabled = false;
    modalProductCart.textContent = "В корзину";
  });

  productModal.addEventListener("click", (e) => {
    if (e.target.closest(".modal__close") || e.target === productModal) {
      productModal.classList.remove("modal_active");
      scrollController.enableScroll();
    }
  });

  productList.addEventListener("click", (e) => {
    if (e.target.closest(".product__button")) {
      const id = e.target.closest(".product__button").dataset.id;
      renderProductModal(id);
      scrollController.disableScroll();
    }
  });
};
