export function querySelectorCreateHideStyle(...selectors: string[]): HTMLStyleElement {

  let styleText = '';

  for (let selector of selectors) {
    styleText += `${selector} { display: none !important; } `;
  }

  const style = document.createElement('style');
  style.textContent = styleText;
  return style;

}



export function blockKeydownKeys(...keys: string[]) {

  for (let key of keys) {
    document.addEventListener("keydown", function(event) {
      if (event.key === key) {
        event.preventDefault();
        event.stopPropagation();
        console.log(`Embed Mode - ${key} key press blocked`);
      }
    }, true);
  }
}