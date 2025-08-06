import React, { Component } from "react";
import {
  getAllVariants,
  uploadVariantFile,
} from "../../actions/masterDataAction";
import MessageModal from "../common/messageModal";
import { connect } from "react-redux";
import checkValidFileFormat from "../../utils/checkValidFileFormat";

export class UploadFile extends Component {
  constructor() {
    super();
    this.fileInputRef = React.createRef();
    this.state = {
      fileName: null,
      showErrorDiv: false,
      showMessageDiv: false,
      messageValue: "",
      errorsList: [],
      callBackMethod: this.onModalCloseHandler,
      showConfirmModalDiv: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("here in comp rec props variant");
    if (nextProps.dataProps.uploadVariantSuccess) {
      console.log("inside of the props variant");
      let data = nextProps.dataProps.uploadVariantSuccess;
      let message = (
        <React.Fragment>
          <div>The number of new Components added: {data["newComponent"]}</div>{" "}
          <div>The number of new Variants added: {data["newVariant"]}</div>{" "}
          <div>The Number of existing Components: {data["oldComponent"]}</div>{" "}
          <div>The number of existing Variants: {data["oldVariant"]}</div>
        </React.Fragment>
      );
      this.setState({
        showMessageDiv: true,
        callBackMethod: this.onModalCloseHandler,
        messageValue: message,
      });
    }

    if (nextProps.dataProps.errorInProcessing) {
      let errors = [];
      errors.push("Unable to Upload the file");
      this.setState({ showErrorDiv: true, errorsList: errors });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.someProp !== this.props.someProp) {
      console.log("Props changed!", this.props.someProp);
    }
  }

  onModalCloseHandler = () => {
    this.props.handleCloseUploadVariant();
  };
  onChangeHandler = (e) => {
    this.setState({
      fileName: e.target.files[0],
      showErrorDiv: false,
      errorsList: [],
    });
  };

  isValidateFile = () => {
    let validFileExt = ["xlsx", "xls"];
    let errors = [];
    let isValidFile = true;
    if (this.state.fileName === null) {
      isValidFile = false;
      errors.push("Please select a file to upload");
      this.setState({ showErrorDiv: true, errorsList: errors });
    } else if (!checkValidFileFormat(validFileExt, this.state.fileName.name)) {
      isValidFile = false;
      errors.push(
        "Please upload file with formats: " + validFileExt.join(", ")
      );
      this.setState({ showErrorDiv: true, errorsList: errors });
    }
    return isValidFile;
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    if (this.isValidateFile()) {
      const variantFile = new FormData();
      let user = localStorage.getItem("user");
      user = JSON.parse(user);
      variantFile.append("locationId", user.locationId);
      variantFile.append("files", this.state.fileName);
      this.props.uploadVariantFile(variantFile);
    }
  };

  handleClearFile = () => {
    this.setState({ fileName: null, showErrorDiv: false, errorsList: [] });
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = ""; // <-- Clear file input value
    }
  };

  render() {
    let error = this.state.errorsList;
    let errorBinding;

    if (error.length !== 0) {
      errorBinding = error.map((res, i) => {
        return <ul key={i + 1}>{res ? <li>{res}</li> : ""}</ul>;
      });
    } else {
      errorBinding = null;
    }
    return (
      <div className="col-12 col-md-12 col-lg-6 mb-4">
        {this.state.showMessageDiv ? (
          <MessageModal
            isOpen={true}
            message={this.state.messageValue}
            handleOkClick={this.state.callBackMethod}
          />
        ) : null}
        <div className="tn-tabs tn-bg px-4">
          <div className="row">
            <div
              className="close tn-close"
              onClick={this.props.handleCloseUploadVariant}
            >
              <i className="close icon" />
            </div>

            <div className="col-12 my-4">
              <div className="float-left d-flex h-100 align-items-center">
                <h1 className="m-0 p-0 tn-font-21">Bulk upload for Component and Variant</h1>
              </div>
            </div>
            {this.state.showErrorDiv === true ? (
              <div className="col-12 my-2" style={{ color: "red" }}>
                {errorBinding}
              </div>
            ) : null}

            <form onSubmit={this.onSubmitHandler} className="w-100">
              <div
                className="w-100"
                style={{ overflow: "auto", height: "350px" }}
              >
                <div className="row m-0">
                  <div className="col-12 my-2">
                    <label>Please Choose File</label>
                    <div class="ui fluid form">
                      <input
                        type="file"
                        name="fileName"
                        className="tn-input"
                        onChange={this.onChangeHandler}
                        ref={this.fileInputRef}
                      />
                    </div>
                  </div>

                  <div className="col-12 text-center my-3">
                    <button
                      type="submit"
                      className="ui basic button tn-btn-primary float-right"
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      className="ui basic button tn-btn-primary float-left"
                      onClick={this.handleClearFile}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  dataProps: state.VariantData,
  auth: state.auth,
});

export default connect(mapStateToProps, { getAllVariants, uploadVariantFile })(
  UploadFile
);
