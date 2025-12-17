/**
 * ═══════════════════════════════════════════════════════════════════════════
 * KILL BILL DESIGN SYSTEM - Tailwind Configuration
 * ═══════════════════════════════════════════════════════════════════════════
 * Inspired by Quentin Tarantino's Kill Bill Vol. 1 & 2
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            /* ───────────────────────────────────────────────────────────────────
               COLORS - Kill Bill Palette
               ─────────────────────────────────────────────────────────────────── */
            colors: {
                // The Bride's Yellow - Iconic tracksuit
                bride: {
                    DEFAULT: "hsl(48, 100%, 50%)",
                    50: "hsl(48, 100%, 95%)",
                    100: "hsl(48, 100%, 85%)",
                    200: "hsl(48, 100%, 75%)",
                    300: "hsl(48, 100%, 65%)",
                    400: "hsl(48, 100%, 55%)",
                    500: "hsl(48, 100%, 50%)",
                    600: "hsl(45, 100%, 45%)",
                    700: "hsl(42, 100%, 40%)",
                    800: "hsl(40, 100%, 35%)",
                    900: "hsl(38, 100%, 30%)",
                    950: "hsl(35, 100%, 20%)",
                },
                // Blood Red - Violence and revenge
                blood: {
                    DEFAULT: "hsl(0, 100%, 27%)",
                    50: "hsl(0, 100%, 95%)",
                    100: "hsl(0, 100%, 85%)",
                    200: "hsl(0, 100%, 75%)",
                    300: "hsl(0, 100%, 60%)",
                    400: "hsl(0, 100%, 50%)",
                    500: "hsl(0, 100%, 45%)",
                    600: "hsl(0, 100%, 35%)",
                    700: "hsl(0, 100%, 27%)",
                    800: "hsl(0, 100%, 20%)",
                    900: "hsl(0, 100%, 15%)",
                    950: "hsl(0, 100%, 10%)",
                },
                // Samurai Black - O-Ren's world
                samurai: {
                    DEFAULT: "hsl(0, 0%, 5%)",
                    50: "hsl(0, 0%, 95%)",
                    100: "hsl(0, 0%, 85%)",
                    200: "hsl(0, 0%, 70%)",
                    300: "hsl(0, 0%, 55%)",
                    400: "hsl(0, 0%, 40%)",
                    500: "hsl(0, 0%, 25%)",
                    600: "hsl(0, 0%, 18%)",
                    700: "hsl(0, 0%, 12%)",
                    800: "hsl(0, 0%, 8%)",
                    900: "hsl(0, 0%, 5%)",
                    950: "hsl(0, 0%, 2%)",
                },
                // Steel Gray - Hattori Hanzo's swords
                steel: {
                    DEFAULT: "hsl(220, 10%, 40%)",
                    50: "hsl(220, 10%, 95%)",
                    100: "hsl(220, 10%, 85%)",
                    200: "hsl(220, 10%, 75%)",
                    300: "hsl(220, 10%, 65%)",
                    400: "hsl(220, 10%, 55%)",
                    500: "hsl(220, 10%, 45%)",
                    600: "hsl(220, 10%, 40%)",
                    700: "hsl(220, 10%, 30%)",
                    800: "hsl(220, 10%, 20%)",
                    900: "hsl(220, 10%, 15%)",
                    950: "hsl(220, 10%, 10%)",
                },
                // Tokyo Neon - Club scenes
                tokyo: {
                    pink: "hsl(330, 100%, 60%)",
                    blue: "hsl(200, 100%, 50%)",
                    purple: "hsl(280, 100%, 60%)",
                },
                // Paper/Parchment - Traditional Japanese
                paper: {
                    DEFAULT: "hsl(40, 40%, 95%)",
                    cream: "hsl(40, 40%, 95%)",
                    aged: "hsl(35, 30%, 88%)",
                    antique: "hsl(30, 25%, 80%)",
                },
                // ShadCN compatible
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
            },

            /* ───────────────────────────────────────────────────────────────────
               TYPOGRAPHY
               ─────────────────────────────────────────────────────────────────── */
            fontFamily: {
                display: ["Bebas Neue", "Impact", "sans-serif"],
                heading: ["Oswald", "Impact", "sans-serif"],
                body: ["Inter", "system-ui", "sans-serif"],
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            fontSize: {
                "display-xl": ["8rem", { lineHeight: "1", letterSpacing: "0.1em" }],
                "display-lg": ["6rem", { lineHeight: "1", letterSpacing: "0.1em" }],
                "display-md": ["4.5rem", { lineHeight: "1.1", letterSpacing: "0.08em" }],
                "display-sm": ["3rem", { lineHeight: "1.1", letterSpacing: "0.05em" }],
                chapter: ["3.75rem", { lineHeight: "1", letterSpacing: "0.15em" }],
            },
            letterSpacing: {
                dramatic: "0.15em",
                action: "0.1em",
                chapter: "0.2em",
            },

            /* ───────────────────────────────────────────────────────────────────
               SPACING - Cinematic proportions
               ─────────────────────────────────────────────────────────────────── */
            spacing: {
                dramatic: "8rem",
                cinematic: "6rem",
                scene: "4rem",
                shot: "2rem",
                frame: "1rem",
                cut: "0.5rem",
            },

            /* ───────────────────────────────────────────────────────────────────
               BORDER RADIUS - Sharp edges, minimal rounding
               ─────────────────────────────────────────────────────────────────── */
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                sharp: "0",
                katana: "2px",
            },

            /* ───────────────────────────────────────────────────────────────────
               BOX SHADOW - Dramatic lighting
               ─────────────────────────────────────────────────────────────────── */
            boxShadow: {
                katana: "0 4px 20px -2px rgba(255, 215, 0, 0.3)",
                blood: "0 4px 20px -2px rgba(139, 0, 0, 0.5)",
                noir: "0 10px 40px -10px rgba(0, 0, 0, 0.8)",
                dramatic: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
                neon: "0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)",
                "blood-glow": "0 0 20px rgba(220, 20, 60, 0.5), 0 0 40px rgba(139, 0, 0, 0.3)",
            },

            /* ───────────────────────────────────────────────────────────────────
               ANIMATIONS
               ─────────────────────────────────────────────────────────────────── */
            animation: {
                "katana-slash": "katana-slash 0.5s ease-out",
                "blood-drip": "blood-drip 2s ease-in infinite",
                "blood-splatter": "blood-splatter 0.3s ease-out forwards",
                "pulse-danger": "pulse-danger 2s ease-in-out infinite",
                "neon-flicker": "neon-flicker 3s infinite",
                "film-grain": "film-grain 0.5s steps(10) infinite",
                "chapter-reveal": "chapter-reveal 0.8s ease-out forwards",
                "stripe-slide": "stripe-slide 1s linear infinite",
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            keyframes: {
                "katana-slash": {
                    "0%": { transform: "translateX(-100%) rotate(-45deg)", opacity: "0" },
                    "50%": { opacity: "1" },
                    "100%": { transform: "translateX(100%) rotate(-45deg)", opacity: "0" },
                },
                "blood-drip": {
                    "0%": { transform: "translateY(-10px)", opacity: "0" },
                    "20%": { opacity: "1" },
                    "100%": { transform: "translateY(100px)", opacity: "0" },
                },
                "blood-splatter": {
                    "0%": { transform: "scale(0)", opacity: "1" },
                    "100%": { transform: "scale(1)", opacity: "0.8" },
                },
                "pulse-danger": {
                    "0%, 100%": { boxShadow: "0 0 0 0 hsla(0, 100%, 45%, 0.7)" },
                    "50%": { boxShadow: "0 0 0 15px hsla(0, 100%, 45%, 0)" },
                },
                "neon-flicker": {
                    "0%, 100%": { opacity: "1" },
                    "92%": { opacity: "1" },
                    "93%": { opacity: "0.3" },
                    "94%": { opacity: "1" },
                    "96%": { opacity: "0.5" },
                    "97%": { opacity: "1" },
                },
                "film-grain": {
                    "0%, 100%": { transform: "translate(0, 0)" },
                    "10%": { transform: "translate(-1%, -1%)" },
                    "20%": { transform: "translate(1%, 1%)" },
                    "30%": { transform: "translate(-1%, 1%)" },
                    "40%": { transform: "translate(1%, -1%)" },
                    "50%": { transform: "translate(-1%, 0%)" },
                    "60%": { transform: "translate(1%, 0%)" },
                    "70%": { transform: "translate(0%, 1%)" },
                    "80%": { transform: "translate(0%, -1%)" },
                    "90%": { transform: "translate(1%, 1%)" },
                },
                "chapter-reveal": {
                    "0%": { clipPath: "inset(0 100% 0 0)" },
                    "100%": { clipPath: "inset(0 0 0 0)" },
                },
                "stripe-slide": {
                    "0%": { backgroundPosition: "0 0" },
                    "100%": { backgroundPosition: "50px 0" },
                },
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },

            /* ───────────────────────────────────────────────────────────────────
               BACKGROUND IMAGES
               ─────────────────────────────────────────────────────────────────── */
            backgroundImage: {
                "stripe-bride": `repeating-linear-gradient(
          90deg,
          hsl(48, 100%, 50%) 0px,
          hsl(48, 100%, 50%) 10px,
          hsl(0, 0%, 5%) 10px,
          hsl(0, 0%, 5%) 20px
        )`,
                "stripe-blood": `repeating-linear-gradient(
          90deg,
          hsl(0, 100%, 27%) 0px,
          hsl(0, 100%, 27%) 10px,
          hsl(0, 0%, 5%) 10px,
          hsl(0, 0%, 5%) 20px
        )`,
                "gradient-katana": "linear-gradient(135deg, hsl(48, 100%, 50%) 0%, hsl(45, 100%, 42%) 100%)",
                "gradient-blood": "linear-gradient(135deg, hsl(0, 100%, 45%) 0%, hsl(0, 100%, 27%) 100%)",
                "gradient-noir": "linear-gradient(180deg, hsl(0, 0%, 8%) 0%, hsl(0, 0%, 2%) 100%)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
