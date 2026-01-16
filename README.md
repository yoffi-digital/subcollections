# Subcollection Bubbles Carousel
A Shopify section that renders a horizontal carousel of subcollections as "bubbles."


**Features:**
- Responsive bubble sizing (desktop/tablet/mobile)
- Optional carousel adapter:
  - **Native scroll** (custom scroll + Prev/Next buttons)
  - **Prestige theme carousel** (uses theme’s `<scroll-carousel>` and theme buttons)
- Auto-centering if content does not overflow
- Drag support on touch devices
- CSS-variable-driven customization for colors, spacing, bubble count, and text size

> ⚠️ Important: All **existing CSS classes must be preserved**. You may add extra classes if needed for theme-specific styling.

---

## Theme Adapter

The carousel uses a **theme adapter pattern**. Adapters handle only **theme-specific markup and integration** (container element, Prev/Next buttons, icons), while core behavior (sizing, spacing, overflow, responsiveness) is handled by shared JS and CSS.

### Native Adapter
- Standard `<div>` with `.subcollections__wrapper-carousel`
- Custom Prev/Next buttons
- Section JS handles scrolling, button state, overflow centering, and drag
- Uses inline SVG (`icon-caret.svg`) for arrows
- Theme-agnostic fallback and template for new themes

### Prestige Adapter
- Uses theme’s `<scroll-carousel>` and `<carousel-prev-button>` / `<carousel-next-button>`
- Theme handles scrolling, snapping, and animations
- Section JS only handles sizing, gap calculation, and overflow centering
- Native JS does **not** interfere with Prestige scrolling or buttons

### Adapting to a New Theme
- Do **not modify** core JS or CSS
- Create a **new adapter snippet** for theme markup
- Reuse all existing CSS classes
- Map markup to the theme’s carousel system
- Native adapter can serve as a template: remove `.native` classes, replace icons with theme icons, adjust button and spacing styles


Basically the only thing that needs to be updated is: creating a new adapter snippet and some styles (fonts/font-sizes and so on)

---

## Files & Responsibilities

### 1) `assets/subcollection-bubbles.js`
- Defines `<subcollection-bubbles-carousel>`
- Calculates CSS variables for bubble size and gaps
- Detects overflow and toggles `justify-content` (`center` / `flex-start`)
- Sets `allow-drag` for touch devices
- Handles Prev/Next buttons (native adapter)
- Updates on:
  - ResizeObserver
  - window resize
  - `shopify:section:load` (theme editor)
  - scroll events (native adapter)

> **No need to modify** unless customizing behavior or improving/refactoring.

### 2) Section file (`sections/subcollection-bubbles.liquid`)
- Loads `subcollection-bubbles.js`
- Selects carousel adapter (`native` / `prestige`)
- Outputs CSS variables scoped to `.subcollections__carousel-{{ section.id }}`
- Section settings:
  - Carousel adapter
  - Bubble counts (desktop/tablet/mobile)
  - Border color/thickness
  - Button & arrow colors
  - Section vertical spacing
  - Text size and style

> **Do not change section wrapper or core classes:**
```html
<div class="subcollections__container section-spacing-small">
  <subcollection-bubbles-carousel
    class="subcollections__carousel subcollections__carousel-{{ section.id }} floating-controls-container floating-controls-container--on-hover"
  >
```

> **New adapter can be added here**

### 3) Snippets
- `subcollections-carousel-adapter-native.liquid` – renders the native(custom) carousel structure
- `subcollections-carousel-adapter-prestige.liquid` – renders the Prestige carousel structure
- `subcollection-bubble-list.liquid` – loops over subcollections
- `subcollection-bubble-card.liquid` – renders individual bubble + title

When adapting to another theme, create a new adapter snippet, but keep all CSS classes. JS will continue to work without changes.

### 4) CSS
- `subcollections-bubbles.css`

### 4) svg
- `icon-carret.svg` (for native adapter)

## Data Requirements (Metafields)

### Collection Metafield: `custom.subcollections`
- Type: List of Collections (reference list)
- Used as: `collection.metafields.custom.subcollections.value`

### Subcollection Image (optional)
- `custom.subcollection_image` (file / image)
- Fallback order:
  1. `collection.metafields.custom.subcollection_image`
  2. `collection.featured_image`
  3. `collection.products.first.featured_image`

---

## Installation

1. **JS**
   - Add `subcollection-bubbles.js` to `assets/`
2. **CSS**
   - Include `subcollection-bubbles.css` CSS in your theme or section stylesheet
3. **Section**
   - Copy `sections/subcollection-bubbles.liquid`
4. **Snippets**
   - Add the adapters + list + card snippets
   - Create new adapter if needed
5. **Metafields**
   - `custom.subcollections` (List of Collections)
   - `custom.subcollection_image` (optional)
6. **Assign subcollections**
   - Set the parent collection’s `custom.subcollections` metafield

---

## Bubble Sizing Logic

The carousel dynamically calculates bubble width using CSS variables:

```css
--item-size = (carouselWidth - totalGapWidth) / numBubblesPlusHalf
```

## Short summary what basically needs to be updated:

For most theme integrations, the **only things you need to update** are:
1. **Theme adapter snippet**  
   - Create a new snippet for the target theme if needed.  
   - This handles theme-specific markup for the carousel container, Prev/Next buttons, and icons.  
   - Existing JS and CSS will continue to work without changes.

2. **Styles**  
   - Fonts, font sizes, spacing, colors, and other theme-specific styling.  
   - **Do not change existing CSS class names**; add additional classes if needed.

