import { lighten, darken } from "color2k";


class SelectCanela extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute("name") || "";
    const label = this.getAttribute("label") || "";
    const required = this.hasAttribute("required");
    const disabled = this.hasAttribute("disabled");
    const color = this.getAttribute("color") || "#e3342f";
    const width = this.getAttribute("width") || "100%";
    const placeholder = this.getAttribute("placeholder") || "Seleccione una opción";

    const paleta = this.generarPaleta(color);

    let estilos = `
      :host {
        display: inline-block;
        width: ${width};
      }

      .select-container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
      }

      label {
        font-size: 14px;
        color: #${paleta.label};
      }

      select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 16px;
        outline: none;
        transition: all 0.3s ease;
        box-sizing: border-box;
        background-color: white;
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 40px;
      }
      select:focus {
        border-color: ${paleta.primario};
        box-shadow: 0 0 0 2px ${paleta.selectHover};
      }

      select:disabled {
        background-color: #f3f4f6;
        cursor: not-allowed;
      }

      option {
        padding: 8px;
      }

      option:checked {
        color: ${paleta.surface};
        background-color: ${paleta.primario};
      }
    `;

    const contenido = `
      <div class="select-container">
        ${label ? `<label for="select-${name}">${label}</label>` : ''}
        <select
          id="select-${name}"
          name="${name}"
          ${required ? 'required' : ''}
          ${disabled ? 'disabled' : ''}
        >
          <option value="" disabled selected>${placeholder}</option>
          ${this.innerHTML}
        </select>
      </div>
    `;

    this.shadowRoot.innerHTML = `
      <style>${estilos}</style>
      ${contenido}
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const select = this.shadowRoot.querySelector('select');
    
    select.addEventListener('change', (e) => {
      this.dispatchEvent(new CustomEvent('cselect-change', {
        detail: {
          value: e.target.value,
          name: e.target.name
        },
        bubbles: true,
        composed: true
      }));
    });

    select.addEventListener('focus', () => {
      this.dispatchEvent(new CustomEvent('cselect-focus', {
        bubbles: true,
        composed: true
      }));
    });

    select.addEventListener('blur', () => {
      this.dispatchEvent(new CustomEvent('cselect-blur', {
        bubbles: true,
        composed: true
      }));
    });

    this.addEventListener('cselect-reset', () => {
      this.reset();
    });
  }

  reset() {
    const select = this.shadowRoot.querySelector('select');
    if (select) {
      select.value = '';
      this.dispatchEvent(new CustomEvent('cselect-change', {
        detail: {
          value: '',
          name: select.name
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  getValue() {
    const select = this.shadowRoot.querySelector('select');
    return select ? select.value : '';
  }

  setValue(value) {
    const select = this.shadowRoot.querySelector('select');
    if (select) {
      select.value = value;
      this.dispatchEvent(new CustomEvent('cselect-change', {
        detail: {
          value: value,
          name: select.name
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  generarPaleta(color) {
    const paleta = {
      primario: color,
      label: darken(color, 0.2),
      surface: lighten(color, 0.7),
    };
    return paleta;
  }
}

customElements.define("select-canela", SelectCanela);