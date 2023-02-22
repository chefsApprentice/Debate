/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./dist/**/*.{js,jsx,ts,tsx}"],
    // will only be js jsx in dist but we are extra safe
    theme: {
      extend: {},
    },
    plugins: [],
  };
  