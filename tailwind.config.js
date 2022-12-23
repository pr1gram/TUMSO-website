/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem"
    },
    extend: {
      screens: {
        switch: "1110px",
        xs: "490px"
      },
      colors: {
        "deep-purple": {
          800: "#242038"
        },
        malt: {
          400: "#f7ece1"
        },
        "silver-purple": {
          200: "#cac4ce"
        },
        "blue-purple": {
          400: "#8d86c9"
        },
        "pastel-purple": {
          500: "#9067c6"
        }
      }
    }
  },
  // eslint-disable-next-line global-require
  plugins: [require("@tailwindcss/line-clamp")]
}
