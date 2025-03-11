import { lighten, darken, mix, transparentize } from "color2k";

export const generateTheme = (color) => {
  const primario = color;
  const secundario = lighten(color, 0.5);
  const surface = lighten(color, 0.7);
  const text = darken(color, 0.3);

  const successBase = mix(color, "#00A86B", 0.3);
  const success = {
    main: successBase,
    light: lighten(successBase, 0.3),
    dark: darken(successBase, 0.2),
    shadow: transparentize(successBase, 0.75)
  };

  const errorBase = mix(color, "#FF3B30", 0.3);
  const error = {
    main: errorBase,
    light: lighten(errorBase, 0.3),
    dark: darken(errorBase, 0.2),
    shadow: transparentize(errorBase, 0.75)
  };

  const warningBase = mix(color, "#FFA000", 0.4);
  const warning = {
    main: warningBase,
    light: lighten(warningBase, 0.3),
    dark: darken(warningBase, 0.2),
    shadow: transparentize(warningBase, 0.75)
  };

  return {
    primario,
    primarioShadow: transparentize(primario, 0.75),
    secundario,
    secundarioShadow: transparentize(secundario, 0.75),
    surface,
    text,
    success,
    error,
    warning
  };
};