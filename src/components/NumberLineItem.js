import React from "react";
import PropTypes from "prop-types";
import { BULLET_LEFT_OFFSET, ITEM_X_PADDING } from "../constants";

// Draws a bullet and text label with the specified position and size.
// Position is adjusted slightly so that the bullet lines up exactly
// on the specified x position.
class NumberLineItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    }
  }

  handleSubmit = (e) => {
    e.stopPropagation()
    this.setState({editing: false});
  }
  handleChange = (e, id) => {
    this.props.onEditLabel(id, e.target.value)
  }
  render() {
    const style = {
      left: this.props.left + BULLET_LEFT_OFFSET - ITEM_X_PADDING,
      top: this.props.top,
      width: this.props.width,
      zIndex: this.state.editing && 1000
    };
    return (
      <div className="numberLineItem" style={style} onClick={() => this.setState({editing: true})}>
        <div className="numberLineItemBullet" />
        {!this.state.editing
          ?
          <span>{this.props.label}</span>
          :
          <div style={{display: 'flex'}}>
            <textarea type="text" value={this.props.label} onChange={(e) => this.handleChange(e, this.props.id)}/>
            <div>
              <button onClick={() => this.props.onDeleteItem(this.props.id)}>X</button>
              <button onClick={this.handleSubmit}>Submit</button>
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
};

export default NumberLineItem;
