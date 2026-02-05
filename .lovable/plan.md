
# Reformat Custom Pages to Match Homepage Style

## Problem Analysis

The custom pages (`/industri/kardus`, `/produk/packaging-makanan`, `/produk/paper-bag-retail`, `/produk/hardbox-custom`) use the generic `BlockRenderer` component which renders content blocks with a different visual style than the built-in pages like Homepage, `/solusi-korporat`, and `/solusi-umkm`.

### Key Style Differences

| Element | Built-in Pages (Target) | Custom Pages (Current) |
|---------|-------------------------|------------------------|
| **Hero** | `gradient-hero` with centered content, `font-display font-bold`, text sizes `4xl/5xl/6xl`, secondary-colored CTA button | Dark overlay on image, basic text styling |
| **Section Headers** | `font-display font-bold`, `3xl/4xl` size, centered with `text-center max-w-3xl mx-auto mb-16` pattern | Uses prose styling, left-aligned |
| **Features/Benefits** | Card-based with icon boxes (`bg-secondary/10`), `hover-lift` effect, `rounded-2xl` borders | Simple Card component without hover effects |
| **Stats** | `gradient-primary` background, white text, animated numbers | `bg-primary` solid background |
| **Container Styling** | `container mx-auto px-4` with generous padding (`py-24`) | Smaller padding (`py-6`, `py-16`) |
| **CTA Section** | Rounded container (`rounded-3xl`) with `gradient-primary`, decorative blur elements | Full-width gradient |
| **Text Content** | Clean muted-foreground paragraphs, clear hierarchy | Prose-based with complex overrides |
| **Alternating Backgrounds** | `bg-background` / `bg-muted/30` pattern | No background on flow blocks |

---

## Implementation Plan

### Phase 1: Update Hero Block
Update `HeroBlock` in BlockRenderer to match the homepage/built-in page hero style:
- Add `gradient-hero` as default background when no image
- Use `font-display font-bold` typography
- Match button styling (`bg-secondary hover:bg-secondary/90`)
- Add `pt-32 pb-20` padding pattern

### Phase 2: Update Features Block
Align `FeaturesBlock` with the `FeaturesSection` component styling:
- Add `container mx-auto px-4` wrapper
- Use `py-24` vertical padding
- Match card styling with `rounded-2xl`, `border border-border`, `hover:border-secondary/50`, `hover-lift`
- Use `bg-secondary/10` icon containers with `text-secondary` icons

### Phase 3: Update Text Block
Simplify text styling to match built-in pages:
- Remove complex prose overrides
- Use simpler `text-muted-foreground` for body text
- Add proper `container mx-auto px-4` wrapper
- Use `py-16` or `py-24` section padding

### Phase 4: Update Stats Counter Block  
Match `StatsSection` component styling:
- Change from `bg-primary` to `gradient-primary`
- Use `container mx-auto px-4` wrapper
- Match font sizes and opacity patterns

### Phase 5: Update CTA Block
Match `CTASection` component styling:
- Add container wrapper with `rounded-3xl` inner container
- Add decorative blur elements
- Match button styling (white primary button, transparent outline secondary)

### Phase 6: Update Table Block
Apply consistent section styling:
- Add `container mx-auto px-4` wrapper
- Use `py-16` or `py-24` section padding
- Match title styling with `font-display font-bold`

### Phase 7: Update Section Background Logic
Improve `getSectionBg()` function:
- Apply `bg-muted/30` to appropriate alternating sections
- Ensure proper visual rhythm between sections

---

## Technical Details

### File to Modify
`src/components/common/BlockRenderer.tsx`

### Key Style Classes to Apply

```text
Hero:
  pt-32 pb-20 gradient-hero (or image overlay)
  font-display font-bold
  text-4xl sm:text-5xl
  bg-secondary hover:bg-secondary/90 (button)

Section Headers:
  text-center max-w-3xl mx-auto mb-16
  text-3xl sm:text-4xl font-display font-bold text-foreground mb-4
  text-muted-foreground text-lg (subtitle)

Cards/Features:
  rounded-2xl bg-card border border-border 
  hover:border-secondary/50 hover-lift
  bg-secondary/10 (icon container)
  text-secondary (icon color)

Container Pattern:
  container mx-auto px-4
  py-24 (sections)

CTA:
  rounded-3xl gradient-primary
  bg-white text-primary (primary button)
  border-white/30 text-white hover:bg-white/10 bg-transparent (secondary)
```

### Changes Summary

1. **HeroBlock**: Update gradient, typography, button styles, padding
2. **TextBlock**: Simplify prose, add container wrapper, increase padding
3. **FeaturesBlock**: Match FeaturesSection card styling and layout
4. **StatsCounterBlock**: Use gradient-primary, match typography
5. **CTABlock**: Add rounded container, decorative elements, match buttons
6. **TableBlock**: Add container wrapper, match title styling
7. **getSectionBg()**: Implement alternating background pattern

This will create visual consistency between all pages - whether built-in or custom - giving the entire site a cohesive, professional appearance.
