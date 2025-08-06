import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getAllLocations,
  deleteLocation,
} from "../../actions/masterDataAction";
import DeleteModal from "../common/deleteModal";
import Pagination from "../common/pagination";
import SelectDropdown from "../common/selectPageSize";

class LocationList extends Component {
  state = {
    pageSize: 10,
    totalResults: 0,
    currentPage: this.props.onSelectCurrentPage || 1,
    locationData: [],
    locationDataHtml: [],
    images: [],
    searchParam: this.props.existingSearchParam || "",
    selectedSize: "",
  };
  getInitialLocationData = () => {
    let pageNumber = this.state.currentPage;
    let pageSize = this.state.pageSize;
    this.props.getAllLocations(pageNumber, pageSize, this.state.searchParam);
  };
  nextPageClickHandler = (pageNumber) => {
    let pageSize = this.state.pageSize;
    this.props.getAllLocations(pageNumber, pageSize, this.state.searchParam);
    this.setState({
      currentPage: pageNumber,
    });
  };

  onPageSizeChangeHandler = (e, data) => {
    this.props.getAllLocations(1, data.value, this.state.searchParam);
    this.setState({
      pageSize: data.value,
      currentPage: 1,
      selectedSize: data.value,
    });
  };

  componentDidMount() {
    this.getInitialLocationData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.LocationData) {
      this.getLocationDataList(nextProps.LocationData);
    }

    if (nextProps.LocationData.deleteLocationSuccessFully) {
      this.getInitialLocationData();
    }
  }

  onSearchValueChange = (e) => {
    this.setState({
      searchParam: e.target.value,
    });
    if (e.target.value === "") {
      this.props.getAllLocations(1, this.state.pageSize, e.target.value);
    }
  };

  onEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      this.props.getAllLocations(
        1,
        this.state.pageSize,
        this.state.searchParam
      );
      this.setState({
        currentPage: 1,
      });
    }
  };

  onClickSearchRecords = () => {
    this.props.getAllLocations(1, this.state.pageSize, this.state.searchParam);
    this.setState({
      currentPage: 1,
    });
  };

  deleteHandler = (id) => {
    let deleteData = {
      id: id,
      isActive: false,
    };
    this.props.deleteLocation(deleteData);
  };

  getLocationDataList = (LocationData) => {
    let locationDataHtml = LocationData.allLocations.map((data, index) => {
      let activeClass;
      if (
        this.props.SelectedData !== undefined &&
        this.props.SelectedData !== null
      ) {
        activeClass = this.props.SelectedData === data.id ? "tn-tbl-color" : "";
      }
      let num = (this.state.currentPage - 1) * this.state.pageSize;

      return (
        <tr key={index} className={activeClass}>
          <td>{index + 1 + num}</td>
          <td>{data.code ? data.code : ""}</td>
          <td>{data.name ? data.name : ""}</td>
          {this.props.showActions === "true" ? (
            <td>
              <div className="float-left d-inline-block w-50 text-left tn-ellipse">
                {data.assemblyLine ? data.assemblyLine.length : ""} Belts
              </div>
              <div className="float-right">
                <button
                  className="ui button tn-edit-btn"
                  onClick={() => this.props.handleViewBelt(data)}
                >
                  View
                </button>
              </div>
            </td>
          ) : null}

          {this.props.showActions === "true" ? (
            <td className="w-100 text-center d-inline-block">
              <div className="d-inline-block float-left">
                <button
                  className="ui button tn-edit-btn"
                  onClick={() =>
                    this.props.handleEditLocation(
                      data,
                      this.state.currentPage,
                      this.state.searchParam
                    )
                  }
                >
                  Edit
                </button>
              </div>
              <div className="float-right d-inline-block">
                <DeleteModal
                  msgToDisplay="Are you sure you want to permanently delete the selected Location?"
                  deleteClick={this.deleteHandler.bind(this, data.id)}
                />
              </div>
            </td>
          ) : null}
        </tr>
      );
    });
    this.setState({
      totalResults: LocationData.locationsCount,
      locationData: LocationData.allLocations,
      locationDataHtml: locationDataHtml,
    });
  };

  render() {
    let numberOfPages = Math.ceil(
      this.state.totalResults / this.state.pageSize
    );

    let locationDataBinding;

    if (this.state.locationDataHtml.length > 0) {
      locationDataBinding = <tbody>{this.state.locationDataHtml}</tbody>;
    } else {
      locationDataBinding = (
        <tbody>
          <tr>
            <td colspan="5" style={{ textAlign: "center" }}>
              No Location Found
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <div className="row tn-table-wrapper">
        <div className="col-12 my-3">
          <div className="float-left d-flex h-100 align-items-center">
            <h1 className="m-0 p-0 tn-font-18">Master Data Management</h1>
          </div>
          {this.props.showActions === "true" ? (
            <div className="float-right">
              <button
                className="ui basic button tn-btn-primary"
                onClick={this.props.handleAddLocation}
              >
                <i className="icon plus" />
                Add Location
              </button>
            </div>
          ) : null}
        </div>

        <div className="col-12 my-3">
          <div className="float-left d-flex h-100 align-items-center">
            <span>Show</span>
            <SelectDropdown
              handleOnChangeEvent={this.onPageSizeChangeHandler}
              text={this.state.selectedSize}
            />

            <span>Entries</span>
          </div>
          {this.props.showActions === "true" ? (
            <div className="float-right">
              <div className="ui search">
                <div className="ui icon input">
                  <span className="p-2"></span>
                  <input
                    className="prompt tn-search-box"
                    type="text"
                    placeholder="Search"
                    maxLength="50"
                    value={this.state.searchParam}
                    onChange={this.onSearchValueChange}
                    onKeyDown={this.onEnterKeyPress}
                  />
                  <a className="tn-search-pos">
                    <i
                      className="search icon"
                      onClick={this.onClickSearchRecords}
                    />
                  </a>
                </div>
                <div className="results" />
              </div>
            </div>
          ) : null}
        </div>

        <div className="col-12 my-3">
          <div className="styleTable">
            <table className="ui celled single table tn-table">
              <thead>
                <tr>
                  <th style={{ minWidth: "100px" }}>S. No.</th>
                  <th style={{ minWidth: "250px" }}>Location</th>
                  <th style={{ minWidth: "250px" }}>Description</th>
                  {this.props.showActions === "true" ? (
                    <th style={{ minWidth: "210px" }}>Belt</th>
                  ) : null}
                  {this.props.showActions === "true" ? (
                    <th style={{ minWidth: "150px" }}>Action</th>
                  ) : null}
                </tr>
              </thead>

              {locationDataBinding}
              {this.state.totalResults > 10 ? (
                <Pagination
                  totalResults={this.state.totalResults}
                  pages={numberOfPages}
                  nextPage={this.nextPageClickHandler}
                  currentPage={
                    this.props.onSelectCurrentPage
                      ? this.props.onSelectCurrentPage
                      : this.state.currentPage
                  }
                />
              ) : null}
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  LocationData: state.LocationData,
});

export default connect(mapStateToProps, { getAllLocations, deleteLocation })(
  LocationList
);