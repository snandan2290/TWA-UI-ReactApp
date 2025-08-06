import React, { Component } from "react";
import LocationList from "./locationList";
import CreateEditLocation from "./createEditLocation";
import ViewBelts from "./viewBelts";
class ManageLocation extends Component {
  state = {
    createEditPageOpen: false,
    dataForEdit: null,
    viewBeltPageOpen: false,
    onSelectCurrentPage:null,
    existingSearchParam: ""
  };

  render() {
    return this.getRenderDiv();
  }

  onClickAddLocation = () => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
      dataForEdit: null
    });
  };
  onClickViewBelt = (selectedData) => {
    this.setState({
      viewBeltPageOpen: !this.state.viewBeltPageOpen,
      dataForEdit: selectedData
    });
  };

  onClickEditLocation = (selectedData,currentPage , searchParam) => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen,
      dataForEdit: selectedData,
      onSelectCurrentPage:currentPage,
      existingSearchParam: searchParam
    });
  };

  onCloseCreateEditLocation = () => {
    this.setState({
      createEditPageOpen: !this.state.createEditPageOpen
    });
  };
  onCloseViewBelt = () => {
    this.setState({
      viewBeltPageOpen: !this.state.viewBeltPageOpen
    });
  };

  onActionComplete = () => {
    window.location.reload();
  };

  getMasterDataManagementLocationPage = () => {
    return (
      <LocationList
        showActions="true"
        handleAddLocation={this.onClickAddLocation}
        handleViewBelt={this.onClickViewBelt}
        handleEditLocation={this.onClickEditLocation}
        handleActionComplete={this.onActionComplete}
        
      />
    );
  };

  getCreateEditLocationPage = () => {
    return (
      <div className="row">
         <div className="col-12 col-md-12 col-lg-6 mb-4">
          <LocationList
            showActions="false"
            handleActionComplete={this.onActionComplete}  
            SelectedData={this.state.dataForEdit ?this.state.dataForEdit.id : '' }
            onSelectCurrentPage={this.state.onSelectCurrentPage}
            existingSearchParam={this.state.existingSearchParam}
          />
        </div>

        <CreateEditLocation
          handleCloseCreateEditLocation={this.onCloseCreateEditLocation}
          dataForEdit={this.state.dataForEdit}
        />
      </div>
    );
  };

  getViewBeltPage = () => {
    return (
      <div className="row">
      <div className="col-12 col-md-12 col-lg-6 mb-4">
          <LocationList
            showActions="false"
            handleActionComplete={this.onActionComplete}
          />
        </div>

        <ViewBelts
          handleCloseViewBelt={this.onCloseViewBelt}
          dataForEdit={this.state.dataForEdit}
        />
      </div>
    );
  };

  getRenderDiv = () => {
    if (
      this.state.createEditPageOpen === false &&
      this.state.viewBeltPageOpen === false
    ) {
      return this.getMasterDataManagementLocationPage();
    } else if (
      this.state.createEditPageOpen === true &&
      this.state.viewBeltPageOpen === false
    ) {
      return this.getCreateEditLocationPage();
    } else if (
      this.state.createEditPageOpen === false &&
      this.state.viewBeltPageOpen === true
    ) {
      return this.getViewBeltPage();
    }
  };
}

export default ManageLocation;
