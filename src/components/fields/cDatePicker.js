import { generateTheme } from '../../utils/theme.js';
import { createElement, Calendar, MoveLeft, MoveRight } from 'lucide';
import '../tooltips/cTooltip.js';  // Add this import

class DatePickerCanela extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
    this.selectedDate = null;
    this.currentMonth = new Date();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ['name', 'label', 'required', 'disabled', 'color', 'width', 'placeholder', 'tooltip', 'tooltip-position'];
  }

  render() {
    const name = this.getAttribute("name") || "";
    const label = this.getAttribute("label") || "";
    const required = this.hasAttribute("required");
    const disabled = this.hasAttribute("disabled");
    const color = this.getAttribute("color") || "#205781";
    const width = this.getAttribute("width") || "100%";
    const placeholder = this.getAttribute("placeholder") || "Seleccione una fecha";
    const redondeado = this.getAttribute("redondeado") || "normal";
    const tooltip = this.getAttribute("tooltip") || ""; // Add tooltip attribute
    const tooltipPosition = this.getAttribute("tooltip-position") || "top"; // Add tooltip position
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

    let estilos = `
      :host {
        display: inline-block;
        width: ${width};
        position: relative;
      }

      .datepicker-container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
      }

      label {
        font-size: 14px;
        color: ${paleta.text};
      }

      .trigger {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: ${borderRadius};
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

      .trigger:focus {
        border-color: ${paleta.primario};
        box-shadow: 0 0 0 2px ${paleta.secundario};
      }

      .trigger:required {
        border-left: 3px solid ${paleta.primario};
      }

      .calendar {
        position: absolute;
        top: 100%;
        left: 0;
        width: 280px;
        background: white;
        border: 1px solid #d1d5db;
        border-radius: ${borderRadius1};
        margin-top: 4px;
        padding: 16px;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .calendar.open {
        display: block;
      }

      .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .month-nav {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: ${paleta.text};
      }

      .month-nav:hover {
        color: ${paleta.primario};
      }

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
        text-align: center;
      }

      .weekday {
        font-size: 12px;
        color: ${paleta.text};
        padding: 4px;
      }

      .day {
        padding: 8px;
        border: none;
        background: none;
        cursor: pointer;
        border-radius: ${borderRadius2};
        color: ${paleta.text};
      }

      .day:hover {
        background-color: ${paleta.secundario};
        color: ${paleta.primario};
      }

      .day.selected {
        background-color: ${paleta.primario};
        color: white;
      }

      .day.today {
        font-weight: bold;
        color: ${paleta.primario};
      }

      .day.other-month {
        color: #9ca3af;
      }
      .calendar-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .calendar-icon:hover {
        opacity: 1;
      }

      .calendar-icon svg {
        width: 1.5rem;
        height: 1.5rem;
      }
    `;

    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const monthYear = this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    const contenido = `
      <div class="datepicker-container">
        ${label ? `
          ${tooltip ? `
            <tooltip-canela content="${tooltip}" position="${tooltipPosition}" color="${color}" delay="1000">
              <label for="date-${name}">${label}</label>
            </tooltip-canela>
          ` : `
            <label for="date-${name}">${label}</label>
          `}
        ` : ''}
        <button type="button" class="trigger" id="date-${name}" ${required ? 'required' : ''}>
          <span class="selected-date">${this.selectedDate || placeholder}</span>
          <span class="calendar-icon"></span>
        </button>
        <div class="calendar">
          <div class="calendar-header">
            <button type="button" class="month-nav prev"></button>
            <span class="current-month">${monthYear}</span>
            <button type="button" class="month-nav next"></button>
          </div>
          <div class="calendar-grid">
            ${weekdays.map(day => `<div class="weekday">${day}</div>`).join('')}
            ${this.generateDaysGrid()}
          </div>
        </div>
        <input type="hidden" name="${name}" value="${this.selectedDate || ''}">
      </div>
    `;

    this.shadowRoot.innerHTML = `
      <style>${estilos}</style>
      ${contenido}
    `;

    // Calendar icon
    const calendarIcon = createElement(Calendar, {
      'stroke-width': 2,
      stroke: 'currentColor',
      width: 16,
      height: 16
    });

    // Navigation icons
    const prevIcon = createElement(MoveLeft, {
      'stroke-width': 2,
      stroke: 'currentColor',
      width: 16,
      height: 16
    });

    const nextIcon = createElement(MoveRight, {
      'stroke-width': 2,
      stroke: 'currentColor',
      width: 16,
      height: 16
    });

    const iconSlot = this.shadowRoot.querySelector('.calendar-icon');
    const prevButton = this.shadowRoot.querySelector('.month-nav.prev');
    const nextButton = this.shadowRoot.querySelector('.month-nav.next');

    iconSlot.appendChild(calendarIcon);
    prevButton.appendChild(prevIcon);
    nextButton.appendChild(nextIcon);
  }

  generateDaysGrid() {
    const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    const startPadding = firstDay.getDay();
    const endPadding = 6 - lastDay.getDay();

    const prevMonth = new Date(this.currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthLastDay = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();

    const days = [];

    for (let i = startPadding - 1; i >= 0; i--) {
      days.push(`<button type="button" class="day other-month" data-date="${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-${String(prevMonthLastDay - i).padStart(2, '0')}">${prevMonthLastDay - i}</button>`);
    }

    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const isToday = today.getDate() === i &&
        today.getMonth() === this.currentMonth.getMonth() &&
        today.getFullYear() === this.currentMonth.getFullYear();
      const isSelected = this.selectedDate === `${this.currentMonth.getFullYear()}-${String(this.currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push(`<button type="button" class="day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-date="${this.currentMonth.getFullYear()}-${String(this.currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}">${i}</button>`);
    }

    const nextMonth = new Date(this.currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    for (let i = 1; i <= endPadding; i++) {
      days.push(`<button type="button" class="day other-month" data-date="${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}">${i}</button>`);
    }

    return days.join('');
  }

  isValid() {
    const isRequired = this.hasAttribute('required');
    if (!isRequired) return true;

    const value = this.getValue();
    return value !== null && value !== undefined && value.trim() !== '';
  }

  setValid() {
    const trigger = this.shadowRoot.querySelector('.trigger');
    trigger.style.borderColor = '';
    trigger.style.boxShadow = '';
  }

setInvalid() {
  const trigger = this.shadowRoot.querySelector('.trigger');
  const color = this.getAttribute('color') || "#205781";
  const paleta = generateTheme(color);
  trigger.style.borderColor = paleta.error.light;
  trigger.style.boxShadow = `0 0 0 1px ${paleta.error.light}`;
}

  setupEventListeners() {
    const trigger = this.shadowRoot.querySelector('.trigger');
    const calendar = this.shadowRoot.querySelector('.calendar');
    const prevButton = this.shadowRoot.querySelector('.prev');
    const nextButton = this.shadowRoot.querySelector('.next');
    const days = this.shadowRoot.querySelectorAll('.day');
    const hiddenInput = this.shadowRoot.querySelector('input[type="hidden"]');

    trigger?.removeEventListener('click', this.handleTriggerClick);
    prevButton?.removeEventListener('click', this.handlePrevClick);
    nextButton?.removeEventListener('click', this.handleNextClick);

    this.handleTriggerClick = () => {
      this.isOpen = !this.isOpen;
      calendar.classList.toggle('open', this.isOpen);
    };

    this.handlePrevClick = () => {
      this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
      this.updateCalendar();
    };

    this.handleNextClick = () => {
      this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
      this.updateCalendar();
    };

    trigger.addEventListener('click', this.handleTriggerClick);
    prevButton.addEventListener('click', this.handlePrevClick);
    nextButton.addEventListener('click', this.handleNextClick);

    days.forEach(day => {
      day.addEventListener('click', () => {
        const dateString = day.dataset.date;
        const [year, month, dayNum] = dateString.split('-');
        const selectedDate = new Date(year, parseInt(month) - 1, dayNum);

        this.selectedDate = dateString;
        hiddenInput.value = dateString;
        // Change the date format here
        trigger.querySelector('.selected-date').textContent = selectedDate.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        this.isOpen = false;
        calendar.classList.remove('open');
        this.updateCalendar();

        this.setValid();

        this.dispatchEvent(new CustomEvent('value-cambiado', {
          detail: {
            value: dateString,
            name: this.getAttribute('name')
          },
          bubbles: true,
          composed: true
        }));
      });
    });

    if (!this.hasOutsideClickHandler) {
      document.addEventListener('click', (e) => {
        if (!this.contains(e.target)) {
          this.isOpen = false;
          calendar.classList.remove('open');
        }
      });
      this.hasOutsideClickHandler = true;
    }
  }

  updateCalendar() {
    const calendar = this.shadowRoot.querySelector('.calendar');
    const monthYear = this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    this.shadowRoot.querySelector('.current-month').textContent = monthYear;
    this.shadowRoot.querySelector('.calendar-grid').innerHTML =
      ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        .map(day => `<div class="weekday">${day}</div>`)
        .join('') +
      this.generateDaysGrid();

    this.setupEventListeners();
  }

  getValue() {
    const hiddenInput = this.shadowRoot.querySelector('input[type="hidden"]');
    return hiddenInput ? hiddenInput.value : '';
  }

  setValue(value) {
    const hiddenInput = this.shadowRoot.querySelector('input[type="hidden"]');
    const trigger = this.shadowRoot.querySelector('.trigger');

    if (hiddenInput && trigger) {
      this.selectedDate = value;
      hiddenInput.value = value;

      if (value) {
        const [year, month, day] = value.split('-');
        const date = new Date(year, parseInt(month) - 1, day);
        // Change the date format here
        trigger.querySelector('.selected-date').textContent = date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } else {
        trigger.querySelector('.selected-date').textContent = this.getAttribute("placeholder") || "Select date...";
      }

      this.dispatchEvent(new CustomEvent('value-cambiado', {
        detail: {
          value: value,
          name: this.getAttribute('name')
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  reset() {
    this.selectedDate = null;
    const trigger = this.shadowRoot.querySelector('.trigger');
    const hiddenInput = this.shadowRoot.querySelector('input[type="hidden"]');

    if (trigger && hiddenInput) {
      hiddenInput.value = '';
      trigger.querySelector('.selected-date').textContent = this.getAttribute("placeholder") || "Seleccione una fecha";
    }

    this.setValid();

    this.dispatchEvent(new CustomEvent('value-cambiado', {
      detail: {
        value: '',
        name: this.getAttribute('name')
      },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('datepicker-canela', DatePickerCanela);

export { DatePickerCanela };