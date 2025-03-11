import { SelectCanela as SelectCanela2 } from "./index.es2.js";
import { DatePickerCanela as DatePickerCanela2 } from "./index.es3.js";
import { ButtonCanela as ButtonCanela2 } from "./index.es4.js";
import { ToastCanela as ToastCanela2 } from "./index.es5.js";
import { TooltipCanela as TooltipCanela2 } from "./index.es6.js";
function registerAll() {
  customElements.define("select-canela", SelectCanela);
  customElements.define("datepicker-canela", DatePickerCanela);
  customElements.define("boton-canela", ButtonCanela);
  customElements.define("toast-canela", ToastCanela);
  customElements.define("tooltip-canela", TooltipCanela);
}
export {
  ButtonCanela2 as ButtonCanela,
  DatePickerCanela2 as DatePickerCanela,
  SelectCanela2 as SelectCanela,
  ToastCanela2 as ToastCanela,
  TooltipCanela2 as TooltipCanela,
  registerAll
};
//# sourceMappingURL=index.es.js.map
