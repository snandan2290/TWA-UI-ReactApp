import React, { Component } from "react";
import VariantList from "./variantList";
import CreateEditVariant from "./createEditVariant";
import ViewSopBomPage from "./viewSopBom";
import UploadVariant from "./uploadVariant";

class Managevariant extends Component {
  state = {
    createEditPageOpen: false,
    dataForEdit: null,
    viewSopBomPage: false,
    viewSopBomVariant: null,
    viewSopBomTab: "sop",
    onSelectCurrentPage: null,
    existingSearchParam: "",
    uploadPageOpen: false,
  };
  render() {
    return this.getRenderDiv();
  }

  onClickUploadVariant = () => {
    this.setState({
      uploadPageOpen: !this.state.uploadPageOpen,
    });
  };

  onClickViewSopBom = (variantData, tabName) => {
    this.setState({
      viewSopBomPage: !this.state.viewSopBomPage,
      viewSopBomVariant: variantData,
      viewSopBomTab: tabName,
    });
  };

  onClickAddVariant = () => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
      dataForEdit: null,
    });
  };

  onClickEditVariant = (selectedData, currentPage, searchParam) => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
      dataForEdit: selectedData,
      onSelectCurrentPage: currentPage,
      existingSearchParam: searchParam,
    });
  };

  onCloseCreateEditVariant = () => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
    });
  };

  onCloseViewSopBom = () => {
    this.setState({
      viewSopBomPage: !this.state.viewSopBomPage,
    });
  };
  onCloseUploadVariant = () => {
    this.setState({
      uploadPageOpen: !this.state.uploadPageOpen,
    });
  };
  onActionComplete = () => {
    window.location.reload();
  };

  getMasterDataManagementVariantPage = () => {
    return (
      <VariantList
        showActions="true"
        handleAddVariant={this.onClickAddVariant}
        handleEditVariant={this.onClickEditVariant}
        handleActionComplete={this.onActionComplete}
        handleViewSopBom={this.onClickViewSopBom}
        handleUploadVariant={this.onClickUploadVariant}
      />
    );
  };

  getViewSopBomPage = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-12 col-lg-6 mb-4">
          <VariantList
            showActions="false"
            handleActionComplete={this.onActionComplete}
          />
        </div>

        <ViewSopBomPage
          handleCloseViewSopBom={this.onCloseViewSopBom}
          viewSopBomId={this.state.viewSopBomVariant.id}
          viewSopBomVariantCode={this.state.viewSopBomVariant.code}
          activeTab={this.state.viewSopBomTab}
        />
      </div>
    );
  };

  getCreateEditVariantPage = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-12 col-lg-6 mb-4">
          <VariantList
            showActions="false"
            handleActionComplete={this.onActionComplete}
            SelectedData={
              this.state.dataForEdit ? this.state.dataForEdit.id : ""
            }
            onSelectCurrentPage={this.state.onSelectCurrentPage}
            existingSearchParam={this.state.existingSearchParam}
          />
        </div>

        <CreateEditVariant
          handleCloseCreateEditVariant={this.onCloseCreateEditVariant}
          dataForEdit={this.state.dataForEdit}
        />
      </div>
    );
  };

  getUploadVariantPage = () => {
    return (
      <div className="row">
        <div className="col-12 col-md-12 col-lg-6 mb-4">
          <VariantList
            showActions="false"
            handleActionComplete={this.onActionComplete}
          />
        </div>
        <UploadVariant handleCloseUploadVariant={this.onCloseUploadVariant} />
      </div>
    );
  };

  getRenderDiv = () => {
    if (
      this.state.createEditPageOpen === false &&
      this.state.viewSopBomPage === false &&
      this.state.uploadPageOpen === false
    ) {
      return this.getMasterDataManagementVariantPage();
    } else if (
      this.state.createEditPageOpen === true &&
      this.state.uploadPageOpen === false
    ) {
      return this.getCreateEditVariantPage();
    } else if (
      this.state.viewSopBomPage === true &&
      this.state.uploadPageOpen === false
    ) {
      return this.getViewSopBomPage();
    } else if (
      this.state.createEditPageOpen === false &&
      this.state.uploadPageOpen === true
    ) {
      return this.getUploadVariantPage();
    }
  };
}

export default Managevariant;
