import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NumberLineHeader from "./NumberLineHeader";
import NumberLineItem from "./NumberLineItem";

import "../styles/base.scss";
import "./NumberLine.scss";
import {getAddItemStatus, getCurrentSelectedItem, getHeaderTickSpacing, makeSelectItems} from "./selectors";
import actions from "../actions";
import { MIN_HEADER_TICK_SPACING, VERTICAL_ITEM_SPACING } from "../constants";

const NumberLineView = props => {
  // Convert the passed in props.items into NumberLineItem
  // and also calculate the maximumValue so we know how far
  // to render the header.
  let maximumValue = 0;
  const itemComponents = props.items.map(it => {
    maximumValue = Math.max(maximumValue, it.value);
    return <NumberLineItem
      key={it.id}
      id={it.id}
      item={it}
      value={it.value}
      left={it.left}
      width={it.width}
      top={it.top}
      label={it.label}
      onDeleteItem={props.onDeleteItem}
      onEditLabel={props.onEditLabel}
      onSelect={props.onSelect}
      selectedItem={props.selectedItem}
    />;
  }).toList();
  maximumValue += props.tickSpacing;

  // Work out the scale drop down value based on unitsPerPixel
  const dropdownValue = props.unitsPerPixel * MIN_HEADER_TICK_SPACING;

  // Manually set the height of the items canvas
  const itemsStyle = {
    height: `${props.height + VERTICAL_ITEM_SPACING}px`
  };

  const handleAdd = (e) => {
    const offset = {top: 60, left:20};
    const left = e.pageX - offset.left;
    const top = e.pageY - offset.top;
    const value = Math.round(left * 0.02);
    props.onAddingItem({left, top, value});
  };

  const newInputPosition = {
    position: 'absolute',
    left: props.addItemStatus.getIn(['position', 'left']),
    top: props.addItemStatus.getIn(['position', 'top']),
  };

  const handleKeyPress = (e) => {
    if (!props.addItemStatus.get('label') && e.key === 'Enter') {
      props.onCloseInput();
      return
    }
    if (e.key === 'Enter') {
      props.onSubmitAddingItem()
    }
  };

  const handleChange = (e) => {
    props.onAddingItemLabel(e.target.value)
  };

  // Render the view, including:
  //  - scale dropdown at the top
  //  - number line header along the top
  //  - calculated items (above)
  return (
    <div className="numberLineView" onClick={handleAdd}>
      <div className="numberLineSettings">
        <span>Scale:</span>
        <select value={dropdownValue} onChange={e => props.onChangeScale(e.target.value / MIN_HEADER_TICK_SPACING)}>
          <option>1</option>
          <option>2</option>
          <option>5</option>
          <option>10</option>
        </select>
      </div>
      <div className="numberLineCanvas">
        <NumberLineHeader maximum={maximumValue} unitsPerPixel={props.unitsPerPixel} tickSpacing={props.tickSpacing} onChangeScale={props.onChangeScale} />
        <div className="numberLineItems" style={itemsStyle}>
            {itemComponents}
        </div>
        {
         props.addItemStatus.get('adding') &&
          <textarea
            type="text"
            style={{...newInputPosition}}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            onKeyPress={handleKeyPress}
            onChange={handleChange}
          />
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  // Task 1: Modify to derive items from redux store ("state" parameter)

  const items = makeSelectItems(state);

  const unitsPerPixel = state.unitsPerPixel;
  const tickSpacing = getHeaderTickSpacing(unitsPerPixel);

  // Task 1: modify to calculate a correct height
  const itemHeights = items.map((item) => item.top + item.height).toList();
  const height = Math.max(...itemHeights.toJS());

  const selectedItem = getCurrentSelectedItem(state);

  const addItemStatus  = getAddItemStatus(state);

  return {
      items,
      unitsPerPixel,
      tickSpacing,
      height,
      selectedItem,
      addItemStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeScale: scale => {
      dispatch(actions.changeScale(scale));
    },
    onDeleteItem: id => {
      dispatch(actions.deleteItem(id));
    },
    onEditLabel: (id, label) => {
      dispatch(actions.editLabel(id, label))
    },
    onSelect: (item) => {
      dispatch(actions.selectItem(item))
    },
    onAddingItem: (data) => {
      dispatch(actions.addingItem(data))
    },
    onAddingItemLabel: (label) => {
      dispatch(actions.addingItemLabel(label))
    },
    onSubmitAddingItem: () => dispatch(actions.submitAddingItem()),
    onCloseInput: () => dispatch(actions.closeInput()),
  };
};

NumberLineView.propTypes = {
  unitsPerPixel: PropTypes.number.isRequired,
  tickSpacing: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  items: PropTypes.any.isRequired,
  onChangeScale: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onEditLabel: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedItem: PropTypes.object,
  onAddingItem: PropTypes.func.isRequired,
  addItemStatus: PropTypes.object,
  onAddingItemLabel: PropTypes.func.isRequired,
  onSubmitAddingItem: PropTypes.func.isRequired,
  onCloseInput: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumberLineView);
