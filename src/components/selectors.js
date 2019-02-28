import { createSelector } from 'reselect'
import {
  BULLET_WIDTH_INCLUDING_MARGIN,
  MAX_ITEM_TEXT_WIDTH,
  MIN_HEADER_TICK_SPACING, MIN_HORIZONTAL_SPACING, VERTICAL_ITEM_SPACING,
} from "../constants";
import immutableRecords from "../types/immutableRecords";
import calcTextSize from "../utils/calcTextSize";
import calculateYCoordinate from '../utils/calculateItemYCoordinate';

// Task 1 - you may need some of these additional imports...
// import calcTextSize from "../utils/calcTextSize";
// import immutableRecords from "../types/immutableRecords";
// ... plus additional values from constants\
export const selectUnitsPerPixel = state => state.get('unitsPerPixel');
export const getItemById = (state, props) => state.get('items').get(props.id);
export const getTextMaxWidth = () => MAX_ITEM_TEXT_WIDTH;
export const getItems = (state) => state.get('items').sortBy(item => item.value);
export const getItemWithSize = (state, props) => props;

const existingItems = [];

export const makeSelectItemWithSize = () => {
  return createSelector(
    [getItemById, getTextMaxWidth],
    (item, maxWidth) => {
      const textSize = calcTextSize(item.label, maxWidth);
      textSize.width = textSize.width + BULLET_WIDTH_INCLUDING_MARGIN + MIN_HORIZONTAL_SPACING;
      textSize.height = textSize.height + VERTICAL_ITEM_SPACING;
      return immutableRecords.ItemDisplayRecord().merge(item, textSize);
    }
  )
};


export const makeSelectItemFinal = () => {
  return createSelector(
    [getItems, getItemWithSize, selectUnitsPerPixel],
    (items, item, unitsPerPixel) => {
      const itemWithSizeAndLeft = item.set('left', valueToPixel(item.value, unitsPerPixel)).set('top', 0);
      const finalItem = itemWithSizeAndLeft.set('top', calculateYCoordinate(itemWithSizeAndLeft.toJS(), existingItems));
      existingItems.push(finalItem);
      const lastItemValue = items.last().value;
      if (finalItem.value === lastItemValue) {
        existingItems.length = 0
      }
      return finalItem
    }
  )
};

export const getExistingItems = () => existingItems;

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

