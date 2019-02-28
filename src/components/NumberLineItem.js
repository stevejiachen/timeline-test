import React from "react";
import PropTypes from "prop-types";
import { BULLET_LEFT_OFFSET, ITEM_X_PADDING } from "../constants";
import connect from "react-redux/es/connect/connect";
import {
  getHeaderTickSpacing,
  makeSelectItemFinal,
  makeSelectItemWithSize
} from "./selectors";
import actions from "../actions";
import mapStateToProps from "react-redux/es/connect/mapStateToProps";

// Draws a bullet and text label with the specified position and size.
// Position is adjusted slightly so that the bullet lines up exactly
// on the specified x position.
class NumberLineItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    }
    this.textInput = React.createRef();
  }

  handleEdit = () => {
    this.props.onSelect(this.props.id)
  };

  handleSubmit = (e) => {
    e.stopPropagation();
    this.props.onEditLabel(this.props.item.id, this.textInput.current.value);
    this.props.onSelect(null)
  };

  handleDelete = (e) => {
    e.stopPropagation();
    if (confirm('are you sure to delete this item ?')) {
      this.props.onDeleteItem(this.props.item.id);
      this.props.onSelect(null)
    } else {
      this.props.onSelect(null)
    }
  };

  handleCancel = (e) => {
    e.stopPropagation();
    this.props.onSelect(null)
  }

  render() {
    const {item} = this.props;
    const style = {
      left: item.left + BULLET_LEFT_OFFSET - ITEM_X_PADDING,
      top: item.top,
      width: item.width,
    };
    return (
      <div className="numberLineItem" style={style} onClick={this.handleEdit}>
        <div className="numberLineItemBullet" />
        {this.props.selectedItem !== item.id
          ?
          <span>{item.label}</span>
          :
          <div style={{display: 'flex'}}>
            <textarea type="text" defaultValue={item.label} ref={this.textInput} />
            <div style={{width: 100}}>
              <button onClick={this.handleSubmit}>Save</button>
              <button onClick={this.handleDelete}>Delete</button>
              <button onClick={this.handleCancel}>X</button>
            </div>
          </div>
        }
      </div>
    );
  }
}

const makeMapStateToProps = () => {
  // Task 1: Modify to derive items from redux store ("state" parameter)
  const selectItem = makeSelectItemWithSize();
  const selectItemFinal = makeSelectItemFinal();
  const mapStateToProps = (state, props) => {
    const itemWithSize = selectItem(state, props);
    return {
      item: selectItemFinal(state, itemWithSize)
    }
  }
  return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDeleteItem: id => {
      dispatch(actions.deleteItem(id));
    },
    onEditLabel: (id, label) => {
      dispatch(actions.editLabel(id, label))
    },
    onSelect: (id) => {
      dispatch(actions.selectItem(id))
    }
  };
};

NumberLineItem.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onEditLabel: PropTypes.func.isRequired,
};

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(NumberLineItem);
