import React, { Component } from "react";
import { del } from "../services/request.service";
import { withRouter } from "react-router-dom";

class DeleteButton extends Component {
  state = {
    showModal: false
  };
  delete = item => {
    this.setState({ showModal: true });
    // del(this.props.deletePath).then(() => {
    //   this.props.history.push("/setProfil/"
    // })
  };

  render() {
    return (
      <button onClick={item => this.delete(item)}>{this.props.text}</button>
    );
  }
}

export default withRouter(props => <DeleteButton {...props} />);
