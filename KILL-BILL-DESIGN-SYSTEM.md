# Kill Bill Design System for ShadCN/Tailwind CSS

> *"Revenge is a dish best served cold."*

A bold, cinematic design system inspired by Quentin Tarantino's **Kill Bill Vol. 1 & 2**. Features the iconic yellow/black palette, Japanese influences, blood red accents, and action-oriented typography.

---

## 🎬 Quick Start

### Option 1: Copy the CSS (Recommended for Lovable/AI Agents)

Copy the contents of `kill-bill-globals.css` into your project's global CSS file (e.g., `globals.css`, `index.css`).

```css
/* At the top of your globals.css */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

/* Then paste the contents of kill-bill-globals.css */
```

### Option 2: Use with Tailwind

1. Replace your `tailwind.config.js` with `kill-bill-tailwind.config.js`
2. Import `kill-bill-globals.css` in your app
3. Optionally import `kill-bill-components.css` for ShadCN overrides

---

## 🎨 Color Palette

| Token | HSL | Usage |
|-------|-----|-------|
| **Bride Yellow** | `hsl(48, 100%, 50%)` | Primary actions, highlights, The Bride's tracksuit |
| **Blood Red** | `hsl(0, 100%, 27%)` | Destructive actions, violence, accents |
| **Samurai Black** | `hsl(0, 0%, 5%)` | Backgrounds, O-Ren's world |
| **Steel Gray** | `hsl(220, 10%, 40%)` | Muted text, Hattori Hanzo's swords |
| **Tokyo Neon** | Pink/Blue neons | Club scenes, highlights |
| **Paper Cream** | `hsl(40, 40%, 95%)` | Text on dark backgrounds |

### CSS Variables

```css
/* Primary palette */
--bride-yellow: 48 100% 50%;
--blood-red: 0 100% 27%;
--samurai-black: 0 0% 5%;
--steel-gray: 220 10% 40%;

/* ShadCN semantic tokens */
--primary: 48 100% 50%;        /* Bride Yellow */
--destructive: 0 100% 27%;     /* Blood Red */
--background: 0 0% 5%;         /* Samurai Black */
--foreground: 48 100% 50%;     /* Yellow text */
```

---

## 📝 Typography

| Style | Font | Usage |
|-------|------|-------|
| **Display** | Bebas Neue | Chapter titles, hero text |
| **Heading** | Oswald | Section headers, buttons |
| **Body** | Inter | Body text, UI elements |

### Usage

```html
<h1 class="font-display text-display-xl tracking-dramatic">
  CHAPTER 1
</h1>
<h2 class="font-heading text-3xl uppercase tracking-action">
  The Bride
</h2>
<p class="font-body text-base">
  Regular body text...
</p>
```

### Tailwind Classes

- `font-display` — Bebas Neue
- `font-heading` — Oswald
- `font-body` — Inter
- `text-display-xl` / `text-display-lg` / `text-chapter` — Large display sizes
- `tracking-dramatic` / `tracking-action` — Wide letter spacing

---

## 🗡️ Special Utility Classes

### Chapter Card

```html
<div class="chapter-card">
  <h2 class="chapter-title">CHAPTER 1</h2>
  <p class="chapter-subtitle">THE DEADLY VIPER ASSASSINATION SQUAD</p>
</div>
```

### Blood Splatter Effect

```html
<button class="splatter">
  Hover for blood splatter
</button>
```

### Katana Hover Effect

```html
<a class="katana-hover">
  Slash effect on hover
</a>
```

### Neon Text

```html
<span class="neon-text">
  TOKYO NIGHTLIFE
</span>
```

### Film Grain Overlay

```html
<div class="film-grain">
  Grindhouse effect
</div>
```

### Stripe Patterns

```html
<div class="stripe-bride">Yellow/black stripes</div>
<div class="stripe-animated">Animated stripes</div>
```

---

## 🎭 Component Variants

### Buttons

| Variant | Class | Description |
|---------|-------|-------------|
| Primary | `btn-primary` | Bride Yellow, black text |
| Destructive | `btn-destructive` | Blood Red |
| Secondary | `btn-secondary` | Steel Gray |
| Outline | `btn-outline` | Yellow border |
| Ghost | `btn-ghost` | Subtle hover |
| Katana | `btn-katana` | Slash effect on hover |

### Cards

| Variant | Class | Description |
|---------|-------|-------------|
| Default | `card` | Dark with yellow border on hover |
| Chapter | `card-chapter` | Striped header (anime style) |
| Blood | `card-blood` | Red-tinted background |

### Badges

| Variant | Class |
|---------|-------|
| Bride | `badge-bride` |
| Blood | `badge-blood` |
| Steel | `badge-steel` |
| Outline | `badge-outline` |
| Kill (crossed out) | `badge-kill` |

---

## ⚡ Animations

| Animation | Class | Description |
|-----------|-------|-------------|
| Katana Slash | `animate-katana-slash` | Diagonal slash effect |
| Blood Drip | `animate-blood-drip` | Dripping blood |
| Blood Splatter | `animate-blood-splatter` | Expanding splatter |
| Danger Pulse | `animate-pulse-danger` | Red pulsing glow |
| Neon Flicker | `animate-neon-flicker` | Tokyo neon sign effect |
| Film Grain | `animate-film-grain` | Grindhouse grain overlay |
| Chapter Reveal | `animate-chapter-reveal` | Wipe-in reveal |

---

## 🌙 Dark Mode

The design system defaults to dark mode (Kill Bill aesthetic). Light mode converts to a "chapter card" style with cream paper backgrounds:

```html
<!-- Dark mode (default) -->
<html class="dark">

<!-- Light mode (chapter interstitial style) -->
<html class="light">
```

---

## 📦 File Structure

```
kill-bill-globals.css      # Core CSS variables + base styles
kill-bill-tailwind.config.js  # Tailwind theme extension
kill-bill-components.css   # ShadCN component overrides
```

---

## 🤖 AI Agent Integration

When using this design system with AI agents (Lovable, Antigravity, etc.):

1. **Upload `kill-bill-globals.css`** as your base stylesheet
2. **Include this prompt context:**

> "Use the Kill Bill design system. Key tokens:
> - Primary color: bride-yellow (#FFD700)
> - Destructive: blood-red
> - Background: samurai-black
> - All corners should be sharp (border-radius: 0)
> - Typography: Bebas Neue for display, Oswald for headings
> - Use uppercase text with wide letter-spacing for headers
> - Apply stripe-bride pattern for emphasis
> - Use dramatic shadows and bold contrasts"

---

## 🎬 Design Principles

1. **Sharp Edges** — No rounded corners. Everything is precise, like a katana cut.
2. **High Contrast** — Yellow on black, blood red accents. Maximum visual impact.
3. **Bold Typography** — Uppercase, wide letter-spacing. Every word is a statement.
4. **Dramatic Shadows** — Deep noir lighting. Everything has weight and presence.
5. **Action-Oriented** — Slash effects, blood splatter, danger pulses. The UI feels alive.
6. **Japanese Influence** — Chapter cards, paper textures, samurai aesthetics.

---

## 📜 License

The Bride approves this message. ⚔️

*"It's mercy, compassion, and forgiveness I lack. Not rationality."*
