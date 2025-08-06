import React, { Component } from "react";
import TextInput from "../../components/common/textInput";
import {
  getAllSOP,
  getAllComponents,
  addVarinats,
  getSOPByvariantId,
  getBOMByvariantId,
  resetSOPByvariantId,
  resetBOMByvariantId,
  getSOPFileURL
} from "../../actions/masterDataAction";
import { connect } from "react-redux";
import AutoCompleteSearchModal from "../common/autoCompleteSearchModal";
import checkValidFileFormat from "../../utils/checkValidFileFormat";
import MessageModal from "../../components/common/messageModal";
import { API_IMAGE_URL } from "./../../constants/configValues";
import axios from "axios";
import LoadingSpinner from "../../components/common/loadingSpinner";
const fileDownload = require("js-file-download");

export class createEditVariant extends Component {
  state = {
    showMessageDiv: false,
    description: "",
    showErrorDiv: false,
    errors: [],
    uploadedFiles: new Map(),
    variantCode: "",
    activeTab: false,
    image1: null,
    fileName: "",
    activeTab: "sop",
    variantId: "",
    componentsList: [],
    selectedBOMComponent: [],
    selectBOMComponentId: [],
    fileNameList: [],
    sopFileName: "",
    imageList: new Map()
  };

  constructor(props) {
    super(props);
    props.getAllSOP();
  }

  componentDidMount() {
    this.props.getAllComponents();
    if (this.props.dataForEdit != null) {
      let { dataForEdit } = this.props;
      this.props.getSOPByvariantId(dataForEdit.id);
      this.props.getBOMByvariantId(dataForEdit.id);
      this.setState({
        description: dataForEdit.description,
        variantCode: dataForEdit.code,
        firstTimeFileUploadInEdit: true,
        fileNameList: dataForEdit.imagePath,
        sopFileName: dataForEdit.sopFile,
        variantId: dataForEdit.id,
        existingBillOfMaterialId: dataForEdit.billOfMaterialId
      });
    } else {
      this.props.resetSOPByvariantId();
      this.props.resetBOMByvariantId();
    }
  }

  getActiveClassForTab(tabName) {
    if (this.state.activeTab === tabName) {
      return "item active";
    } else {
      return "item";
    }
  }

  getActiveClassForTabDiv(tabName) {
    if (this.state.activeTab === tabName) {
      return "ui bottom attached tab segment active m-0";
    } else {
      return "ui bottom attached tab segment m-0";
    }
  }

  onTabClick(tabName) {
    this.setState({
      activeTab: tabName
    });
  }

  onDataChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onChangeFileHandler = e => {
    let validFileExt = ["xlsx", "xls"];
    if (checkValidFileFormat(validFileExt, e.target.files[0].name)) {
      this.state.uploadedFiles.set(e.target.id, e.target.files[0]);
      this.setState({
        uploadedFiles: this.state.uploadedFiles,
        errors: [],
        showErrorDiv: false
      });
      let spanId = e.target.id.replace("process", "fileName");
      let fileName = e.target.files[0].name;
      let trimFileName = fileName.substring(fileName.lastIndexOf("/") + 1);

      if (trimFileName.length > 20) {
        trimFileName = trimFileName.substring(0, 20) + "...";
      }
      this.refs[spanId].innerText = trimFileName;
    } else {
      this.setState({
        errors: ["Please upload file with formats: " + validFileExt.join(", ")],
        showErrorDiv: true
      });
    }
  };

  onBomSelect = (e, data) => {
    this.state.selectedBOMComponent.push(e.target.textContent);
    this.state.selectBOMComponentId.push(data.value);
    this.setState({
      selectedBOMComponent: this.state.selectedBOMComponent,
      selectBOMComponentId: this.state.selectBOMComponentId
    });
  };

  deleteSelectedBOM = index => {
    this.state.selectedBOMComponent.splice(index, 1);
    this.state.selectBOMComponentId.splice(index, 1);
    this.setState({
      selectedBOMComponent: this.state.selectedBOMComponent,
      selectBOMComponentId: this.state.selectBOMComponentId
    });
  };

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.VariantData.saveVariantSuccessFully) {
      let message = "Variant added successfully";
      if (this.props.dataForEdit !== null) {
        message = "Variant updated successfully";
      }
      this.setState({
        showMessageDiv: true,
        messageValue: message
      });
    }

    if (nextProps.SubVariantData.getBOMByvariantId !== undefined) {
      this.setBOMDataForEdit(nextProps.SubVariantData.getBOMByvariantId);
    }

    if (nextProps.VariantData.errorInProcessing) {
      let errors = ["Unable to save the data"];
      if (
        nextProps.VariantData.errorInProcessing != null &&
        nextProps.VariantData.errorInProcessing.data != null
      ) {
        errors = [nextProps.VariantData.errorInProcessing.data.message];
      }
      this.setState({
        errors: errors,
        showErrorDiv: true
      });
    }
    if (nextProps.SubVariantData.dropDownComponentList) {
      let componentsDataOptions = nextProps.SubVariantData.dropDownComponentList.map(
        (component, index) => ({
          text: component.code + " " + component.name,
          value: component.id
        })
      );
      this.setState({ componentsList: componentsDataOptions });
    }

    if (nextProps.VariantData.fileUrlSOP) {
      let value = nextProps.VariantData.fileUrlSOP;
      let fileName = value.substring(value.lastIndexOf("/") + 1);
      axios
        .get(API_IMAGE_URL + value, {
          responseType: "blob"
        })
        .then(response => {
          fileDownload(response.data, fileName);
        });
    }
  }

  handleValidation() {
    let errors = [];
    let formIsValid = true;

    if (this.state.variantCode.match(/^\s+|\s+$/g)) {
      formIsValid = false;
      errors.push("Variant code space not allowed");
    }

    if (!this.state.variantCode) {
      formIsValid = false;
      errors.push("Please enter Variant Code");
    }

    if (this.state.description.match(/^\s+|\s+$/g)) {
      formIsValid = false;
      errors.push("Caliber space not allowed");
    }

    if (!this.state.description) {
      formIsValid = false;
      errors.push("Please enter Variant Caliber");
    }
    if (this.props.dataForEdit === null && this.state.imageList.size === 0) {
      formIsValid = false;
      errors.push("Please upload the Variant Image");
    }

    if (formIsValid === false) {
      this.setState({
        errors: errors,
        showErrorDiv: true
      });
    }
    return formIsValid;
  }

  setBOMDataForEdit = bomData => {
    let bomComponent = [];
    let bomComponentId = [];
    if (bomData.length > 0) {
      bomData.forEach(data => {
        bomComponent.push(data.code + " " + data.name);
        bomComponentId.push(data.id);
        this.setState({
          selectedBOMComponent: bomComponent,
          selectBOMComponentId: bomComponentId
        });
      });
    } else {
      this.setState({
        selectedBOMComponent: [],
        selectBOMComponentId: []
      });
    }
  };

  getSelectedBOMComponent = () => {

    return (
      <div id="selectedComponentDiv" class="col-12">
        {this.state.selectedBOMComponent.map((value, i) => {
          if(this.state.selectedBOMComponent[i] === ""){
            return null
          }else{
            return (
              <a class="ui label transition visible tn-box-color" data-value="">
                {value}
                <i
                  class="delete icon"
                  onClick={() => this.deleteSelectedBOM(i)}
                />
              </a>
            );
          }
        })}
      </div>
    );
  };

  onChangeImageUploadHandler = e => {
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

  onSubmitHandler = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      const formData = new FormData();

      formData.append("code", this.state.variantCode.toUpperCase());
      formData.append("description", this.state.description);
      this.state.imageList.forEach((data, index) => {
        formData.append("image#+" + index, data);
      });
      this.state.uploadedFiles.forEach((data, index) => {
        formData.append(index, data);
      });
      formData.append(
        "billOfMaterialId",
        "[" + this.state.selectBOMComponentId + "]"
      );
      if (
        this.props.dataForEdit != undefined &&
        this.props.dataForEdit !== null
      ) {
        formData.append("id", this.state.variantId);
        formData.append(
          "existingBillOfMaterialId",
          this.state.existingBillOfMaterialId
        );
      }
      this.props.addVarinats(formData);
    }
  };

  onModalCloseHandler = () => {
    this.props.handleCloseCreateEditVariant();
  };

  getSOPFile = varinatId => {
    this.props.getSOPFileURL(varinatId);
  };

  getSpecialInstructionDiv = () => {
    let { sopFileName } = this.state;
    let trimFileName = null;
    if (sopFileName != null && sopFileName !== "") {
      trimFileName = sopFileName.substring(sopFileName.lastIndexOf("\\") + 1);
      if (trimFileName.length > 20) {
        trimFileName = trimFileName.substring(0, 20) + "...";
      }
    }
    return (
      <div className="col-12">
        <div className="row" id="pluss">
          <div className="col-4 my-1">
            <div className="tn-lh tn-font-13" ref="fileName#All">
              {trimFileName != null && trimFileName !== "" ? (
                <button
                  type="button"
                  className="ui button tn-edit-btn"
                  onClick={() => this.getSOPFile(this.state.variantId)}
                >
                  {trimFileName}
                </button>
              ) : (
                "No file selected"
              )}
            </div>
          </div>
          <div className="col-6">
            <label className="uploadBtnWrap" htmlFor="process#All">
              <input
                type="file"
                id="process#All"
                onChange={this.onChangeFileHandler}
              />
              <span className="btn p-0">
                <i className="icon upload tn-upload" />
              </span>
            </label>
          </div>
        </div>
      </div>
    );
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
        {this.props.VariantData.loading ? <LoadingSpinner /> : null}
        <div className="tn-tabs tn-bg px-4 tabComponentBorder">
          <div className="row">
            <div
              className="close tn-close"
              onClick={this.props.handleCloseCreateEditVariant}
            >
              <i className="close icon" />
            </div>

            <div className="col-12 my-4">
              <h1 className="m-0 p-0 tn-font-21">
                {this.props.dataForEdit === null
                  ? "Add new Variant"
                  : "Edit Variant"}
              </h1>
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
                    <label>Variant Code</label>
                    <div className="ui fluid form">
                      <TextInput
                        type="text"
                        name="variantCode"
                        placeholder="Variant Code"
                        value={this.state.variantCode}
                        onChange={this.onDataChangeHandler}
                      />
                    </div>
                  </div>

                  <div className="col-6 my-2">
                    <label>Caliber</label>
                    <div className="ui fluid form">
                      <TextInput
                        type="text"
                        name="description"
                        placeholder="Enter Caliber"
                        value={this.state.description}
                        onChange={this.onDataChangeHandler}
                      />
                    </div>
                  </div>

                  <hr className="w-100" />
                  <div class="tn-two-tabs">
                    <div class="ui top attached tabular menu border-0 m-0">
                      <a
                        className={this.getActiveClassForTab("sop")}
                        data-tab="sop"
                        onClick={() => this.onTabClick("sop")}
                      >
                        SOP
                      </a>
                      <a
                        className={this.getActiveClassForTab("bom")}
                        data-tab="bom"
                        onClick={() => this.onTabClick("bom")}
                      >
                        BOM
                      </a>
                      <a
                        className={this.getActiveClassForTab("image")}
                        data-tab="image"
                        onClick={() => this.onTabClick("image")}
                      >
                        IMAGE
                      </a>
                    </div>
                    <div
                      className={this.getActiveClassForTabDiv("sop")}
                      data-tab="sop"
                    >
                      <div class="row">
                        <div class="col-12 my-2">Special Instruction (SOP)</div>
                        {this.getSpecialInstructionDiv()}
                      </div>
                    </div>

                    <div
                      className={this.getActiveClassForTabDiv("bom")}
                      data-tab="bom"
                    >
                      <div class="row">
                        <div class="col-12 my-2">Bill of Material (BOM)</div>
                        <div class="col-12 my-2">
                          <AutoCompleteSearchModal
                            optionsList={this.state.componentsList}
                            handleOnChangeEvent={this.onBomSelect}
                          />
                        </div>
                        {this.state.selectedBOMComponent != undefined &&
                        this.state.selectedBOMComponent.length > 0
                          ? this.getSelectedBOMComponent()
                          : null}
                      </div>
                    </div>

                    <div
                      className={this.getActiveClassForTabDiv("image")}
                      data-tab="image"
                    >
                      <div class="row">
                        <div class="col-12 my-2">Upload Image</div>
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
                              <label
                                className="uploadBtnWrap"
                                for="theUploadedImage"
                              >
                                <input
                                  type="file"
                                  id="theUploadedImage"
                                  name="uploadedimage"
                                  onChange={this.onChangeImageUploadHandler}
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
  SubVariantData: state.SubVariantData,
  VariantData: state.VariantData
});

export default connect(
  mapStateToProps,
  {
    getAllSOP,
    getAllComponents,
    addVarinats,
    getSOPByvariantId,
    resetSOPByvariantId,
    resetBOMByvariantId,
    getSOPFileURL,
    getBOMByvariantId
  }
)(createEditVariant);
