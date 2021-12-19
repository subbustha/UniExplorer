module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#202225",
        secondary: "#5865F2",
        main: "rgba(5, 150, 105)",
      },
      width: {
        128: "30rem",
      },
      boxShadow: {
        white: "0 0 10px 0 #000000",
      },
    },
  },
  variants: {
    extend: {
      scale: ["hover"],
      borderRadius: ["hover"],
      display: ["group-hover", "hover"],
      margin: ["last"],
      marginTop: ["last"],
      backkgroundColor: ["last"],
      borderWidth: ["hover"],
      cursor: ["hover"],
      shadow: ["hover"],
    },
  },
  plugins: [],
};
