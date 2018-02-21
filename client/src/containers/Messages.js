import React, { Component } from "react";
import { get, del, post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

class Messages extends Component {}
export default withRouter(props => <Messages {...props} />);
