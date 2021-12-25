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
            loadInto(this, "./components/navbar.html", function () {
                var search = document.querySelector(".search-input");
                var offset = document.querySelectorAll(".search-offset");
                var closeButton = document.querySelector(".search-close");
                var searchList = document.querySelector(".search-list");
                searchList.list = searchList.querySelector(".search-list-items");

                closeButton.classList.add("d-none");
                searchList.classList.add("d-none");

                search.onclick = function () {
                    var val = search.getAttribute("open");
                    if (val == "false" || val == null) {
                        search.setAttribute("open", "true");
                        offset.forEach((element) => {
                            element.classList.add("d-none");
                        });
                        search.parentElement.classList.add("w-75");
                        closeButton.classList.remove("d-none");
                        searchList.classList.remove("d-none");
                    }
                };
                search.oninput = function () {
                    var items = [
                        "calções",
                        "calças",
                        "camisolas",
                        "moveis",
                        "eletrodomesticos",
                        "interior",
                        "decoracao",
                        "rapaz",
                        "rapariga",
                        "homem",
                        "criança",
                        "mulher",
                    ];
                    searchList.list.innerHTML = "";

                    if (this.value == "" || this.value == null) {
                        for (let i = 0; i < items.length; i++) {
                            searchList.list.innerHTML += newListItem(firstToUpper(items[i]));
                        }
                    } else {
                        for (let i = 0; i < items.length; i++) {
                            if (items[i].includes(this.value.toLowerCase())) {
                                searchList.list.innerHTML += newListItem(firstToUpper(items[i]));
                            }
                        }
                    }
                };

                closeButton.onclick = function () {
                    search.setAttribute("open", "false");
                    offset.forEach((element) => {
                        element.classList.remove("d-none");
                    });
                    search.parentElement.classList.remove("w-75");
                    closeButton.classList.add("d-none");
                    searchList.classList.add("d-none");
                };
            });
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

function firstToUpper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function newListItem(text) {
    return (
        '<li class="my-1"><a href="#" class="text-decoration-none text-dark">' + text + "</a></li>"
    );
}
