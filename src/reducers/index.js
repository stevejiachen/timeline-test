 import combineReducersImmutable from './combineReducersImmutable';

 import { actionTypes } from "../actions";
 import immutableRecords from "../types/immutableRecords";
 import items from "./itemsReducer";
 import {fromJS} from "immutable";
 
 const unitsPerPixel = (state, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_SCALE:
      return action.newScale;
    default:
      return state;
  }
 }

 const itemActions = (state, action) => {
   switch (action.type) {
     case actionTypes.SELECT_ITEM:
       return state.set('selectedItem', action.item);
     case actionTypes.ADDING_ITEM:
       return state.setIn(['addItemStatus', 'position'], action.data)
         .setIn(['addItemStatus', 'adding'], true);
     case actionTypes.ADDING_ITEM_LABEL:
       return state.setIn(['addItemStatus', 'label'], action.label);
     case actionTypes.CLOSE_INPUT:
       return state.setIn(['addItemStatus', 'adding'], false);
     default:
       return state;
   }
 }

const combinedReducers = combineReducersImmutable(immutableRecords.NumberLineRecord(), {
  unitsPerPixel,
  items,
  itemActions
});

export default combinedReducers;
