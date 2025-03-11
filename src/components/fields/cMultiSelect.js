class MultiSelectCanela extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.selectedValues = new Set();
  }

  connectedCallback() {
    this.render();
    this.setupFormIntegration();
  }

  setupFormIntegration() {
    const form = this.closest('form');
    if (form) {
        const name = this.getAttribute('name');
        
        // Create hidden inputs for each selected value
        this.addEventListener('value-cambiado', (e) => {
            // Remove existing hidden inputs
            this.querySelectorAll(`input[name="${name}[]"]`).forEach(input => input.remove());
            
            // Create new hidden inputs for each value
            this.selectedValues.forEach(value => {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = `${name}[]`;
                hiddenInput.value = value;
                this.appendChild(hiddenInput);
            });
        });
    }
}

  render() {
    const name = this.getAttribute("name") || "";
    const label = this.getAttribute("label") || "";
    const required = this.hasAttribute("required");
    const disabled = this.hasAttribute("disabled");
    const colorBase = this.getAttribute("color-base") || "#e3342f";
    const width = this.getAttribute("width") || "100%";
    const basis = this.getAttribute("basis") || "auto";
    const placeholder = this.getAttribute("placeholder") || "Select options";

    let estilos = `
      :host {
        display: inline-block;
        width: ${width};
        flex: ${basis};
      }

      .multiselect-container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        position: relative;
      }

      label {
        font-size: 14px;
        color: #374151;
      }

      .multiselect-trigger {
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
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .multiselect-trigger:focus {
        border-color: ${colorBase};
        box-shadow: 0 0 0 2px ${this.ajustarOpacidad(colorBase, 0.2)};
      }

      .options-container {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        margin-top: 4px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .options-container.show {
        display: block;
      }

      .option {
        padding: 8px 12px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .option:hover {
        background-color: ${this.ajustarOpacidad(colorBase, 0.1)};
      }

      .option.selected {
        background-color: ${this.ajustarOpacidad(colorBase, 0.2)};
      }

      .option-checkbox {
        width: 16px;
        height: 16px;
        border: 2px solid #d1d5db;
        border-radius: 4px;
        display: inline-block;
      }

      .option.selected .option-checkbox {
        background-color: ${colorBase};
        border-color: ${colorBase};
        position: relative;
      }

      .option.selected .option-checkbox::after {
        content: '';
        position: absolute;
        left: 5px;
        top: 2px;
        width: 4px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }

      .selected-count {
        background-color: ${colorBase};
        color: white;
        padding: 2px 6px;
        border-radius: 12px;
        font-size: 12px;
        margin-left: 8px;
      }
    `;

    const contenido = `
      <div class="multiselect-container">
        ${label ? `<label>${label}</label>` : ''}
        <div class="multiselect-trigger">
          <span class="placeholder">${placeholder}</span>
          <span class="selected-count" style="display: none">0</span>
        </div>
        <div class="options-container">
          ${this.processOptions()}
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = `
      <style>${estilos}</style>
      ${contenido}
    `;

    this.setupEventListeners();
  }

  processOptions() {
    const options = Array.from(this.children);
    return options.map(option => `
      <div class="option" data-value="${option.value}">
        <span class="option-checkbox"></span>
        <span class="option-text">${option.textContent}</span>
      </div>
    `).join('');
  }

  setupEventListeners() {
    const trigger = this.shadowRoot.querySelector('.multiselect-trigger');
    const optionsContainer = this.shadowRoot.querySelector('.options-container');
    const options = this.shadowRoot.querySelectorAll('.option');
    const selectedCount = this.shadowRoot.querySelector('.selected-count');
    const placeholder = this.shadowRoot.querySelector('.placeholder');

    trigger.addEventListener('click', () => {
      optionsContainer.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        optionsContainer.classList.remove('show');
      }
    });

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        const value = option.dataset.value;
        if (this.selectedValues.has(value)) {
          this.selectedValues.delete(value);
          option.classList.remove('selected');
        } else {
          this.selectedValues.add(value);
          option.classList.add('selected');
        }

        const count = this.selectedValues.size;
        selectedCount.textContent = count;
        selectedCount.style.display = count > 0 ? 'inline-block' : 'none';
        placeholder.textContent = count > 0 ? `${count} selected` : this.getAttribute("placeholder");

        this.dispatchEvent(new CustomEvent('value-cambiado', {
          detail: {
            values: Array.from(this.selectedValues),
            name: this.getAttribute('name')
          },
          bubbles: true,
          composed: true
        }));
      });
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

customElements.define("multiselect-canela", MultiSelectCanela);