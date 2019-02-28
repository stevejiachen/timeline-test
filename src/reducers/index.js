 import combineReducersImmutable from './combineReducersImmutable';

 import { actionTypes } from "../actions";
 import immutableRecords from "../types/immutableRecords";
 import items from "./itemsReducer";
 
 const unitsPerPixel = (state, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_SCALE:
      return action.newScale;
    default:
      return state;
  }
 }

 const selectedItem = (state, action) => {
   switch (action.type) {
     case actionTypes.SELECT_ITEM:
       return action.id;
     default:
       return state;
   }
 }

const combinedReducers = combineReducersImmutable(immutableRecords.NumberLineRecord(), {
  unitsPerPixel,
  items,
  selectedItem
});

export default combinedReducers;
