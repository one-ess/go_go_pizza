import { API_URL } from "./const";
import { cartControl } from "./cartControl";
import { cartModal, modalCartPrice, modalCartList, cartBtns, nextBtn, prevBtn, modalCartBlock, modalCartDelivery, modalCartForm } from "./elements";
import { scrollController } from "./scrollController";
import { removePreloader, startPreloader } from "./preloader";
import getProducts from "./getProducts";

const renderCartModal = async () => {
  let totalPrice = 0;
  cartModal.classList.add("modal_active");
  if (cartControl.cartData.length) {
    modalCartList.textContent = "";
    nextBtn.disabled = false;
    startPreloader(modalCartList);
    const cardsData = await Promise.all(cartControl.cartData.map(async (cartItem) => await getProducts(`${API_URL}/api/products/${cartItem.id}`)));
    removePreloader();
    const cardsCart = cardsData.map((data, index) => {
      const cartItem = cartControl.cartData[index];

      const cardCart = document.createElement("li");
      cardCart.classList.add("modal-cart__item");

      cardCart.innerHTML = `
            <picture>
                <source srcset="${data.images[1]}" type="image/webp">
                <img class="modal-cart__image" src="${data.images[0]}" alt="${data.name.ru}" width="63" height="63">
            </picture>
            <div class="modal-cart__content">
                <h3 class="modal-cart__title-pizza">${data.name.ru}</h3>
                <p class="modal-cart__info-pizza"><span class="modal-cart__price-pizza">${data.price[cartItem.size]} ₽</span><span>/</span><span class="modal-cart__weight-pizza">${parseInt(cartItem.size)} см</span></p>
            </div>
            <button class="modal-cart__delete-button" data-id="${cartItem.cardId}"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.4549 4.01401C11.3985 4.00992 11.3805 4.01242 11.3579 3.99904L11.3522 3.43064C11.2979 3.41032 11.2015 3.42189 11.1407 3.42189L8.70136 3.42086V4.01348L7.73452 4.01392L7.73349 3.00582C7.73333 2.72455 7.65345 2.33685 8.03552 2.29858L11.7298 2.30315C12.0624 2.30324 12.3344 2.23977 12.3353 2.69883L12.3345 4.01423L11.4549 4.01401Z" fill="#C1AB91"></path>
                    <path d="M15.3507 16.174C15.2392 16.6674 14.9551 17.2592 14.3936 17.3414C14.2455 17.363 14.0776 17.3491 13.9275 17.3492L6.00015 17.3485C5.65702 17.3475 5.40171 17.3159 5.14284 17.0553C4.5339 16.4421 4.61993 15.4641 4.61956 14.6723L4.61746 6.06336C4.59609 6.03136 4.48624 6.05367 4.44859 6.05367L3.77281 6.05352C3.38871 6.05317 3.35065 6.03086 3.34968 5.60977C3.34937 5.46586 3.30965 5.12292 3.37262 5.00142L3.39212 4.96339C3.43021 4.89298 3.48177 4.85839 3.55674 4.8362L16.0585 4.83686C16.2029 4.83683 16.3554 4.82702 16.4991 4.83989C16.7356 4.86105 16.7032 5.09483 16.7041 5.24905L16.7068 5.78127C16.7066 6.08752 16.4049 6.05405 16.1876 6.0542L15.4515 6.05336C15.4305 6.06827 15.4378 6.29108 15.4377 6.32805L15.4364 15.1909C15.4362 15.5305 15.4155 15.8385 15.3507 16.174ZM12.5871 8.00598L12.5891 14.863L13.9216 14.8637L13.9259 8.00652L12.9954 8.00552C12.8661 8.00536 12.7147 7.98989 12.5871 8.00598ZM6.12246 8.00611L6.12071 14.8636L7.45806 14.8637L7.45331 8.00689L6.12246 8.00611ZM9.34309 8.00598L9.34699 14.6687C9.34709 14.7314 9.34087 14.8014 9.35162 14.8628L10.6999 14.8599L10.7015 8.01195C10.6744 7.99998 10.6332 8.00592 10.6035 8.00592L9.34309 8.00598Z" fill="#C1AB91"></path>
                </svg>
            </button>
          `;

      totalPrice += data.price[cartItem.size];

      return cardCart;
    });
    modalCartList.append(...cardsCart);
  } else {
    modalCartList.innerHTML = "<li>Корзина пуста...</li>";
    nextBtn.disabled = true;
  }
  modalCartPrice.forEach((elem) => (elem.textContent = `${totalPrice} ₽`));
};

export const initCartModalHandlers = () => {
  cartModal.addEventListener("click", (e) => {
    if (e.target.closest(".modal__close") || e.target === cartModal) {
      cartModal.classList.remove("modal_active");
      scrollController.enableScroll();
    }
  });

  modalCartList.addEventListener("click", (e) => {
    const deleteButton = e.target.closest(".modal-cart__delete-button");
    if (deleteButton) {
      const cartId = deleteButton.dataset.id;
      cartControl.removeCart(cartId);
      renderCartModal();
    }
  });

  cartBtns.forEach((cartBtn) => {
    cartBtn.addEventListener("click", () => {
      renderCartModal();
      scrollController.disableScroll();
    });
  });

  nextBtn.addEventListener("click", () => {
    modalCartBlock.style.display = "none";
    modalCartDelivery.style.display = "block";
  });

  prevBtn.addEventListener("click", () => {
    modalCartBlock.style.display = "block";
    modalCartDelivery.style.display = "none";
  });

  modalCartForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(modalCartForm);
    const data = Object.fromEntries(formData);
    data.pizzas = cartControl.cartData;

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Опс что-то не так с отправкой");
      }

      const order = await response.json();

      cartControl.clearCart();
      modalCartForm.reset();
      renderCartModal();
      prevBtn.dispatchEvent(new Event("click"));
      alert(`Заказ оформлен, номер заказа ${order.orderId}, объект формы получен в консоль`);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  });
};
