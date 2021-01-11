const btn = document.querySelector(".dropdown");
const link = document.querySelector("nav .link");

btn.addEventListener("click", () => {
  link.classList.toggle("open");
});

// TODO: implement CLient side POP ups
