export const cartControl = {
  cartData: JSON.parse(localStorage.getItem("pizzasCart") || "[]"),
  addCart(product) {
    this.cartData.push(product);
    localStorage.setItem("pizzasCart", JSON.stringify(this.cartData));
  },
  removeCart(cardId = 0) {
    this.cartData = this.cartData.filter((item) => item.cardId !== cardId);
    localStorage.setItem("pizzasCart", JSON.stringify(this.cartData));
  },
  clearCart() {
    this.cartData = [];
    localStorage.setItem("pizzasCart", JSON.stringify(this.cartData));
  },
};
