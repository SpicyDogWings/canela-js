// Individual component exports
export { SelectCanela } from './components/selects/cSelect.js';
export { DatePickerCanela } from './components/fields/cDatePicker.js';
export { ButtonCanela } from './components/buttons/cButton.js';
export { ToastCanela } from './components/toasts/cToast.js';
export { TooltipCanela } from './components/tooltips/cTooltip.js';

// Auto-registration function
export function registerAll() {
  customElements.define('select-canela', SelectCanela);
  customElements.define('datepicker-canela', DatePickerCanela);
  customElements.define('boton-canela', ButtonCanela);
  customElements.define('toast-canela', ToastCanela);
  customElements.define('tooltip-canela', TooltipCanela);
}