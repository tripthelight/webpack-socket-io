/**
 * 브라우저를 새로고침 할 경우 true를 return함
 */
export default (window.performance.navigation && window.performance.navigation.type === 1) ||
  window.performance
    .getEntriesByType("navigation")
    .map((nav) => {
      nav.type;
    })
    .indexOf("reload") > 0;
