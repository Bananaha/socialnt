import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import AlertModal from "./AlertModal";

class DeleteButton extends Component {
  state = {
    showModal: false,
    item: null
  };
  requestConfirmation = event => {
    console.log(event.target);
    this.setState({ showModal: true });
  };

  getConfirmation = response => {
    this.setState({ showModal: false });

    if (response === "true") {
      this.props.delete();
    } else {
      return;
    }
  };

  render() {
    return (
      <div>
        {this.state.showModal && (
          <AlertModal
            text={this.props.alertText}
            getUserConfirmation={this.getConfirmation}
          />
        )}
        <button
          className="button button--small"
          onClick={this.requestConfirmation}
        >
          {this.props.buttonText}
        </button>
      </div>
    );
  }
}

export default withRouter(props => <DeleteButton {...props} />);
