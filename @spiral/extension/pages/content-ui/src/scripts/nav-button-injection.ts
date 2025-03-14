import SpiralLogo from "@src/assets/SpiralLogo.png";

let existingInterval: number | null = null;

export function attemptNavButtonInjection() {
  const buttonId = 'spiral-nav-button';


  if (existingInterval) {
    clearInterval(existingInterval);
  }

  existingInterval = setInterval(() => {
    const container = document.querySelector('div[class*="DivMainNavContainer"]');
    if (!container) return;


    if (document.getElementById(buttonId)) {
      let label = document.getElementById('spiral-nav-button-label');
      const tuxbtn = document.getElementById('spiral-nav-button-content')!;

      if (!label) {
        return;
      }

      if (document.querySelector('div[class*="DivDrawerContainer"]')) {

        if (label.style.opacity != "0") {
          label.style.opacity = '0';
          setTimeout(() => label.style.display = 'none', 200);
        }

      } else {

        if (label.style.display != "block" && label.style.display) {
          console.log('Showing')
          label.style.display = 'block';
          label.style.opacity = "0";
          label.style.transition = 'opacity 10ms';
          label.style.opacity = "1";
        }
      }

      return;
    }

    if (document.getElementById(buttonId)) {
      return;
    }

    const button = container.firstElementChild?.cloneNode(true) as HTMLButtonElement;
    button.id = buttonId;
    const label = button.querySelector('div[class*="TUXButton-label"]');

    if (!label) {
      return;
    }

    label.innerHTML = 'Spiral';
    label.id = 'spiral-nav-button-label';

    const realbtn = button.querySelector('button')!;
    realbtn.style.width = '100%';

    const tuxbtn = button.querySelector('div[class*="TUXButton-content"]')! as HTMLButtonElement;
    tuxbtn.style.justifyContent = 'left';
    tuxbtn.id = 'spiral-nav-button-content';

    button.onclick = (e) => {
      e.preventDefault();
      window.open(chrome.runtime.getURL("dashboard/index.html"))
    }

    const img = document.createElement('img');
    img.style.overflow = 'hidden';
    img.src = SpiralLogo;
    img.style.display = 'inline-block';
    img.style.width = '100%';
    button.querySelector('svg')?.replaceWith(img);

    container.insertBefore(button, container.firstChild!);
  }, 100);

}
