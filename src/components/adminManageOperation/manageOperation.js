import React, { Component } from "react";
import OperationList from "./operatinList";
import CreateEditOperation from "./createEditOperation";

class ManageOperation extends Component {
  state = {
    createEditPageOpen: false,
    dataForEdit: null,
    onSelectCurrentPage:null,
    existingSearchParam: ""
  };
  render() {
    return this.getRenderDiv();
  }

  onClickAddOperation = () => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
      dataForEdit: null
    });
  };

  onClickEditOperation = (selectedData,currentPage , searchParam) => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
      dataForEdit: selectedData,
      onSelectCurrentPage:currentPage,
      existingSearchParam: searchParam
    });
  };

  onCloseCreateEditOperation = () => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen
    });
  };

  onActionComplete = () => {
    window.location.reload();
  };
  getMasterDataManagementOperationPage = () => {
    return (
      <OperationList
        showActions="true"
        handleAddOperation={this.onClickAddOperation}
        handleEditOperation={this.onClickEditOperation}
        handleActionComplete={this.onActionComplete}
      />
    );
  };

  getCreateEditOperationPage = () => {
    return (
      <div className="row">
     <div className="col-12 col-md-12 col-lg-6 mb-4">
          <OperationList
            showActions="false"
            handleActionComplete={this.onActionComplete}
            SelectedData={this.state.dataForEdit ?this.state.dataForEdit.id : '' }
            onSelectCurrentPage={this.state.onSelectCurrentPage}
            existingSearchParam={this.state.existingSearchParam}
          />
        </div>

        <CreateEditOperation
          handleCloseCreateEditOperation={this.onCloseCreateEditOperation}
          dataForEdit={this.state.dataForEdit}
        />
      </div>
    );
  };

  getRenderDiv = () => {
    if (this.state.createEditPageOpen === false) {
      return this.getMasterDataManagementOperationPage();
    } else if (this.state.createEditPageOpen === true) {
      return this.getCreateEditOperationPage();
    }
  };
}

export default ManageOperation;
