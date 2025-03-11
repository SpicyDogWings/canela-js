import { generateTheme } from '../../utils/theme.js';

class ButtonCanela extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const button = this.shadowRoot.querySelector('button');
    if (button) {
      button.addEventListener('click', (e) => {
        if (this.getAttribute('type') === 'submit') {
          const form = this.closest('form');
          if (form) {
            const submitEvent = new SubmitEvent('submit', {
              bubbles: true,
              cancelable: true
            });
            form.dispatchEvent(submitEvent);
          }
        } else if (this.getAttribute('type') === 'reset') {
          const form = this.closest('form');
          if (form) {
            form.reset();
            const selectComponents = form.querySelectorAll('select-canela');
            const dateComponents = form.querySelectorAll('datepicker-canela');
            
            selectComponents.forEach(select => {
              select.reset();
            });
            
            dateComponents.forEach(datepicker => {
              datepicker.reset();
            });
          }
        }
      });
    }
  }

  render() {
    const variante = this.getAttribute("variante") || "";
    const icono = this.getAttribute("icono");
    const redondeado = this.getAttribute("redondeado") || "normal";
    const color = this.getAttribute("color") || "#e3342f";
    const href = this.getAttribute("href");
    const alt = this.getAttribute("alt");
    const type = this.getAttribute("type") || "button";
    const disabled = this.hasAttribute("disabled");

    const paleta = generateTheme(color);

    let estilos = `
      button, a {
        padding: 10px 20px;
        border: none;
        cursor: pointer;
        font-size: 16px;
        text-decoration: none;
        transition: all 0.3s ease;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      button:hover:not(:disabled), a:hover {
        opacity: 0.8;
        box-shadow: 0 0.3rem 0.5rem ${paleta.secundario};
      }
    `;

    let contenido = "";

    if (variante === "link" && href) {
      contenido = `<a href="${href}" ${alt ? `alt="${alt}"` : ""}>`;
    } else {
      contenido = `<button type="${type}" ${disabled ? 'disabled' : ''}>`;
    }

    if (icono) {
      contenido += `<span class="icono">${icono}</span> `;
    }

    contenido += `<slot></slot>`;

    if (variante === "link" && href) {
      contenido += `</a>`;
    } else {
      contenido += `</button>`;
    }

    switch (variante) {
      case "secundario":
        estilos += `button, a { background-color: ${paleta.secundario}; color: ${paleta.primario} ; }`;
        break;
      case "outline":
        estilos += `button, a { background-color: transparent; border: 2px solid ${paleta.primario}; color: ${paleta.primario}; }`;
        break;
      case "ghost":
        estilos += `button, a { background-color: transparent; color: ${paleta.primario}; }`;
        break;
      case "link":
        estilos += `a { color: ${paleta.primario}; text-decoration: underline; }`;
        break;
      default:
        estilos += `button, a { background-color: ${paleta.primario}; color: ${paleta.surface}; }`;
        break;
    }

    switch (redondeado) {
      case "none":
        estilos += `button, a { border-radius: 0; }`;
        break;
      case "pequenno":
        estilos += `button, a { border-radius: 5px; }`;
        break;
      case "mediado":
        estilos += `button, a { border-radius: 20px; }`;
        break;
      case "full":
        estilos += `button, a { border-radius: 50px; }`;
        break;
      default:
        estilos += `button, a { border-radius: 10px; }`;
        break;
    }

    this.shadowRoot.innerHTML = `
      <style>${estilos}</style>
      ${contenido}
    `;
  }
}

// Move the customElements.define before the export
customElements.define('boton-canela', ButtonCanela);

// Add the export statement
export { ButtonCanela };
