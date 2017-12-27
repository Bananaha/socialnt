import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import RequestPasswordForm from "../components/RequestPasswordForm";
import ChangePasswordForm from "../components/ChangePasswordForm";

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
    console.log(this.state);
    return (
      <div>
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
