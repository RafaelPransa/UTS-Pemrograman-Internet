document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".header-hero-content-wrapper header nav");
  const wrapperHeader = document.querySelector(".header-hero-content-wrapper");
  const menuNavA = document.querySelectorAll(
    ".header-hero-content-wrapper header nav .mid-nav ul li a"
  );
  const hero = document.querySelector(".header-hero-content-wrapper #hero");
  const btnRegister = document.querySelector(
    "header nav .end-nav .btn-register"
  );

  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      nav.classList.add("nav-scroll");
      hero.classList.add("hero-scroll");
      btnRegister.style.background = "transparent";
      btnRegister.style.color = "var(--green-primary)";
      btnRegister.style.border = "1px solid var(--green-primary)";
      menuNavA.forEach((menus) => {
        menus.classList.add("color-a-scroll");
      });
    } else {
      nav.classList.remove("nav-scroll");
      hero.classList.remove("hero-scroll");
      btnRegister.style.background = "var(--green-primary)";
      btnRegister.style.color = "#fff";
      menuNavA.forEach((menus) => {
        menus.classList.remove("color-a-scroll");
      });
    }
  });

  btnRegister.addEventListener("mouseover", () => {
    const isScrolledNav = nav.classList.contains("nav-scroll");
    if (isScrolledNav) {
      btnRegister.style.backgroundColor = "var(--green-primary)";
      btnRegister.style.color = "#fff";
    }
  });

  function checkNavStatus() {
    const isNavScrolled = nav.classList.contains("nav-scroll");
    if (isNavScrolled) {
      wrapperHeader.style.paddingTop = "100px";
    } else {
      wrapperHeader.style.paddingTop = "20px";
    }
  }
  window.addEventListener("scroll", checkNavStatus);
  checkNavStatus();
});
