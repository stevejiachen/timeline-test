import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NumberLineHeader from "./NumberLineHeader";
import NumberLineItem from "./NumberLineItem";

import "../styles/base.scss";
import "./NumberLine.scss";
import {getCurrentSelectedItem, getHeaderTickSpacing, getItems} from "./selectors";
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
      value={it.value}
      selectedItem={props.selectedItem}
    />;
  }).toList();
  maximumValue += props.tickSpacing;

  // Work out the scale drop down value based on unitsPerPixel
  const dropdownValue = props.unitsPerPixel * MIN_HEADER_TICK_SPACING;

  // Manually set the height of the items canvas
  const itemsStyle = {
    height: `500px`
  };

  // Render the view, including:
  //  - scale dropdown at the top
  //  - number line header along the top
  //  - calculated items (above)
  return (
    <div className="numberLineView">
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
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  // Task 1: Modify to derive items from redux store ("state" parameter)

  const items = getItems(state);

  const unitsPerPixel = state.unitsPerPixel;
  const tickSpacing = getHeaderTickSpacing(unitsPerPixel);

  // Task 1: modify to calculate a correct height
  const itemHeights = items.map((item) => item.top + item.height).toList();
  const height = Math.max(...itemHeights.toJS());

  const selectedItem = getCurrentSelectedItem(state);

  return {
      items,
      unitsPerPixel,
      tickSpacing,
      height,
      selectedItem,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeScale: scale => {
      dispatch(actions.changeScale(scale));
    },
  };
};

NumberLineView.propTypes = {
  unitsPerPixel: PropTypes.number.isRequired,
  tickSpacing: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  items: PropTypes.any.isRequired,
  onChangeScale: PropTypes.func.isRequired,
  selectedItem:  PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumberLineView);
