/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#fff3ec",
                    100: "#ffe0cf",
                    200: "#ffc1a0",
                    300: "#ff9d70",
                    400: "#ff824f",
                    500: "#ff6a39",
                    600: "#ff6a39",
                    700: "#e8551f",
                    800: "#bb4419",
                    900: "#973916"
                }
            }
        }
    },
    plugins: []
};
