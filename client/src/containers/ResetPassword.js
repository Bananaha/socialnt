import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import RequestPasswordForm from "../components/RequestPasswordForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import "../styles/ResetPassword.css";

class ResetPassword extends Component {
  state = {
    showRequestPassword: true
  };

  componentWillMount() {
    if (this.props.match.params.token) {
      this.setState({
        showRequestPassword: false
      });
    }
  }

  render() {
    return (
      <div className="ResetPassword">
        {this.state.showRequestPassword ? (
          <RequestPasswordForm />
        ) : (
          <ChangePasswordForm />
        )}
      </div>
    );
  }
}
export default withRouter(props => <ResetPassword {...props} />);
