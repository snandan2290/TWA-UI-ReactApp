import React, { Component } from "react";
import ManageWorkOrderList from "./manageWorkOrderList";
import CreateEditPageOpen from "./createEditWorkOrder";
import UploadWorkOrder from "./uploadWorkOrder";
import Navbar from "../layouts/navbar";

export class ManageWorkOrder extends Component {
  constructor() {
    super();
    this.state = {
      createEditPageOpen: false,
      uploadPageOpen: false,
      dataForEdit: null,
      onSelectCurrentPage: null,
      existingSearchParam: "",
    };
  }

  onClickUploadWorkOrder = () => {
    this.setState({
      uploadPageOpen: !this.state.uploadPageOpen,
    });
  };

  onClickAssignWorkOrder = () => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
      dataForEdit: null,
    });
  };

  onClickEditWorkOrder = (selectedData, currentPage, searchParam) => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
      dataForEdit: selectedData,
      onSelectCurrentPage: currentPage,
      existingSearchParam: searchParam,
    });
  };

  onCloseCreateEditWorkOrder = () => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
    });
  };

  onCloseUploadWorkOrder = () => {
    this.setState({
      uploadPageOpen: !this.state.uploadPageOpen,
    });
  };

  onMarkCompleteSuccess = () => {
    this.setState({
      uploadPageOpen: !this.state.uploadPageOpen,
    });
  };

  onActionComplete = () => {
    window.location.reload();
  };

  getManageWorkOrderPage = () => {
    return (
      <ManageWorkOrderList
        showActions="true"
        handleAssignWorkOrder={this.onClickAssignWorkOrder}
        handleEditWorkOrder={this.onClickEditWorkOrder}
        handleUploadWorkOrder={this.onClickUploadWorkOrder}
        handleActionComplete={this.onActionComplete}
      />
    );
  };

  getCreateEditWorkOrderPage = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-12 col-lg-6 mb-4">
          <ManageWorkOrderList
            showActions="false"
            handleActionComplete={this.onActionComplete}
            SelectedData={
              this.state.dataForEdit ? this.state.dataForEdit.id : ""
            }
            onSelectCurrentPage={this.state.onSelectCurrentPage}
            existingSearchParam={this.state.existingSearchParam}
          />
        </div>
        <CreateEditPageOpen
          handleCloseCreateEditWorkOrder={this.onCloseCreateEditWorkOrder}
          dataForEdit={this.state.dataForEdit}
        />
      </div>
    );
  };

  getUploadWorkOrderPage = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-12 col-lg-6 mb-4">
          <ManageWorkOrderList
            showActions="false"
            handleActionComplete={this.onActionComplete}
          />
        </div>
        <UploadWorkOrder
          handleCloseUploadWorkOrder={this.onCloseUploadWorkOrder}
          handleMarkCompleteSuccess={this.onMarkCompleteSuccess}
        />
      </div>
    );
  };

  getRenderDiv = () => {
    if (
      this.state.createEditPageOpen === false &&
      this.state.uploadPageOpen === false
    ) {
      return this.getManageWorkOrderPage();
    } else if (
      this.state.createEditPageOpen === true &&
      this.state.uploadPageOpen === false
    ) {
      return this.getCreateEditWorkOrderPage();
    } else if (
      this.state.createEditPageOpen === false &&
      this.state.uploadPageOpen === true
    ) {
      return this.getUploadWorkOrderPage();
    }
  };

  render() {
    return (
      <div>
        <Navbar />
        <div className="body-wrapper">
          <div className="row m-0 justify-content-center">
            <div className="col-11 my-5">{this.getRenderDiv()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageWorkOrder;