import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import immutable from "immutable";
import {
  BULLET_WIDTH_INCLUDING_MARGIN,
  MAX_ITEM_TEXT_WIDTH,
  MIN_HEADER_TICK_SPACING, VERTICAL_ITEM_SPACING,
} from "../constants";
import immutableRecords from "../types/immutableRecords";
import calcTextSize from "../utils/calcTextSize";
import calculateYCoordinate from '../utils/calculateItemYCoordinate';

// Task 1 - you may need some of these additional imports...
// import calcTextSize from "../utils/calcTextSize";
// import immutableRecords from "../types/immutableRecords";
// ... plus additional values from constants
const selectItems = state => state.get('items');
const selectItemsOrdered = state => state.get('items').sortBy(item => item.value);
const selectUnitsPerPixel = state => state.get('unitsPerPixel');

export const getItemById = (items, id) => items.get(id);
const getTextMaxWidth = () => MAX_ITEM_TEXT_WIDTH;

export const getCurrentSelectedItem = (state) => state.get('selectedItem');

export const createCachedCalcTextSize = createCachedSelector(
  getItemById,
  getTextMaxWidth,
  (item, maxWidth) => calcTextSize(item.label, maxWidth)
)(
  (items, id) => id
);


export const makeSelectItems = createSelector(
  selectItemsOrdered,
  selectUnitsPerPixel,
  (items, selectUnitsPerPixel) => {
    const itemsWithSize = items.map((item) => {
      const textSize = createCachedCalcTextSize(items, item.id);
      const copiedTextSize = {...textSize};
      copiedTextSize.width = copiedTextSize.width + BULLET_WIDTH_INCLUDING_MARGIN;
      copiedTextSize.height = copiedTextSize.height + VERTICAL_ITEM_SPACING;
      return immutableRecords.ItemDisplayRecord().merge(item, copiedTextSize);
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

