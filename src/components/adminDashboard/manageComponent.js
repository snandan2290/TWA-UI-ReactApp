import React, { Component } from "react";
import ComponentListBOM from "./componentList";
import CreateEditComponentBOM from "./createEditComponent";

class ManageComponent extends Component {
  state = { createEditPageOpen: false,
     dataForEdit: null ,
     onSelectCurrentPage:null,
     existingSearchParam: ""
    };
  render() {
    return this.getRenderDiv();
  }

  onClickAddBOM = () => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
      dataForEdit: null
    });
  };

  onClickEditBOM = (selectedData,currentPage , searchParam) => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
      dataForEdit: selectedData,
      onSelectCurrentPage:currentPage,
      existingSearchParam: searchParam
    });
  };

  onCloseCreateEditBOM = () => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen
    });
  };

  onActionComplete = () => {
    window.location.reload();
  };

  getMasterDataManagementPage = () => {
    return (
      <ComponentListBOM
        showActions="true"
        handleAddBOM={this.onClickAddBOM}
        handleEditBOM={this.onClickEditBOM}
        handleActionComplete={this.onActionComplete}
      />
    );
  };

  getCreateEditBOMPage = () => {
    return (
      <div className="row">
      <div className="col-12 col-md-12 col-lg-6 mb-4">
          <ComponentListBOM
            showActions="false"
            handleActionComplete={this.onActionComplete}  
            SelectedData={this.state.dataForEdit ?this.state.dataForEdit.id : '' }
            onSelectCurrentPage={this.state.onSelectCurrentPage}
            existingSearchParam={this.state.existingSearchParam}
          />
        </div>
        <CreateEditComponentBOM
          handleCloseCreateEditBOM={this.onCloseCreateEditBOM}
          dataForEdit={this.state.dataForEdit}
        />
      </div>
    );
  };

  getRenderDiv = () => {
    if (this.state.createEditPageOpen === false) {
      return this.getMasterDataManagementPage();
    } else if (this.state.createEditPageOpen === true) {
      return this.getCreateEditBOMPage();
    }
  };
}

export default ManageComponent;
