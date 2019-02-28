import React from "react";
import PropTypes from "prop-types";
import { BULLET_LEFT_OFFSET, ITEM_X_PADDING } from "../constants";

// Draws a bullet and text label with the specified position and size.
// Position is adjusted slightly so that the bullet lines up exactly
// on the specified x position.
class NumberLineItem extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  handleEdit = () => {
    this.props.onSelect(this.props.id)
  };

  handleSubmit = (e) => {
    e.stopPropagation();
    this.props.onEditLabel(this.props.id, this.textInput.current.value);
    this.props.onSelect(null)
  };

  handleDelete = (e) => {
    e.stopPropagation();
    if (confirm('are you sure to delete this item ?')) {
      this.props.onDeleteItem(this.props.id);
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
    const style = {
      left: this.props.left + BULLET_LEFT_OFFSET - ITEM_X_PADDING,
      top: this.props.top,
      width: this.props.width,
    };
    return (
      <div className="numberLineItem" style={style} onClick={this.handleEdit}>
        <div className="numberLineItemBullet" />
        {this.props.selectedItem !== this.props.id
          ?
          <span>{this.props.label}</span>
          :
          <div style={{display: 'flex'}}>
            <textarea type="text" defaultValue={this.props.label} ref={this.textInput} />
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

NumberLineItem.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onEditLabel: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedItem: PropTypes.string,
};

export default NumberLineItem;
