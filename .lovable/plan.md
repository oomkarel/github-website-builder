
# Center Feature Grid Cards

## Problem
The feature cards grid starts from the left side. When the number of items doesn't fill the full row (e.g., 3 items in a 4-column grid), the cards bunch to the left with empty space on the right, breaking the centered aesthetic of the page.

## Solution
Add `justify-center` to the feature grid containers so cards are always centered on the page, regardless of how many items there are. This applies to two locations:

## Files to Modify

### 1. `src/components/common/BlockRenderer.tsx` (line 447)
Change the grid class from:
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8
```
To:
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center
```

Alternatively, switch to a flexbox approach for true centering with wrapping:
```
flex flex-wrap justify-center gap-8
```
With each card getting a fixed width basis. However, since the grid already works well for 4 items, the simpler fix is to add `place-items-center` or wrap the grid in a flex container with `justify-center`.

**Recommended approach**: Use `justify-items-center` on the grid so individual items center within their columns, keeping the grid structure intact.

### 2. `src/components/home/FeaturesSection.tsx` (line 41)
Apply the same centering fix for consistency across the site.

## Technical Detail
Both files get one class addition (`justify-items-center`) to their grid containers. This ensures cards are visually centered regardless of the number of items per row.
