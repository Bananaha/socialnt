import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../styles/AlertModal.css";

class AlertModal extends Component {
  getUserConfirmation = event => {
    this.props.getUserConfirmation(event.target.value);
  };

  render() {
    return (
      <div className="AlertModal">
        <div className="card AlertModal__content">
          <p className="AlertModal__text">{this.props.text}</p>
          <div className="AlertModal__actions">
            <button
              className="button button--small"
              value="false"
              onClick={event => this.getUserConfirmation(event)}
            >
              Annuler
            </button>
            <button
              className="button button--small"
              value="true"
              onClick={event => this.getUserConfirmation(event)}
            >
              Oui
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(props => <AlertModal {...props} />);
