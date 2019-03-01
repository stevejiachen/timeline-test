import { actionTypes } from "../actions";
import immutableRecords from "../types/immutableRecords";

// Note: Nothing within this reducer is actually exercised by the sample application,
// but are provided here as examples.

// The shape of items in the redux store is defined in types/immutableTypes.

// The state passed into reducer(...) here is an immutable.Map structure where:
// - the key is the ID for the item
// - the value is an ItemRecord object.
// This structure allows for fast O(1) lookup of items to access inside this reducer.

const createNewItem = (id, label, value) =>
  immutableRecords.ObjectRecord({
    id,
    label,
    value,
  });

const reducer = (state = Map(), action) => {
  switch (action.type) {
    case actionTypes.CREATE_ITEM:
      return state.set(action.id, createNewItem(action.id, action.label, action.value))
    case actionTypes.EDIT_LABEL: {
      return state.setIn([action.id, "label"], action.label);
    }
    case actionTypes.EDIT_POSITION: {
      return state.setIn([action.id, "label"], action.position);
    }
    case actionTypes.DELETE_ITEM: {
        return state.filter((item) => item.id !== action.id)
    }
      default:
        return state;
    }
  };

  export default reducer;
