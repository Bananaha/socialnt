import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class AlertModal extends Component {
  render() {
    return (
      <div>
        <p>{this.props.AlertText}</p>
        <button onClick={this.props.getUserConfirmation(true)}>Oui</button>
        <button onClick={this.progetUserConfirmation(true)}>Annuler</button>
      </div>
    );
  }
}

export default withRouter(props => <AlertModal {...props} />);
