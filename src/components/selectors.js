import { createSelector } from 'reselect'
import {
  BULLET_WIDTH_INCLUDING_MARGIN,
  MAX_ITEM_TEXT_WIDTH,
  MIN_HEADER_TICK_SPACING,
} from "../constants";
import immutableRecords from "../types/immutableRecords";
import calcTextSize from "../utils/calcTextSize";
import calculateYCoordinate from '../utils/calculateItemYCoordinate';

// Task 1 - you may need some of these additional imports...
// import calcTextSize from "../utils/calcTextSize";
// import immutableRecords from "../types/immutableRecords";
// ... plus additional values from constants
const selectItemsDomain = state => state.get('items');
const selectUnitsPerPixel = state => state.get('unitsPerPixel');

const getLabel = item => item.label;
const getTextMaxWidth = () => MAX_ITEM_TEXT_WIDTH

export const cachedCalcTextSize = createSelector(
  getLabel,
  getTextMaxWidth,
  (label, maxWidth) => calcTextSize(label, maxWidth)
)

export const makeSelectItems = createSelector(
  selectItemsDomain,
  selectUnitsPerPixel,
  (selectItemsDomain, selectUnitsPerPixel) => {
    const itemsWithSize = selectItemsDomain.sortBy(item => item.value).map((item) => {
      // const textSize = calcTextSize(item.label, MAX_ITEM_TEXT_WIDTH);
      const textSize = cachedCalcTextSize(item)
      textSize.width = textSize.width + BULLET_WIDTH_INCLUDING_MARGIN;
      return immutableRecords.ItemDisplayRecord().merge(item, textSize);
    });
    const existingItems = [];
    return itemsWithSize.map((item) => {
      const itemWithSizeAndLeft = item.set('left', valueToPixel(item.value, selectUnitsPerPixel)).set('top', 0);
      const finalItem = itemWithSizeAndLeft.set('top', calculateYCoordinate(itemWithSizeAndLeft.toJS(), existingItems));
      existingItems.push(finalItem);
      return finalItem
    })
  }
);



// Convert from a number line value to a pixel location
export const valueToPixel = (value, unitsPerPixel) => value / unitsPerPixel;

// Convert from a pixel location to a number line value
export const pixelToValue = (pixel, unitsPerPixel) => pixel * unitsPerPixel;

// Calculate the spacing for tick marks along the header.
// You do not need to modify this function.
export const getHeaderTickSpacing = (unitsPerPixel) => {
  const minSpacing = MIN_HEADER_TICK_SPACING * unitsPerPixel;
  let selectedSpacing = 1;
  while (selectedSpacing < minSpacing) {
    selectedSpacing *= 2;
    if (selectedSpacing >= minSpacing) {
      break;
    }
    selectedSpacing = selectedSpacing * 5 / 2;
    if (selectedSpacing >= minSpacing) {
      break;
    }
    selectedSpacing *= 2;
  }
  return selectedSpacing;
};

