import React, { Component } from "react";

class FileUpload extends Component {
  state = {
    file: "",
    imagePreviewUrl: ""
  };

  handleImageChange = event => {
    let file = event.target.files[0];

    const reader = new FileReader();

    reader.onloadend = () => {
      this.setState({ file: file, imagePreviewUrl: reader.result });
    };

    reader.readAsDataURL(file);
    this.props.onChange(file);
  };

  render() {
    return (
      <div>
        <input type="file" onChange={e => this.handleImageChange(e)} />
        {this.state.imagePreviewUrl && (
          <div>
            <img
              style={{ width: 200 + "px", height: "auto" }}
              src={this.state.imagePreviewUrl}
              alt="avatar"
            />
          </div>
        )}
      </div>
    );
  }
}

export default FileUpload;
