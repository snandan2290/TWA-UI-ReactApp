import React, { Component } from "react";
import { connect } from "react-redux";
import { addProcess } from "../../actions/masterDataAction";
import TextInput from "../../components/common/textInput";
import checkValidFileFormat from "../../utils/checkValidFileFormat";
import MessageModal from "../../components/common/messageModal";

class CreateEditOperation extends Component {
  state = {
    operationId: "",
    name: "",
    code: "",
    showErrorDiv: false,
    errors: [],
    instructionFile: null,
    fileName: "",
    showMessageDiv: false
  };

  handleValidation() {
    let name = this.state.name;
    let code = this.state.code;
    let errors = [];
    let formIsValid = true;

    if (name.match(/^\s+|\s+$/)) {
      formIsValid = false;
      errors.push("Operation Name space not allowed");
    }

    if (!name) {
      formIsValid = false;
      errors.push("Please enter Operation Name");
    }

    if (code.match(/^\s+|\s+$/g)) {
      formIsValid = false;
      errors.push("Operation Code space not allowed");
    }

    if (!code) {
      formIsValid = false;
      errors.push("Please enter Operation Code");
    }

    if (!this.state.fileName) {
      formIsValid = false;
      errors.push("Please upload the Instructions file");
    }

    if (formIsValid === false) {
      this.setState({
        errors: errors,
        showErrorDiv: true
      });
    }
    return formIsValid;
  }

  onDataChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onChangeFileHandler = e => {
    let validFileExt = ["doc", "xlsx", "xls", "docx", "pdf"];
    if (checkValidFileFormat(validFileExt, e.target.files[0].name)) {
      this.setState({
        instructionFile: e.target.files[0],
        fileName: e.target.files[0].name,
        errors: [],
        showErrorDiv: false
      });
    } else {
      this.setState({
        errors: ["Please upload file with formats: " + validFileExt.join(", ")],
        showErrorDiv: true
      });
    }
  };

  componentDidMount() {
    if (this.props.dataForEdit != null) {
      let { dataForEdit } = this.props;
      let value = dataForEdit.instruction[0].fileLocation;
      let fileName = value.substring(value.lastIndexOf("\\") + 1);
      this.setState({
        operationId: dataForEdit.id,
        code: dataForEdit.code,
        name: dataForEdit.name,
        fileName: fileName
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.OperationData.errorInProcessing) {
      let errors = ["Unable to save the data"];
      if (
        nextProps.OperationData.errorInProcessing != null &&
        nextProps.OperationData.errorInProcessing.data != null
      ) {
        errors = [nextProps.OperationData.errorInProcessing.data.message];
      }
      this.setState({
        errors: errors,
        showErrorDiv: true
      });
    }

    if (nextProps.OperationData.saveOperationSuccessFully) {
      let message = "Operation added successfully";
      if (this.props.dataForEdit !== null) {
        message = "Operation updated successfully";
      }
      this.setState({
        showMessageDiv: true,
        messageValue: message
      });
    }
  }

  onSubmitHandler = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      const formData = new FormData();
      formData.append("code", this.state.code.toUpperCase());
      formData.append("name", this.state.name);
      formData.append("instructionFile", this.state.instructionFile);
      if (this.state.componentId !== null) {
        formData.append("id", this.state.operationId);
      }
      this.props.addProcess(formData);
    }
  };

  clearFileHandler = e => {
    e.preventDefault();
    this.setState({
      fileName: ""
    });
  };

  onModalCloseHandler = () => {
    this.props.handleCloseCreateEditOperation();
  };

  render() {
    let error = this.state.errors;
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
            handleOkClick={this.onModalCloseHandler}
          />
        ) : null}
        <div className="tn-tabs tn-bg px-4 tabComponentBorder">
          <div className="row">
            <div
              className="close tn-close"
              onClick={this.props.handleCloseCreateEditOperation}
            >
              <i className="close icon" />
            </div>

            <div className="col-12 my-4">
              <div className="float-left d-flex h-100 align-items-center">
                <h1 className="m-0 p-0 tn-font-21">
                  {this.props.dataForEdit === null
                    ? "Add Operation"
                    : "Edit Operation"}
                </h1>
              </div>
            </div>

            {this.state.showErrorDiv === true ? (
              <div className="col-12 my-2" style={{ color: "red" }}>
                {errorBinding}
              </div>
            ) : null}

            <form onSubmit={this.onSubmitHandler}>
              <div className="w-100">
                <div className="row m-0">
                  <div className="col-6 my-2">
                    <label>Operation Name</label>
                    <div className="ui fluid form">
                      <TextInput
                        type="text"
                        name="name"
                        placeholder="Operation Name"
                        value={this.state.name}
                        onChange={this.onDataChangeHandler}
                      />
                    </div>
                  </div>

                  <div className="col-6 my-2">
                    <label>Operation Code</label>
                    <div className="ui fluid form">
                      <TextInput
                        type="text"
                        name="code"
                        placeholder="Operation Code"
                        value={this.state.code}
                        onChange={this.onDataChangeHandler}
                      />
                    </div>
                  </div>

                  <hr className="w-100" />
                  <div className="col-12 my-2">General Instructions (GI)</div>
                  <div className="col-12">
                    <div className="row" id="pluss">
                      <div className="col-4 my-1">
                        <div className="tn-lh tn-font-13">
                          {this.state.fileName
                            ? this.state.fileName
                            : "No file selected"}
                        </div>
                      </div>

                      <div className="col-6">
                        <label className="uploadBtnWrap" htmlFor="thefile">
                          <input
                            type="file"
                            id="thefile"
                            name="instructionFile"
                            onChange={this.onChangeFileHandler}
                          />
                          <span className="btn p-0">
                            <i className="icon upload tn-upload" />
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 text-center my-3">
                    <button className="ui basic button tn-btn-primary">
                      Save
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

const mapStateToProps = state => ({
  OperationData: state.OperationData
});

export default connect(
  mapStateToProps,
  { addProcess }
)(CreateEditOperation);
