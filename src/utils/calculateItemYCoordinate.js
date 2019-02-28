const itemsOverlap = (item1, item2) => {
  if (item1.left >= (item2.left + item2.width)) {
    return false;
  } else if ((item1.height + item1.top) <= item2.top) {
    return false
  } else if (item1.top >= (item2.top + item2.height)) {
    return false
  } else if ((item1.left + item1.width) < item2.left) {
    return false
  }
  return true;
};

const calculateYCoordinate = (item, existingItems) => {
  let y = 0;
  let currentItem = item;
  let overlapWithAtLeastOneItem = false;
  existingItems.forEach((existingItem) => {
    if (itemsOverlap(currentItem, existingItem)) {
      y += existingItem.height ;
      currentItem.top = currentItem.top + existingItem.height;
      // return true;
      overlapWithAtLeastOneItem = true;
    }
  });
  if (overlapWithAtLeastOneItem) {
    y += calculateYCoordinate(currentItem, existingItems)
  }
  return y;
};

export default calculateYCoordinate;
