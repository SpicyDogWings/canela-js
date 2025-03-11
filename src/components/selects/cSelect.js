import { generateTheme } from '../../utils/theme.js';
import { createElement, ChevronDown } from 'lucide';
import '../tooltips/cTooltip.js';  // Add this import

class SelectCanela extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._value = null;
  }

  static get observedAttributes() {
    return ['placeholder', 'options', 'color', 'label'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    let options = [];
    try {
      const optionsAttr = this.getAttribute('options');
      options = optionsAttr ? JSON.parse(optionsAttr) : [];

      const selectedOption = options.find(opt => opt.selected);
      if (selectedOption) {
        this._value = selectedOption.value;
      }

    } catch (e) {
      console.error('Error parsing options:', e);
      options = [];
    }

    const placeholder = this.getAttribute('placeholder') || 'Select an option...';
    const color = this.getAttribute('color') || "#205781";
    const label = this.getAttribute('label') || '';
    const name = this.getAttribute('name') || '';
    const redondeado = this.getAttribute("redondeado") || "normal";
    const tooltip = this.getAttribute("tooltip") || ""; // Add tooltip attribute
    const tooltipPosition = this.getAttribute("tooltip-position") || "top"; // Add tooltip position attribute
    const paleta = generateTheme(color);

    let borderRadius;
    let borderRadius1;
    let borderRadius2;
    switch (redondeado) {
      case "none":
        borderRadius = "0";
        borderRadius1 = borderRadius;
        borderRadius2 = borderRadius;
        break;
      case "pequenno":
        borderRadius = "5px";
        borderRadius1 = "3px";
        borderRadius2 = borderRadius1;
        break;
      case "mediado":
        borderRadius = "20px";
        borderRadius1 = "15px";
        borderRadius2 = "10px";
        break;
      case "full":
        borderRadius = "50px";
        borderRadius1 = "30px";
        borderRadius2 = "30px";
        break;
      default:
        borderRadius = "10px";
        borderRadius1 = "5px";
        borderRadius2 = "5px";
        break;
    }

    const styles = `
      :host {
          display: inline-block;
          position: relative;
          width: 100%;
      }

      .select-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
      }

      label {
          font-size: 14px;
          color: #374151;
      }

      .trigger {
          width: 100%;
          padding: 2px 12px;
          border: 1px solid #d1d5db;
          border-radius: ${borderRadius};
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
          background-color: white;
          cursor: pointer;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          height: 40px;
          gap: 8px;
      }

      .value {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
      }

      .drop-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
      }
          padding-right: 20px;
          position: relative;
          max-width: calc(100% - 30px);
      }

      .value::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 30px;
          background: linear-gradient(to right, transparent, white);
      }

      .drop-icon {
          flex-shrink: 0;
          margin-left: auto;
      }
      .trigger:focus {
          border-color: ${paleta.primario};
          box-shadow: 0 0 0 2px ${paleta.secundario};
      }

      .trigger:required {
          border-left: 3px solid ${paleta.primario};
      }
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2px 8px;
          min-height: 35px;
          border: 1px solid #d1d5db;
          border-radius: ${borderRadius};
          background: transparent;
          cursor: pointer;
          color: ${paleta.text};
          transition: all 0.3s ease;
      }

      .trigger:hover {
          background: ${paleta.secundario};
          color: ${paleta.primario};
      }

      .select-content {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: white;
          border: 1px solid ${paleta.secundario};
          border-radius: ${borderRadius1};
          margin-top: 5px;
          padding: 8px 0;
          display: none;
          z-index: 1000;
      }

      .select-content.open {
          display: block;
          padding: 0.5rem;
      }
                    
      .drop-icon {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 4px;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .drop-icon:hover {
        opacity: 1;
      }

      .drop-icon svg {
        transform: translate(7px, 3px);
        width: 1.5rem;
        height: 1.5rem;
      }

      .option {
          padding: 0.4rem 0.7rem;
          margin: 0.2rem 0;
          cursor: pointer;
          border-radius: ${borderRadius2};
          transition: all 0.3s ease;
          color: ${paleta.primario};
      }

      .option:hover {
          background: ${paleta.secundario};
          color: ${paleta.primario};
          opacity: 0.8;
      }

      .option.selected {
          background: ${paleta.primario};
          color: ${paleta.surface};
          font-weight: 500;
      }
      .option-message {
          padding: 0.5rem;
          color: #6B7280;
          text-align: center;
          font-style: italic;
      }
    `;

    const contenido = `
      <div class="select-container">
          ${label ? `
            ${tooltip ? `
              <tooltip-canela content="${tooltip}" position="${tooltipPosition}" color="${color}" delay="1000">
                <label for="select-${name}">${label}</label>
              </tooltip-canela>
            ` : `
              <label for="select-${name}">${label}</label>
            `}
          ` : ''}
          <div class="trigger" id="select-${name}">
              <span class="value">${this._value ? options.find(opt => opt.value === this._value)?.label : placeholder}</span>
              <span class="drop-icon"></span>
          </div>
          <div class="select-content">
              ${Array.isArray(options) && options.length > 0
        ? options.map(option => `
                    <div class="option ${option.selected ? 'selected' : ''}" 
                         data-value="${option.value || ''}" 
                         data-label="${option.label || ''}">
                        ${option.label || ''}
                    </div>
                  `).join('')
        : `<div class="option-message">No hay opciones disponibles</div>`
      }
          </div>
      </div>
    `
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      ${contenido}
    `;


    const dropIcon = createElement(ChevronDown, {
      'stroke-width': 2,
      stroke: 'currentColor',
      width: 16,
      height: 16
    });

    const dropSlot = this.shadowRoot.querySelector('.drop-icon');
    dropSlot.appendChild(dropIcon);
  }

  setupEventListeners() {
    const trigger = this.shadowRoot.querySelector('.trigger');
    const content = this.shadowRoot.querySelector('.select-content');
    const valueSpan = this.shadowRoot.querySelector('.value');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      
      document.querySelectorAll('select-canela').forEach(select => {
        if (select !== this) {
          select.shadowRoot.querySelector('.select-content').classList.remove('open');
        }
      });
      
      content.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        content.classList.remove('open');
      }
    });

    this.shadowRoot.querySelectorAll('.option').forEach(option => {
      option.addEventListener('click', (e) => {
        const value = e.target.dataset.value;
        const label = e.target.textContent.trim();

        valueSpan.textContent = label;
        this._value = value;

        this.shadowRoot.querySelectorAll('.option').forEach(opt => {
          opt.classList.remove('selected');
        });
        e.target.classList.add('selected');

        content.classList.remove('open');
        this.setValid();

        this.dispatchEvent(new CustomEvent('change', {
          detail: { value, label },
          bubbles: true
        }));
      });
    });
  }

  getValue() {
    return this._value;
  }

  setValue(value) {
    const option = this.shadowRoot.querySelector(`.option[data-value="${value}"]`);
    if (option) {
      option.click();
    }
  }

  attributeChangedCallback() {
    this.render();
  }

  setInvalid() {
    const trigger = this.shadowRoot.querySelector('.trigger');
    const paleta = generateTheme(this.getAttribute('color') || "#205781");
    trigger.style.borderColor = paleta.error;
    trigger.style.boxShadow = `0 0 0 1px ${paleta.error}`;
  }

  setValid() {
    const trigger = this.shadowRoot.querySelector('.trigger');
    trigger.style.borderColor = '';
    trigger.style.boxShadow = '';
  }

  isValid() {
    const isRequired = this.hasAttribute('required');
    if (!isRequired) return true;

    return this._value !== null && this._value !== undefined && this._value !== '';
  }

  setInvalid() {
    const trigger = this.shadowRoot.querySelector('.trigger');
    const paleta = generateTheme(this.getAttribute('color') || "#205781");
    trigger.style.borderColor = paleta.error.light;
    trigger.style.boxShadow = `0 0 0 1px ${paleta.error.light}`;
  }

  reset() {
    this._value = null;
    const valueSpan = this.shadowRoot.querySelector('.value');
    const placeholder = this.getAttribute('placeholder') || 'Select an option...';
    valueSpan.textContent = placeholder;

    this.shadowRoot.querySelectorAll('.option').forEach(opt => {
      opt.classList.remove('selected');
    });

    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: null, label: placeholder },
      bubbles: true
    }));

    const trigger = this.shadowRoot.querySelector('.trigger');
    trigger.style.borderColor = '';
    trigger.style.boxShadow = '';
  }
}

customElements.define('select-canela', SelectCanela);

export { SelectCanela };