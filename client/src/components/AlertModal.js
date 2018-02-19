import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class AlertModal extends Component {
  getUserConfirmation = event => {
    console.log(event.target.value);
    this.props.getUserConfirmation(event.target.value);
  };

  render() {
    return (
      <div>
        <p>{this.props.text}</p>
        <button value="true" onClick={event => this.getUserConfirmation(event)}>
          Oui
        </button>
        <button
          value="false"
          onClick={event => this.getUserConfirmation(event)}
        >
          Annuler
        </button>
      </div>
    );
  }
}

export default withRouter(props => <AlertModal {...props} />);
