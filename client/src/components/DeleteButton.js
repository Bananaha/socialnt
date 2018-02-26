import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import AlertModal from "./AlertModal";
import { SmallButton } from "../styles/common";

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
            text="Etes vous de vouloir supprimer votre profil ?"
            getUserConfirmation={this.getConfirmation}
          />
        )}
        <SmallButton onClick={this.requestConfirmation}>
          {this.props.text}
        </SmallButton>
      </div>
    );
  }
}

export default withRouter(props => <DeleteButton {...props} />);
