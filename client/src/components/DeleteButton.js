import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class DeleteButton extends Component {
  delete = item => {
    this.props.onClick(item);
  };

  render() {
    return (
      <button onClick={item => this.delete(item)}>{this.props.text}</button>
    );
  }
}

export default withRouter(props => <DeleteButton {...props} />);
