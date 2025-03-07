class BotonCanela extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const variante = this.getAttribute("variante") || "normal";
    const icono = this.getAttribute("icono");
    const redondeado = this.getAttribute("redondeado") || "normal";
    const colorBase = this.getAttribute("color-base") || "#e3342f";
    const href = this.getAttribute("href"); // Nuevo atributo
    const alt = this.getAttribute("alt"); // Nuevo atributo

    const paleta = this.generarPaleta(colorBase);

    let estilos = `
      button, a {
        padding: 10px 20px;
        border: none;
        cursor: pointer;
        font-size: 16px;
        text-decoration: none;
      }

      button:hover, a:hover {
        opacity: 0.8;
      }
    `;

    let contenido = "";

    if (variante === "link" && href) {
      contenido = `<a href="${href}" ${alt ? `alt="${alt}"` : ""}>`;
    } else {
      contenido = `<button>`;
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
      case "primario":
        estilos += `button, a { background-color: ${paleta.primario}; color: white; }`;
        break;
      case "secundario":
        estilos += `button, a { background-color: ${paleta.secundario}; color: white; }`;
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
        estilos += `button, a { background-color: ${paleta.primario}; color: white; }`;
        break;
    }

    switch (redondeado) {
      case "pequeno":
        estilos += `button, a { border-radius: 3px; }`;
        break;
      case "mediano":
        estilos += `button, a { border-radius: 8px; }`;
        break;
      case "grande":
        estilos += `button, a { border-radius: 20px; }`;
        break;
      case "completo":
        estilos += `button, a { border-radius: 50px; }`;
        break;
      default:
        estilos += `button, a { border-radius: 5px; }`;
        break;
    }

    this.shadowRoot.innerHTML = `
      <style>${estilos}</style>
      ${contenido}
    `;
  }

  generarPaleta(colorBase) {
    // Función para generar una paleta de colores a partir del color base
    // (Aquí puedes usar una librería de manipulación de colores o crear tu propia lógica)
    // Este es un ejemplo simple:
    const paleta = {
      primario: colorBase,
      secundario: this.ajustarBrillo(colorBase, 40), // Aclara el color base
    };
    return paleta;
  }

  ajustarBrillo(color, porcentaje) {
    // Función para ajustar el brillo de un color hexadecimal
    // (Puedes usar una librería o crear tu propia lógica)
    // Este es un ejemplo simple:
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.min(255, Math.max(0, Math.round(r + (255 * porcentaje) / 100)));
    g = Math.min(255, Math.max(0, Math.round(g + (255 * porcentaje) / 100)));
    b = Math.min(255, Math.max(0, Math.round(b + (255 * porcentaje) / 100)));

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
}

customElements.define("boton-canela", BotonCanela);
