

# Fix Text Block Alignment Issues on Custom Pages

## Problem Summary

The `/produk/packaging-makanan` page has three text blocks with alignment and styling inconsistencies:

1. **First text block** - Content alignment doesn't match the website's visual style
2. **Second text block** (Product descriptions) - Should be centered, not left-aligned
3. **Third text block** ("Food Grade" section) - Format/design doesn't match the rest of the site

The root cause is that the CMS content uses HTML heading tags (`<h2>`, `<h3>`) for content structure, but the TextBlock renders these as large headings instead of styled body text matching the site's design system.

---

## Proposed Solution

### Add Text Alignment Option to TextBlock

Enhance the `TextBlock` component to support configurable text alignment, allowing individual text blocks to be left-aligned, centered, or right-aligned based on CMS data.

```text
File: src/components/common/BlockRenderer.tsx

Changes to TextBlock:
1. Read data.alignment property (default: 'left')
2. Apply appropriate text alignment class
3. Center the container when alignment is 'center'
```

### Improve Typography Consistency

Update the prose styling to better match the website's design language:

```text
Current Issues:
- <h2> and <h3> in content render as large headings
- Prose styling doesn't match FeaturesSection or CorporateSolutions pages

Solution:
- Style content <h2> as section subheadings (font-display, appropriate size)
- Style content <h3> as emphasized text (semibold, slightly larger)
- Ensure paragraph text uses text-muted-foreground consistently
- Add proper spacing between elements
```

---

## Implementation Details

### 1. Update TextBlock Component

```text
// In BlockRenderer.tsx - TextBlock function

Add alignment support:
- data.alignment: 'left' | 'center' | 'right' (default: 'left')
- Apply text-center/text-left/text-right class based on setting
- When centered, also center the container (mx-auto)

Update prose classes for better consistency:
- prose-h2: font-display, text-2xl, font-bold, text-foreground
- prose-h3: font-display, text-xl, font-semibold, text-secondary
- prose-p: text-muted-foreground, text-base md:text-lg
- prose-strong: text-foreground for proper contrast
- prose-ul/prose-li: consistent muted styling
```

### 2. Update CMS Editor (ContentBlockEditor)

Add an alignment dropdown to the Text block editor:

```text
Location: src/components/admin/ContentBlockEditor.tsx

Add new field for text blocks:
- Label: "Text Alignment"
- Options: Left (default), Center, Right
- Stored in: data.alignment
```

### 3. Data Migration Note

Existing text blocks will default to left alignment. To center the product descriptions block:
- Edit the page in CMS
- Select the text block
- Change alignment to "Center"

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/common/BlockRenderer.tsx` | Add alignment prop support, update prose styling |
| `src/components/admin/ContentBlockEditor.tsx` | Add alignment dropdown for text blocks |

---

## Expected Results

After implementation:

1. **First text block**: Will maintain left alignment with improved typography matching the site's design
2. **Second text block**: Can be set to center alignment via CMS, making product descriptions centered
3. **Third text block**: Typography will match the clean, consistent style of built-in pages

The text content will use:
- `font-display` for any heading elements
- `text-muted-foreground` for body paragraphs
- Consistent spacing and sizing matching FeaturesSection/CorporateSolutions pages

