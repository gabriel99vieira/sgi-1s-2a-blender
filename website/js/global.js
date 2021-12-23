!(function (document, window) {
    function loadInto(root, page, execute = (data) => {}) {
        fetch(page)
            .then((response) => response.text())
            .then((html) => {
                root.insertAdjacentHTML("beforeend", html);
                execute(root);
            })
            .catch((error) => {
                console.warn(error);
            });
    }

    class Product extends HTMLElement {
        constructor() {
            super();
            loadInto(this, "./components/produto.html", function (d) {
                if (d.getAttribute("image")) {
                    d.querySelector(".card-img-top").src = d.getAttribute("image");
                }
                if (d.getAttribute("brand")) {
                    d.querySelector(".card-brand").innerText = d.getAttribute("brand");
                }
                if (d.getAttribute("title")) {
                    d.querySelector(".card-title").innerText = d.getAttribute("title");
                }
                if (d.getAttribute("price")) {
                    d.querySelector(".card-title").innerText = d.getAttribute("price");
                }
                if (d.getAttribute("discount")) {
                    d.querySelector(".card-title").innerText = d.getAttribute("discount");
                }
            });
        }
    }
    window.customElements.define("x-product", Product);

    class Navbar extends HTMLElement {
        constructor() {
            super();
            loadInto(this, "./components/navbar.html");
        }
    }
    window.customElements.define("x-navbar", Navbar);

    class Loader extends HTMLElement {
        constructor() {
            super();
            loadInto(this, "./components/loader.html");
        }
    }
    window.customElements.define("x-loader", Loader);
})(document, window);

!(function (document, window) {
    function loaderHide() {
        const loader = document.getElementById("loader-wrapper");
        if (loader) {
            setTimeout(function () {
                loader.style.display = "none";
            }, 700);
            loader.classList.remove("animate__fadeInDown");
            loader.classList.add("animate__animated");
            loader.classList.add("animate__fadeOut");
        }
    }

    function loaderShow() {
        const loader = document.getElementById("loader-wrapper");
        if (loader) {
            loader.style.display = "block";
            loader.classList.remove("animate__fadeOut");
            loader.classList.add("animate__animated");
            loader.classList.add("animate__fadeInDown");
        }
    }

    window.loaderHide = loaderHide;
    window.loaderShow = loaderShow;

    window.onload = function () {
        setTimeout(function () {
            loaderHide();
        }, 200);
    };
})(document, window);
