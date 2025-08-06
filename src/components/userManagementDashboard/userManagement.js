import React, { Component } from "react";
import UserMangementList from "./userMangementList";
import CreateEditUserManagement from "./createEditUserManagement";
import Navbar from "../layouts/navbar";

export class userManagement extends Component {
  constructor() {
    super();
    this.state = {
      createEditPageOpen: false,
      dataForEdit: null,
      onSelectCurrentPage: null,
      existingSearchParam: ""
    };
  }

  onClickAddNewUser = () => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
      dataForEdit: null
    });
  };

  onClickEditUser = (selectedData, currentPage, searchParam) => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
      dataForEdit: selectedData,
      onSelectCurrentPage: currentPage,
      existingSearchParam: searchParam
    });
  };

  onCloseCreateEditUser = () => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen
    });
  };

  onActionComplete = () => {
    window.location.reload();
  };

  getUserManage = () => {
    return (
      <UserMangementList
        showActions="true"
        handleAddNewUser={this.onClickAddNewUser}
        handleEditUser={this.onClickEditUser}
        handleActionComplete={this.onActionComplete}
      />
    );
  };

  getCreateEditUserManagementPage = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-12 col-lg-6 mb-4">
          <UserMangementList
            showActions="false"
            handleActionComplete={this.onActionComplete}
            SelectedData={
              this.state.dataForEdit ? this.state.dataForEdit.id : ""
            }
            onSelectCurrentPage={this.state.onSelectCurrentPage}
            existingSearchParam={this.state.existingSearchParam}
          />
        </div>
        <CreateEditUserManagement
          handleCloseCreateEditUser={this.onCloseCreateEditUser}
          dataForEdit={this.state.dataForEdit}
        />
      </div>
    );
  };

  getRenderDiv = () => {
    if (this.state.createEditPageOpen === false) {
      return this.getUserManage();
    } else if (this.state.createEditPageOpen === true) {
      return this.getCreateEditUserManagementPage();
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

export default userManagement;
