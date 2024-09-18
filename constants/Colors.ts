const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";
const dark = "#363E51";
const dark1 = "#181C24";
export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    linearBg: `linear-gradient(${dark}, ${dark1})`,
  },
};
