// adds all the text and background colors to the safelist

import tailwindColors from "tailwindcss/colors"

const colorSafeList: string[] = []

// Skip these to avoid a load of deprecated warnings when tailwind starts up
const deprecated = ["lightBlue", "warmGray", "trueGray", "coolGray", "blueGray"]

for (const colorName in tailwindColors) {
    if (deprecated.includes(colorName)) {
        continue
    }

    // Define all of your desired shades
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

    const pallette = tailwindColors[colorName]

    if (typeof pallette === "object") {
        shades.forEach((shade) => {
            if (shade in pallette) {
                colorSafeList.push(`text-${colorName}-${shade}`)
                colorSafeList.push(`bg-${colorName}-${shade}`)
            }
        })
    }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
    safeList: colorSafeList,
    darkMode: ['class'],
    content: [
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))',
                },
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: 'hsl(var(--foreground))',
                        hr: {
                            borderColor: 'hsl(var(--border))',
                            marginTop: '2em',
                            marginBottom: '2em',
                        },
                        'h1, h2, h3, h4, h5, h6': {
                            color: 'hsl(var(--foreground))',
                        },
                        a: {
                            color: 'hsl(var(--primary))',
                            '&:hover': {
                                color: 'hsl(var(--primary))',
                            },
                        },
                        strong: {
                            color: 'hsl(var(--foreground))',
                        },
                        code: {
                            color: 'hsl(var(--foreground))',
                        },
                        pre: {
                            backgroundColor: 'hsl(var(--muted))',
                            color: 'hsl(var(--muted-foreground))',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
        require('@tailwindcss/typography'),
    ],
};
