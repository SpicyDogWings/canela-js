// Export individual components
export { SelectCanela } from './components/selects/cSelect.js';
export { DatePickerCanela } from './components/fields/cDatePicker.js';
export { ButtonCanela } from './components/buttons/cButton.js';
export { ToastCanela } from './components/toasts/cToast.js';
export { TooltipCanela } from './components/tooltips/cTooltip.js';

// Create a simple initialization function
export function initCanela(options = {}) {
  const components = {
    'select-canela': SelectCanela,
    'datepicker-canela': DatePickerCanela,
    'boton-canela': ButtonCanela,
    'toast-canela': ToastCanela,
    'tooltip-canela': TooltipCanela
  };

  // Register only specified components or all if none specified
  const toRegister = options.components || Object.keys(components);
  
  toRegister.forEach(name => {
    if (components[name] && !customElements.get(name)) {
      customElements.define(name, components[name]);
    }
  });
}