const btn = document.querySelector("nav .avatar img");
const card = document.querySelector("nav .card");

btn.addEventListener("click", () => {
  card.classList.toggle("show");
});
