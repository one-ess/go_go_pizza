import { API_URL } from "./const";
import { productList } from "./elements";
import { removePreloader, startPreloader } from "./preloader";
import getProducts from "./getProducts";

const renderProducts = async (toppings = []) => {
  startPreloader(productList);
  const products = await getProducts(`${API_URL}/api/products${toppings ? `?toppings=${toppings}` : ""}`);
  removePreloader();

  if (products.length === 0) {
    productList.textContent = "такой пиццы у нас нет :(";
  } else {
    productList.textContent = "";
    const productElements = products.map((product) => {
      const li = document.createElement("li");
      li.classList.add("products__item");
      li.innerHTML = ` 
                  <article class="products__article product">
                     <picture>
                       <source srcset='${product.images[1]}' type='image/webp' />
                       <img class="product__image" src='${product.images[0]}' loading='lazy' alt='${product.name.ru}' />
                      </picture>
                    <h3 class="product__title">${product.name["ru"].toLowerCase()}</h3>
                    <div class="product__info">
                      <div class="product__price">${product.price["25cm"]} ₽</div>
                      <span>/</span>
                      <div class="product__size">25 см</div>
                    </div>
                    <button class="product__button" type="button" data-id=${product.id} data-modal="product">Выбрать</button>
                  </article>
          `;
      return li;
    });
    productList.append(...productElements);
  }
};

export default renderProducts;
