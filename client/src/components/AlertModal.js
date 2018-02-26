import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card, SmallButton } from "../styles/common";
import styled from "styled-components";

const Text = styled.p`
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;

  > button {
    width: 80px;
  }
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);

  > div {
  }
`;

export const ModalContent = Card.extend`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
class AlertModal extends Component {
  getUserConfirmation = event => {
    console.log(event.target.value);
    this.props.getUserConfirmation(event.target.value);
  };

  render() {
    return (
      <Modal>
        <ModalContent>
          <Text>{this.props.text}</Text>
          <Actions>
            <SmallButton
              value="false"
              onClick={event => this.getUserConfirmation(event)}
            >
              Annuler
            </SmallButton>
            <SmallButton
              value="true"
              onClick={event => this.getUserConfirmation(event)}
            >
              Oui
            </SmallButton>
          </Actions>
        </ModalContent>
      </Modal>
    );
  }
}

export default withRouter(props => <AlertModal {...props} />);
