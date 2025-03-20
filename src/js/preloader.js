let preloader;

const initPreloader = () => {
  const preloaderEl = document.createElement("div");
  preloaderEl.classList.add("preloader");
  return preloaderEl;
};

export const startPreloader = (element) => {
  if (!document.querySelector(".preloader")) {
    preloader = initPreloader();
    element.append(preloader);
  }
  if (element === document.body) {
    preloader.classList.remove("preloader");
    preloader.classList.add("preloader_body");
    preloader.append(document.createElement("div"));
    preloader.firstElementChild.classList.add("preloader");
  }
};

export const removePreloader = () => {
  if (preloader) {
    preloader.remove();
    preloader = null;
  }
};
