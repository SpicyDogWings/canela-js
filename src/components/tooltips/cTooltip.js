import { generateTheme } from '../../utils/theme.js';

class TooltipCanela extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ['content', 'position', 'color', 'delay'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const position = this.getAttribute("position") || "top";
    const color = this.getAttribute("color") || "#205781";
    const content = this.getAttribute("content") || "";
    const redondeado = this.getAttribute("redondeado") || "normal";
    const delay = this.getAttribute("delay") || "1000";
    const paleta = generateTheme(color);

    let borderRadius;
    switch (redondeado) {
      case "none": borderRadius = "0"; break;
      case "pequenno": borderRadius = "3px"; break;
      case "mediado": borderRadius = "15px"; break;
      case "full": borderRadius = "30px"; break;
      default: borderRadius = "5px";
    }

    const styles = `
      :host {
        display: inline-block;
        position: relative;
      }

      .tooltip-trigger {
        display: inline-block;
      }

      .tooltip-content {
        position: absolute;
        background-color: ${paleta.primario};
        color: ${paleta.surface};
        padding: 8px 12px;
        border-radius: ${borderRadius};
        font-size: 14px;
        white-space: nowrap;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      /* Position styles */
      .tooltip-content[data-position="top"] {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
      }

      .tooltip-content[data-position="bottom"] {
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
      }

      .tooltip-content[data-position="left"] {
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
      }

      .tooltip-content[data-position="right"] {
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
      }

      /* Show tooltip on hover */
      :host(:hover) .tooltip-content {
        transition-delay: ${delay}ms;
        opacity: 1;
        visibility: visible;
      }

      /* Hide immediately when not hovering */
      :host(:not(:hover)) .tooltip-content {
        transition-delay: 0s;
      }
    `;

    const content_html = `
      <div class="tooltip-trigger">
        <slot></slot>
      </div>
      <div class="tooltip-content" data-position="${position}">
        ${content}
      </div>
    `;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      ${content_html}
    `;
  }
}

customElements.define('tooltip-canela', TooltipCanela);
export { TooltipCanela };
