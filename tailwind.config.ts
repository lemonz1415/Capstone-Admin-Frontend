import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          0: "#EFF8FF",
          1: "#D1E9FF",
          2: "#B2DDFF",
          3: "#84CAFF",
          4: "#53B1FD",
          5: "#2E90FA",
        },
        gray: {
          0: "#E4E7EC",
          1: "#D0D5DD",
          2: "#9BA2B3",
          3: "#667085",
        },
        red: {
          0: "#FECDCA",
          1: "#FDA298",
          2: "#F97066",
          3: "#F04438",
        },
        yellow: {
          0: "#FEDF89",
          1: "#FEC848",
          2: "#FDB022",
          3: "#F79009",
        },
        green: {
          0: "#A6F4C5",
          1: "#6DE9A7",
          2: "#32D583",
          3: "#12B76A",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
