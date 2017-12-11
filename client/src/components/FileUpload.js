import React, { Component } from 'react';
import { post } from '../services/request.service';
import { withRouter } from 'react-router-dom';
import 'whatwg-fetch';

class FileUpload extends Component {
  state = {
    file: '',
    imagePreviewUrl: ''
  };

  handleImageChange = event => {
    let file = event.target.files[0];

    const reader = new FileReader();

    reader.onloadend = () => {
      this.setState({ file: file, imagePreviewUrl: reader.result });
    };

    reader.readAsDataURL(file);
    this.props.onChange(event);
  };

  render() {
    return (
      <div>
        <input type="file" onChange={e => this.handleImageChange(e)} />
        <div>
          <img src={this.state.imagePreviewUrl} />
        </div>
      </div>
    );
  }
}

export default FileUpload;
