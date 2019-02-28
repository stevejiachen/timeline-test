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

  handleSubmit = (e) => {
    e.stopPropagation()
    this.setState({editing: false}, this.props.onEditLabel(this.props.item.id, this.textInput.current.value));
  }
  render() {
    const {item} = this.props;
    const style = {
      left: item.left + BULLET_LEFT_OFFSET - ITEM_X_PADDING,
      top: item.top,
      width: item.width,
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
            <textarea type="text" ref={this.textInput} defaultValue={item.label} />
            <div>
              <button onClick={() => this.props.onDeleteItem(item.id)}>X</button>
              <button onClick={this.handleSubmit}>Submit</button>
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
