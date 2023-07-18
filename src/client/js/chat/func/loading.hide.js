export default () => {
  const LOADING = document.querySelector(".loading");
  if (!LOADING) return;
  LOADING.classList.add("hide");
};
