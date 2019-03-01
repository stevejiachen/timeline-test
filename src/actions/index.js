import uniqueId from "../utils/uniqueId";

// Note: most of these actions are not actually used in this sample application,
// but are provided as examples.

const CREATE_ITEM = "object:CREATE_ITEM";
const EDIT_LABEL = "object:EDIT_LABEL";
const EDIT_POSITION = "object:EDIT_POSITION";
const CHANGE_SCALE = "numberLine:CHANGE_SCALE";
const DELETE_ITEM = "object:DELETE_ITEM";
const SELECT_ITEM = "object: SELECT_ITEM";
const ADDING_ITEM = "object: ADD_ITEM";
const ADDING_ITEM_LABEL = "object: ADDING_ITEM_LABEL";
const CLOSE_INPUT = "object: CLOSE_INPUT";

export const actionTypes = {
    CREATE_ITEM,
    EDIT_LABEL,
    EDIT_POSITION,
    CHANGE_SCALE,
    DELETE_ITEM,
    SELECT_ITEM,
    ADDING_ITEM,
    ADDING_ITEM_LABEL,
    CLOSE_INPUT,
};

const createItem = (label, value) => {
  return {
    type: CREATE_ITEM,
    id: uniqueId(),
    label,
    value,
  };
};

const addingItem = (data) => {
  return {
    type: ADDING_ITEM,
    data
  }
};

const editLabel = (id, label) => {
  return {
    type: EDIT_LABEL,
    id,
    label
  };
};

const editPosition = (id, value, position) => {
    return {
      type: EDIT_POSITION,
      id,
      value,
      position
    };
  };

  const changeScale = newScale => {
    return {
      type: CHANGE_SCALE,
      newScale
    };
  };

  const deleteItem = id => {
    return {
      type: DELETE_ITEM,
      id,
    }
  };

  const selectItem = item => {
    return {
      type: SELECT_ITEM,
      item,
    }
  };

  const addingItemLabel = label => {
    return {
      type: ADDING_ITEM_LABEL,
      label
    }
  };

  const closeInput = () => {
    return {
      type: CLOSE_INPUT
    }
  };

  const submitAddingItem = () => {
    return (dispatch, getState) => {
      const addingItemLabel = getState().getIn(['itemActions', 'addItemStatus', 'label']);
      const addingItemValue = getState().getIn(['itemActions', 'addItemStatus', 'position', 'value']);
      dispatch(createItem(addingItemLabel, addingItemValue));
      dispatch(closeInput())

    };
  };

export default {
  createItem,
  editLabel,
  editPosition,
  changeScale,
  deleteItem,
  selectItem,
  addingItem,
  addingItemLabel,
  submitAddingItem,
  closeInput,
};
