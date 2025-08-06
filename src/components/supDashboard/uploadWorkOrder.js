import React, { Component } from "react";
import {
  getAllWorkOrder,
  uploadWorkOrderFile,
  markAllWorkOrdersAsComplete,
} from "../../actions/manageWorkOrderAction";
import MessageModal from "../common/messageModal";
import { connect } from "react-redux";
import ConfirmationModal from "../common/confirmationModal";
import checkValidFileFormat from "../../utils/checkValidFileFormat";

export class UploadFile extends Component {
  constructor() {
    super();
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
    if (nextProps.dataProps.uploadWorkOrderSuccess) {
      let data = nextProps.dataProps.uploadWorkOrderSuccess;
      let message = (
        <React.Fragment>
          <div>Work Order Added: {data["Added"]}</div>{" "}
          <div>Work Order Rejected: {data["Rejected"]}</div>{" "}
          <div>Total Quantity: {data["TotalQuantity"]}</div>
        </React.Fragment>
      );
      this.setState({
        showMessageDiv: true,
        callBackMethod: this.onModalCloseHandler,
        messageValue: message,
      });
    }
    if (nextProps.dataProps.markAllWorkOrderAsComplete) {
      this.setState({
        showMessageDiv: true,
        callBackMethod: this.onSuccessMarkCompleteAll,
        messageValue: `Marked ${nextProps.dataProps.markAllWorkOrderAsComplete} Work Orders As Complete`,
      });
    }

    if (nextProps.dataProps.errorInProcessing) {
      let errors = [];
      errors.push("Unable to Upload the file");
      this.setState({ showErrorDiv: true, errorsList: errors });
    }
  }

  onSuccessMarkCompleteAll = () => {
    this.setState({
      showMessageDiv: false,
    });
  };

  onClickBulkMarkComplete = () => {
    this.setState({
      showConfirmModalDiv: true,
    });
  };

  onClickConfirmBulkMarkComplete = () => {
    this.setState({
      showConfirmModalDiv: false,
    });
    this.props.markAllWorkOrdersAsComplete();
  };

  onClickCancelBulkMarkComplete = () => {
    this.setState({
      showConfirmModalDiv: false,
    });
  };

  onModalCloseHandler = () => {
    this.props.handleCloseUploadWorkOrder();
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
      const WorkOrderFile = new FormData();
      let user = localStorage.getItem("user");
      user = JSON.parse(user);
      WorkOrderFile.append("locationId", user.locationId);
      WorkOrderFile.append("files", this.state.fileName);
      this.props.uploadWorkOrderFile(WorkOrderFile);
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
              onClick={this.props.handleCloseUploadWorkOrder}
            >
              <i className="close icon" />
            </div>

            <div className="col-12 my-4">
              <div className="float-left d-flex h-100 align-items-center">
                <h1 className="m-0 p-0 tn-font-21">Upload Work Order</h1>
              </div>
            </div>
            {this.state.showErrorDiv === true ? (
              <div className="col-12 my-2" style={{ color: "red" }}>
                {errorBinding}
              </div>
            ) : null}
            {this.state.showConfirmModalDiv ? (
              <ConfirmationModal
                isOpen={true}
                msgToDisplay="Are you sure you want to Mark All the In Progress Work Orders as Complete?"
                onClickConfirmOperation={this.onClickConfirmBulkMarkComplete}
                onClickCancelOperation={this.onClickCancelBulkMarkComplete}
              />
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
                      onClick={this.onClickBulkMarkComplete}
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
  dataProps: state.WorkOrder,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllWorkOrder,
  uploadWorkOrderFile,
  markAllWorkOrdersAsComplete,
})(UploadFile);