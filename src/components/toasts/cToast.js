import { generateTheme } from '../../utils/theme.js';
import { createElement, CircleX } from 'lucide';

class ToastCanela extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.timeoutId = null;
  }

  static get observedAttributes() {
    return ['visible', 'duration', 'type', 'position'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot && oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  show(message) {
    this.render();
    this.setAttribute('visible', '');
    this.shadowRoot.querySelector('.toast-message').textContent = message;

    if (this.timeoutId) clearTimeout(this.timeoutId);

    const duration = parseInt(this.getAttribute('duration')) || 3000;
    this.timeoutId = setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    this.removeAttribute('visible');
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  render() {
    const type = this.getAttribute("type") || "";
    const position = this.getAttribute("position") || "top-right";
    const color = this.getAttribute("color") || "#205781";
    const visible = this.hasAttribute("visible");
    const paleta = generateTheme(color);

    let estilos = `
      :host {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
      }

      .toast {
        display: flex;
        align-items: center;
        padding: 12px 24px;
        border-radius: 6px;
        margin: 10px;
        font-size: 14px;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        pointer-events: auto;
      }

      :host([visible]) .toast {
        opacity: 1;
        transform: translateY(0);
      }

      .toast-message {
        margin-right: 12px;
        flex-grow: 1;
      }

      .close-button {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 4px;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .close-button:hover {
        opacity: 1;
      }

      .close-button svg {
        width: 20px;
        height: 20px;
      }
    `;

    switch (position) {
      case 'top-left':
        estilos += `
          :host {
            top: 0;
            left: 0;
          }
        `;
        break;
      case 'top-center':
        estilos += `
          :host {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }
        `;
        break;
      case 'bottom-left':
        estilos += `
          :host {
            bottom: 0;
            left: 0;
          }
        `;
        break;
      case 'bottom-center':
        estilos += `
          :host {
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          }
        `;
        break;
      case 'bottom-right':
        estilos += `
          :host {
            bottom: 0;
            right: 0;
          }
        `;
        break;
      default:
        estilos += `
          :host {
            top: 0;
            right: 0;
          }
        `;
    }

    switch (type) {
      case 'success':
        estilos += `
          .toast {
            background-color: ${paleta.success.main};
            box-shadow: 0 0.5rem 2rem ${paleta.success.shadow};
            color: ${paleta.surface};
          }
        `;
        break;
      case 'error':
        estilos += `
          .toast {
            background-color: ${paleta.error.main};
            box-shadow: 0 0.5rem 2rem ${paleta.error.shadow};
            color: ${paleta.surface};
          }
        `;
        break;
      case 'warning':
        estilos += `
          .toast {
            background-color: ${paleta.warning.light};
            box-shadow: 0 0.5rem 2rem ${paleta.warning.shadow};
            color: ${paleta.text};
          }
        `;
        break;
      case 'info':
        estilos += `
          .toast {
            background-color: ${paleta.secundario};
            box-shadow: 0 0.5rem 2rem ${paleta.secundarioShadow};
            color: ${paleta.text};
          }
        `;
        break;
      default:
        estilos += `
          .toast {
            background-color: ${paleta.primario};
            box-shadow: 0 0.5rem 2rem ${paleta.primarioShadow};
            color: ${paleta.surface};
          }
        `;
    }

    const contenido = `
      <div class="toast">
        <div class="toast-message">
          <slot></slot>
        </div>
        <button class="close-button" aria-label="Close"></button>
      </div>
    `;

    this.shadowRoot.innerHTML = `
      <style>${estilos}</style>
      ${contenido}
    `;

    const closeIcon = createElement(CircleX, {
      'stroke-width': 2,
      stroke: 'currentColor',
      width: 16,
      height: 16
    });

    const closeButton = this.shadowRoot.querySelector('.close-button');
    closeButton.appendChild(closeIcon);

    closeButton.addEventListener('click', () => {
      this.hide();
    });
  }
}

customElements.define('toast-canela', ToastCanela);
export { ToastCanela };
