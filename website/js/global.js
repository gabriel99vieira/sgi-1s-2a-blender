//
// ───────────────────────────────────────────────────────── COMPONENT LOADER ─────
//

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
                if (d.hasAttribute("image")) {
                    d.querySelector(".card-img-top").src = d.getAttribute("image");
                }
                if (d.hasAttribute("brand")) {
                    d.querySelector(".card-brand").innerText = d.getAttribute("brand");
                }
                if (d.hasAttribute("title")) {
                    d.querySelector(".card-title").innerText = d.getAttribute("title");
                }
                if (d.hasAttribute("price")) {
                    d.querySelector(".card-price").innerText = d.getAttribute("price");
                }
                if (d.hasAttribute("discount")) {
                    d.querySelector(".card-discount").innerText = d.getAttribute("discount");
                }
            });
        }
    }
    window.customElements.define("x-product", Product);

    window.newListItem = function newListItem(text) {
        return (
            '<li class="my-1"><a href="#" class="text-decoration-none text-dark">' +
            text +
            "</a></li>"
        );
    };
    class Navbar extends HTMLElement {
        constructor() {
            super();
            loadInto(this, "./components/navbar.html", function (data) {
                var whenOpenLimitsToSearch = false;

                var search = document.querySelector(".search-input");
                var offset = document.querySelectorAll(".search-offset");
                var closeButton = document.querySelector(".search-close");
                var closeButtonAfter = document.querySelector(".search-close-after");
                var searchList = document.querySelector(".search-list");
                searchList.list = searchList.querySelector(".search-list-items");

                closeButton.classList.add("d-none");
                searchList.classList.add("d-none");

                search.onclick = function () {
                    data.hasAttribute("restrict");
                    var val = search.getAttribute("open");
                    if (val == "false" || val == null) {
                        search.setAttribute("open", "true");
                        closeButton.classList.remove("d-none");
                        searchList.classList.remove("d-none");
                        closeButtonAfter.classList.add("d-none");

                        if (data.hasAttribute("restrict") || whenOpenLimitsToSearch) {
                            document.body.style.overflow = "hidden";
                        }
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

                    let count = 0;
                    if (this.value == "" || this.value == null) {
                        for (let i = 0; i < items.length && count < 6; i++) {
                            count++;
                            searchList.list.innerHTML += newListItem(firstToUpper(items[i]));
                        }
                    } else {
                        for (let i = 0; i < items.length && count < 6; i++) {
                            if (items[i].includes(this.value.toLowerCase())) {
                                count++;
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
                    closeButton.classList.add("d-none");
                    searchList.classList.add("d-none");
                    closeButtonAfter.classList.remove("d-none");

                    if (data.hasAttribute("restrict") || whenOpenLimitsToSearch) {
                        document.body.style.overflow = "";
                    }
                };

                var leftNavClose = document.querySelector(".left-nav-close");
                var leftNav = document.querySelector(".left-navigation");
                var openNav = document.querySelector(".open-left-nav");
                openNav.onclick = function () {
                    leftNav.classList.add("animate__animated");
                    leftNav.classList.add("animate__slideInLeft");
                    leftNav.classList.remove("animate__slideOutLeft");
                    leftNav.classList.remove("d-none");
                };

                leftNavClose.onclick = function () {
                    leftNav.classList.add("animate__animated");
                    leftNav.classList.add("animate__slideOutLeft");
                    setTimeout(function () {
                        leftNav.classList.add("d-none");
                    }, 800);
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

    class Stars extends HTMLElement {
        constructor() {
            super();
            loadInto(this, "./components/stars.html", function (data) {
                if (data.hasAttribute("has")) {
                    var quantity = data.getAttribute("has");
                    for (let i = 0; i < 5; i++) {
                        var star = data.querySelector(".ratings").children[i];

                        if (quantity >= 1) {
                            star.classList.add("bi-star-fill");
                            star.classList.remove("bi-star");
                            star.classList.add("text-warning");
                        } else if (quantity > 0) {
                            star.classList.add("bi-star-half");
                            star.classList.remove("bi-star");
                            star.classList.add("text-warning");
                        } else {
                            // star.classList.add("bi-star-fill");
                            // star.classList.remove("bi-star");
                            star.classList.add("text-secondary");
                        }
                        quantity--;
                    }
                }
            });
        }
    }
    window.customElements.define("x-stars", Stars);
})(document, window);

//
// ───────────────────────────────────────────────────── END COMPONENT LOADER ─────
//

//
// ─────────────────────────────────────────────────────────────────── LOADER ─────
//

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

//
// ─────────────────────────────────────────────────────────────── END LOADER ─────
//

//
// ─────────────────────────────────────────────────────────────────── GLOBAL ─────
//

function firstToUpper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
