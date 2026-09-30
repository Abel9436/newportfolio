// Runs in <head> before first paint, so the page never flashes the wrong theme.
// Dark unless the visitor has picked light before.
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"){t="dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;
