import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import AlertModal from "./AlertModal";

class DeleteButton extends Component {
  state = {
    showModal: false,
    item: null
  };
  requestConfirmation = item => {
    this.setState({ showModal: true });
  };

  getConfirmation = response => {
    console.log(response);
    this.setState({ showModal: false });
    if (!response) {
      return;
    }
    this.props.deleteProfil;
  };

  render() {
    return (
      <div>
        <button onClick={this.requestConfirmation}>{this.props.text}</button>
        {this.state.showModal ? (
          <AlertModal
            text="Etes vous de vouloir supprimer votre profil ?"
            getUserConfirmation={this.getConfirmation}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withRouter(props => <DeleteButton {...props} />);
