/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#fff',
        darkgray: {
          100: '#b4b4b4',
          200: '#9b9b9b',
          300: 'rgba(179, 180, 180, 0.7)',
        },
        gray: {
          // 100: '#f3f4f6', // tailwind
          100: '#f3f4f6', // chizzySnow
          // 100: "#fafafa",
          200: '#8e8e8e',
          300: '#222729',
          400: '#181c1f',
          500: '#6b7280', // tailwind
          // 500: "rgba(0, 0, 0, 0.6)",
          600: 'rgba(255, 255, 255, 0.38)',
          700: 'rgba(255, 255, 255, 0.75)',
          800: 'rgba(0, 0, 0, 0.87)',
          // 900: "rgba(255, 255, 255, 0.87)",
          900: '#111827', //tailwind
          1000: 'rgba(27, 27, 43, 0.5)',
        },
        darkslategray: {
          100: '#404b51',
          200: '#394247',
          300: '#323a40',
          400: '#2c3033',
        },
        black: '#000',
        lightslategray: {
          100: 'rgba(128, 163, 182, 0.08)',
          200: 'rgba(128, 163, 182, 0.1)',
          300: 'rgba(128, 163, 182, 0.22)',
          400: 'rgba(128, 163, 182, 0.2)',
        },
        mediumseagreen: {
          // "100": "#00b67a",
          // "200": "#0c9c5a",
          100: '#818cf8', // tailwind bg-blue-400
          200: '#4f46e5', // tailwind bg-indigo-600
        },
        honeydew: '#e7faf2',
        gainsboro: {
          100: '#e6e6e6',
          200: '#dfe4e8',
        },
        // bgPrimary: '#10d078',
        //==========={updates}=================================
        bgPrimary: '#4f46e5', // tailwind bg-indigo-600
        bgPrimaryHover: '#4338ca', // tailwind bg-indigo-700
        bgSecondary: '#f6f7f8',
        bgDarkMode: '#1b1b2b',
        blueviolet: '#5f41ff',
        border: '#9b9b9b',
        whitesmoke: {
          100: '#f6f7f8',
          200: '#f0f1f1',
          300: '#ecf1f4',
        },
        dimgray: {
          100: '#6a6969',
          200: '#4d585f',
        },
        tripmagray: {
          100: '#6E7491',
        },
        tripmaLight: 'rgb(255, 255, 255, 0.50)',
        tripmaDark: '#27273F',
        tomato: '#ff3b30',
        steelblue: '#1096d0',
        orange: '#ffb000',
        orangeLight: '#fbdea2',
        lakersyellow: '#facc15',
        oldlace: '#fff7e3',
        // limegreen: '#10d35e',
        limegreen: '#4f46e5', // tailwind bg-indigo-600
        slategray: '#557f96',
        darkslateblue: '#3c5a9f',
        overlayBlack: 'rgba(82, 82, 122, 0.20)',
        hoverLight: '#2f2f45',
        bgLight: '#2f2f45',
        hoverDark: '#2f2f45',
        bgDark: '#27273F',
        bgDarkOutline: '#141421',
        bgDarker: '#1b1b2b',
        primaryFill: 'rgba(19, 13, 26, 0.64)',
        secondaryFill: 'rgba(255, 255, 255, 0.08)',
        secondaryFillLight: 'rgba(255, 255, 255, 0.16)',
        secondaryFillDim: 'rgba(255, 255, 255, 0.64)',
        attentionFill: 'rgba(255, 178, 55, 0.12)',
        'surface-success-d': 'rgba(23, 241, 139, 0.12)',
        'surface-tint-64-d': 'rgba(255, 255, 255, 0.64)',
        primary: '#e11d48',
        'primary-foreground': '#f3f4f6',
        //======================={New}==================================
        silver: '#bbb',
        'text-light-main': '#1e1e1f',
        greenyellow: 'rgba(205, 255, 5, 0.1)',
        yellowgreen: '#a3cc00',
        lightsteelblue: 'rgba(199, 210, 254, 0.5)',
        darkblue: '#4338ca',
        //=============================================

        'background-dark': '#0b0b12',
        'app-container-dark': '#161621',
        'exchange-rate-dark': '#363642',
        'button-dark': 'rgba(54, 54, 66, 0.5)',
        chizzy: '#1b1b2b',
        chizzyblue: '#111827',
        'text-light': '#BBBBBB',
        chizzySnow: '#F9F8FE',
        chizzyRender: '#FBFCFE', // from onrender faint blue
        chizzyIcon: '#EB003C', //
        chizzyDetail: '#22C55E', //
        chizzyDarkLayer: '#212139', //
        buttonGradient:
          'radial-gradient(59.21% 78.44% at 50% 50%, #5A38A3 0%, #683FAB 31.77%, #9D52FF 68.23%, #EDBCFC 96.35%)',
      },
      spacing: {},
      fontFamily: {
        inter: ['inter', 'sans-serif'],
        'open-sans': "'Open Sans'",
        'material-icons': "'Material Icons'",
        roboto: 'Roboto',
        montserrat: 'Montserrat',
      },
      borderRadius: {
        '21xl': '40px',
      },
    },
    fontSize: {
      '4xs': '9px',
      sm: '14px',
      smi: '13px',
      '5xs': '8px',
      xl: '20px',
      '5xl': '24px',
      base: '16px',
      '2xs': '11px',
      xs: '12px',
      '3xs': '10px',
      mid: '17px',
      mini: '15px',
      lg: '18px',
      '9xl': '28px',
      '11xl': '30px',
      '13xl': '32px',
      '27xl': '46px',
      inherit: 'inherit',
    },
    screens: {
      ss: '360px',
      // => @media (min-width: 640px) { ... }
      xs: '375px',
      // => @media (min-width: 640px) { ... }
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }// tablet

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }//laptop

      xl: '1280px',
      // => @media (min-width: 1280px) { ... } // laptop m // laptop L 1440px
      // '2xl': '1440px',

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }

      '4xl': '2560px',
      // => @media (min-width: 2560px) { ... } // 4k
    },
  },
  corePlugins: {
    preflight: false,
  },
};
