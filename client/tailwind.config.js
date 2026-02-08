/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js", // Added Flowbite source path
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#00f6ff",
        primaryText: "#111827",
        secondaryText: "#6b7280",
        white: "#ffffff",
        blue500: "#3b82f6",
        blue700: "#1d4ed8",
        black: "#000000",
        yellow500: "#eab308",
        green600: "#16a34a",
        gray900: "#111827",
        red600: "#dc2626",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",

        infoText: "#B27CFF",

        primaryFill: "rgba(19, 13, 26, 0.64)",
        secondaryFill: "rgba(255, 255, 255, 0.08)",
        secondaryFillLight: "rgba(255, 255, 255, 0.16)",
        secondaryFillDim: "rgba(255, 255, 255, 0.64)",
        attentionFill: "rgba(255, 178, 55, 0.12)",
        attentionText: "#FFB237",
        infoFill: "rgba(255, 255, 255, 0.08)",

        warningFill: "rgba(255, 92, 92, 0.16)",
        warningText: "#FF5C5C",
        hoverLight: "rgba(255, 255, 255, 0.16)",
        buttonGradient:
          "radial-gradient(59.21% 78.44% at 50% 50%, #5A38A3 0%, #683FAB 31.77%, #9D52FF 68.23%, #EDBCFC 96.35%)",
        darkslategray: {
          100: "#404b51",
          200: "#394247",
          300: "#323a40",
          400: "#2c3033",
        },
        black: "#000",
        lightslategray: {
          100: "rgba(128, 163, 182, 0.08)",
          200: "rgba(128, 163, 182, 0.1)",
          300: "rgba(128, 163, 182, 0.22)",
        },
        mediumseagreen: {
          // "100": "#00b67a",
          // "200": "#0c9c5a",
          100: "#818cf8", // tailwind bg-blue-400
          200: "#4f46e5", // tailwind bg-indigo-600
        },
        honeydew: "#e7faf2",
        gainsboro: {
          100: "#e6e6e6",
          200: "#dfe4e8",
        },
        // mediumspringgreen: '#10d078',
        mediumspringgreen: "#4f46e5", // tailwind bg-indigo-600
        blueviolet: "#5f41ff",
        whitesmoke: {
          100: "#f6f7f8",
          200: "#f0f1f1",
          300: "#ecf1f4",
        },
        limegreen: "#4f46e5", // tailwind bg-indigo-600
        slategray: "#557f96",
        darkslateblue: "#3c5a9f",
        overlayBlack: "rgba(82, 82, 122, 0.20)",
        hoverLight: "#2f2f45",
        bgLight: "#2f2f45",
        hoverDark: "#2f2f45",
        bgDark: "#27273F",
        bgDarkOutline: "#141421",
        bgDarker: "#1b1b2b",
        //================={new}=====================
        mediumslateblue: "#605dec",
        "grey-100": "#27273f",
        "grey-200": "#111827",
        "grey-300": "#a1b0cd",
        "grey-400": "#7b8db0",
        "grey-600": "#6e7491",
        mediumblue: "#2a26d9",
        lavender: "#cbd4e6",
        silver: "#bbb",
        "button-dark": "#363642",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        "body-large": "'Nunito Sans'",
        roboto: "Roboto",
      },
    },
    // fontSize: {
    //   lg: '18px',
    //   base: '16px',
    //   inherit: 'inherit',
    // },
    // screens: {
    //   xs: '480px',
    //   ss: '620px',
    //   sm: '768px',
    //   md: '1060px',
    //   lg: '1200px',
    //   xl: '1700px',
    // },
    //latest use case
    // screens: {
    //   xs: '480px',
    //   ss: '620px',
    //   sm: '960px',
    //   md: '1440px',
    //   lg: '1920px',
    //   xl: '2560px',
    //   '2xl': '4560px',
    // },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require("flowbite/plugin"), // Added Flowbite plugin
  ],
};
