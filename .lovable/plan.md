

# Bigger H1/H2 Headings + Table Title as H2

## Changes

### 1. Increase H1 and H2 sizes in TextBlock prose styling

Currently, prose headings in the TextBlock (default, highlight-box, and other styles) are sized at:
- H2: `text-2xl` (approx 24px)
- H3: `text-xl` (approx 20px)
- No H1 prose override

Update to:
- H1: `text-4xl sm:text-5xl` (biggest heading, matching hero-level sizing)
- H2: `text-3xl sm:text-4xl` (large section heading)
- H3: `text-xl` (stays the same as subheading)

This applies to:
- Default prose style (line ~293)
- Highlight-box style (line ~276)
- Any other prose block that renders CMS HTML content

### 2. Change Table Title from H3 to H2

The `TableBlock` currently renders `data.title` as an `<h3>` tag (line 320). Change it to `<h2>` so it matches other section headers across the site, keeping the same large styling (`text-3xl sm:text-4xl font-display font-bold`).

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/common/BlockRenderer.tsx` | Add `prose-h1` overrides (text-4xl sm:text-5xl), increase `prose-h2` to text-3xl sm:text-4xl, change Table title tag from h3 to h2 |

