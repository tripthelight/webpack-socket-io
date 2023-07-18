// browser reload
export default (window.performance.navigation && window.performance.navigation.type === 1) ||
  window.performance
    .getEntriesByType("navigation")
    .map((nav) => {
      nav.type;
    })
    .indexOf("reload") > 0;
