class CampoCanela extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const type = this.getAttribute("type") || "text";
    const placeholder = this.getAttribute("placeholder") || "";
    const value = this.getAttribute("value") || "";
    const name = this.getAttribute("name") || "";
    const required = this.hasAttribute("required");
    const disabled = this.hasAttribute("disabled");
    const colorBase = this.getAttribute("color-base") || "#e3342f";
    const label = this.getAttribute("label") || "";
    const width = this.getAttribute("width") || "100%";

    let estilos = `
      :host {
        display: inline-block;
        width: ${width};
      }

      .campo-container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
      }

      label {
        font-size: 14px;
        color: #374151;
      }

      input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 16px;
        outline: none;
        transition: all 0.3s ease;
        box-sizing: border-box;
      }

      input:focus {
        border-color: ${colorBase};
        box-shadow: 0 0 0 2px ${this.ajustarOpacidad(colorBase, 0.2)};
      }

      input:disabled {
        background-color: #f3f4f6;
        cursor: not-allowed;
      }

      input::placeholder {
        color: #9ca3af;
      }

      input:required {
        border-left: 3px solid ${colorBase};
      }
    `;

    const contenido = `
      <div class="campo-container">
        ${label ? `<label for="input-${name}">${label}</label>` : ''}
        <input
          type="${type}"
          label="input-${name}"
          name="${name}"
          placeholder="${placeholder}"
          value="${value}"
          ${required ? 'required' : ''}
          ${disabled ? 'disabled' : ''}
        >
        <slot></slot>
      </div>
    `;

    this.shadowRoot.innerHTML = `
      <style>${estilos}</style>
      ${contenido}
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const input = this.shadowRoot.querySelector('input');
    
    input.addEventListener('input', (e) => {
      this.dispatchEvent(new CustomEvent('value-cambiado', {
        detail: {
          value: e.target.value,
          name: e.target.name
        },
        bubbles: true,
        composed: true
      }));
    });

    input.addEventListener('focus', () => {
      this.dispatchEvent(new CustomEvent('campo-focus', {
        bubbles: true,
        composed: true
      }));
    });

    input.addEventListener('blur', () => {
      this.dispatchEvent(new CustomEvent('campo-blur', {
        bubbles: true,
        composed: true
      }));
    });
  }

  ajustarOpacidad(color, opacity) {
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  }
}

customElements.define("campo-canela", CampoCanela);