import React, { Component } from "react";
import TextInput from "../common/textInput";
import { connect } from "react-redux";
import { addComponents } from "../../actions/masterDataAction";
import checkValidFileFormat from "../../utils/checkValidFileFormat";
import MessageModal from "../../components/common/messageModal";
import { Dropdown } from "semantic-ui-react";

class CreateEditComponent extends Component {
  state = {
    componentId: "",
    componentCode: "",
    UOM: "",
    description: "",
    showErrorDiv: false,
    errors: [],
    imageList: new Map(),
    fileNameList: [],
    showMessageDiv: false
  };

  componentDidMount() {
    if (this.props.dataForEdit != null) {
      let { dataForEdit } = this.props;
      this.setState({
        componentId: dataForEdit.id,
        componentCode: dataForEdit.code,
        UOM: dataForEdit.uom,
        description: dataForEdit.name,
        fileNameList: dataForEdit.imagePath,
        firstTimeFileUploadInEdit: true
      });
    }
  }

  handleValidation() {
    let componentCode = this.state.componentCode;
    let UOM = this.state.UOM;
    let description = this.state.description;
    let errors = [];
    let formIsValid = true;

    if (!componentCode) {
      formIsValid = false;
      errors.push("Please enter Component Code");
    }

    if (componentCode.match(/^\s+|\s+$/g)) {
      formIsValid = false;
      errors.push("Component code space not allowed");
    }

    if (!UOM) {
      formIsValid = false;
      errors.push("Please enter UOM");
    }

    if (description.match(/^\s+|\s+$/)) {
      formIsValid = false;
      errors.push("Description space not allowed");
    }

    if (!description) {
      formIsValid = false;
      errors.push("Please enter Description");
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
  onUOMDataChangeHandler = (e,data) => {
    this.setState({
     UOM: data.value
    });
  };

  onChangeFileHandler = e => {
    let validFileExt = ["png", "jpeg", "jpg"];
    if (checkValidFileFormat(validFileExt, e.target.files[0].name)) {
      //In case of edit if user overrites the existing file clear the fileList
      let newFileNameList = [];
      if (
        this.props.dataForEdit != null &&
        this.state.firstTimeFileUploadInEdit === true
      ) {
        newFileNameList.push(e.target.files[0].name);
      } else {
        this.state.fileNameList.push(e.target.files[0].name);
        newFileNameList = this.state.fileNameList;
      }

      this.state.imageList.set(e.target.files[0].name, e.target.files[0]);
      let newImageList = this.state.imageList;

      this.setState({
        imageList: newImageList,
        fileNameList: newFileNameList,
        firstTimeFileUploadInEdit: false,
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.MasterData.saveComponentSuccessFully) {
      let message = "Component added successfully";
      if (this.props.dataForEdit !== null) {
        message = "Component updated successfully";
      }
      this.setState({
        showMessageDiv: true,
        messageValue: message
      });
    }

    if (nextProps.MasterData.errorInProcessing) {
      let errors = ["Unable to save the data"];
      if (
        nextProps.MasterData.errorInProcessing != null &&
        nextProps.MasterData.errorInProcessing.data != null
      ) {
        errors = [nextProps.MasterData.errorInProcessing.data.message];
      }
      this.setState({
        errors: errors,
        showErrorDiv: true
      });
    }
  }

  getFileUploadedList = () => {
    return (
      <div class="col-12 my-2">
        {this.state.fileNameList.map((value, i) => {
          let fileName = value.substring(value.lastIndexOf("\\") + 1);
          return (
            <div class="row">
              <div class="col-6">
                <div class="tn-lh tn-font-13 float-left">{fileName}</div>
                {/* <div class="d-flex h-100 align-items-top float-left px-2 py-1">
                  <i class="close icon" />
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  onSubmitHandler = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      const formData = new FormData();
      formData.append("code", this.state.componentCode.toUpperCase());
      formData.append("uom", this.state.UOM);
      formData.append("name", this.state.description);

      this.state.imageList.forEach((data, index) => {
        formData.append(index, data);
      });
      if (this.state.componentId !== null) {
        formData.append("id", this.state.componentId);
      }
      this.props.addComponents(formData, this.props.history);
    }
  };

  clearFileHandler = e => {
    e.preventDefault();
    this.setState({
      fileName: ""
    });
  };

  onModalCloseHandler = () => {
    this.props.handleCloseCreateEditBOM();
  };

  render() {
    let error = this.state.errors;
    let errorBinding;
      
    let oprtionArray = [
      {text: "Select UOM", value:""},
      {text: "No.", value:"No."},
      {text: "Set", value:"Set"}
  ];

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
              onClick={this.props.handleCloseCreateEditBOM}
            >
              <i className="close icon" />
            </div>

            <div className="col-12 my-4">
              <div className="float-left d-flex h-100 align-items-center">
                <h1 className="m-0 p-0 tn-font-21">
                  {this.props.dataForEdit === null
                    ? "Add Component"
                    : "Edit Component"}
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
                    <label>Component Code</label>
                    <div className="ui fluid form">
                      <TextInput
                        type="text"
                        name="componentCode"
                        placeholder="Component Code"
                        maxlength="20"
                        value={this.state.componentCode}
                        onChange={this.onDataChangeHandler}
                      />
                    </div>
                  </div>

                  <div className="col-6 my-2">
                    <label>UOM</label>
                    <div className="ui fluid form">
                    <Dropdown
                    className="ui search dropdown w-100 tn-multi-dropdown selection"
                    placeholder="Select"
                    fluid
                    selection
                    value={this.state.UOM}
                    options={oprtionArray}
                    onChange={this.onUOMDataChangeHandler}
                  />
                   </div>
                  </div>

                  <div className="col-6 my-2">
                    <label>Description</label>
                    <div className="ui fluid form">
                      <TextInput
                        type="text"
                        name="description"
                        placeholder="Enter Description"
                        maxlength="100"
                        value={this.state.description}
                        onChange={this.onDataChangeHandler}
                      />
                    </div>
                  </div>

                  <hr className="w-100" />
                  <div className="col-12 my-2">Upload Image</div>
                  <div className="col-12">
                    <div className="row" id="pluss">
                      <div className="col-4 my-1">
                        <div className="tn-lh tn-font-13">
                          {this.state.fileNameList != null &&
                          this.state.fileNameList.length > 0
                            ? "Uploaded Files"
                            : "No file selected"}
                        </div>
                      </div>

                      <div className="col-6">
                        <label className="uploadBtnWrap" for="thefile">
                          <input
                            type="file"
                            id="thefile"
                            name="image1"
                            onChange={this.onChangeFileHandler}
                          />
                          <span className="btn p-0">
                            <i className="icon upload tn-upload" />
                          </span>
                        </label>
                      </div>

                      {this.state.fileNameList != null &&
                      this.state.fileNameList.length > 0
                        ? this.getFileUploadedList()
                        : null}
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
  MasterData: state.MasterData
});

export default connect(
  mapStateToProps,
  { addComponents }
)(CreateEditComponent);
