# Pull Request: Implement Solitaire-Style Card Stacking for Chain Items

## Overview

This PR implements a solitaire-style card stacking mechanism for the chain component. When too many items are added to the chain, instead of showing a horizontal scrollbar, the cards now stack vertically with only the cards closest to the middle fully visible.

## Problem

Previously, when too many items were added to the chain, a horizontal scrollbar would appear, extending the screen width. This created a suboptimal user experience as it required horizontal scrolling to view all items in the chain.

## Solution

The solution implements a dynamic stacking mechanism that activates based on the number of items in the chain rather than just screen size. This ensures that when too many items are added, they stack vertically with partial visibility, eliminating the need for horizontal scrolling.

## Changes

### 1. Modified `ChainView.tsx`

- Added logic to determine when to apply stacking based on the number of items:
  - For in-progress chains: Stack when there are more than 4 items total
  - For completed (success) chains: Stack when there are more than 6 items total
- Added a dynamic `stacked` class to the chain container when stacking should be applied

### 2. Updated `Chain.css`

- Added CSS rules to apply stacking effects when the `stacked` class is present:
  - Overlapping cards with negative margins
  - Dynamic vertical offset for cards further from the center
  - Partial visibility with clip-path for stacked cards (showing only 30% of each card)
  - Hover effects to show the full card when hovered
- Maintained the existing media query-based stacking for responsive design
- Ensured proper z-index ordering so cards stack correctly

## Visual Changes

Before:
- Cards displayed in a horizontal row
- Horizontal scrollbar appears when too many items are added
- All cards fully visible at all times

After:
- Cards automatically collapse into a solitaire-style stack when there are too many
- Only the cards closest to the middle are fully visible
- Other cards are partially visible with a slight offset
- Hovering over any card brings it to the front and shows it completely
- No horizontal scrollbar, as cards now stack vertically

## Testing

The changes have been tested with various numbers of items in the chain to ensure:
- Stacking activates at the correct thresholds (>4 items for in-progress, >6 items for completed chains)
- Cards stack properly with correct z-index ordering
- Hover effects work as expected
- The UI remains responsive across different screen sizes

## Future Improvements

Potential future improvements could include:
- Animation transitions when cards stack/unstack
- Keyboard navigation for stacked cards
- Adjustable stacking thresholds via configuration
