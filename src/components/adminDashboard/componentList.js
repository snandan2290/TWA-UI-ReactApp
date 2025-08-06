import React, { Component } from "react";
import Pagination from "../common/pagination";
import {
  getAllComponets,
  addComponents,
  getImageUrlByComponent,
  deleteComponents,
} from "../../actions/masterDataAction";
import { connect } from "react-redux";
import DeleteModal from "../common/deleteModal";
import ImageCarousel from "../common/carouselModal";
import SelectDropdown from "../common/selectPageSize";
import AxiosConfig from "../../utils/axiosConfig";

class ComponentList extends Component {
  state = {
    pageSize: 10,
    totalResults: 0,
    currentPage: this.props.onSelectCurrentPage || 1,
    componentData: [],
    masterDataHtml: [],
    images: [],
    searchParam: this.props.existingSearchParam || "",
    selectedSize: ""
  };

  getInitialComponentData = () => {
    let pageNumber = this.state.currentPage;
    let pageSize = this.state.pageSize;
    this.props.getAllComponets(pageNumber, pageSize, this.state.searchParam);
  };

  onPageSizeChangeHandler = (e, data) => {
    this.props.getAllComponets(1, data.value, this.state.searchParam);
    this.setState({
      pageSize: data.value,
      currentPage: 1,
      selectedSize: data.value,
    });
  };

  onSearchValueChange = (e) => {
    this.setState({
      searchParam: e.target.value,
    });
    if (e.target.value === "") {
      this.props.getAllComponets(1, this.state.pageSize, e.target.value);
    }
  };

  onEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      this.props.getAllComponets(
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
    this.props.getAllComponets(1, this.state.pageSize, this.state.searchParam);
    this.setState({
      currentPage: 1,
    });
  };

  nextPageClickHandler = (pageNumber) => {
    let pageSize = this.state.pageSize;
    this.props.getAllComponets(pageNumber, pageSize, this.state.searchParam);
    this.setState({
      currentPage: pageNumber,
    });
  };

  deleteHandler = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("isActive", false);
    this.props.deleteComponents(formData, this.props.history);
  };

  getImageURLListByComponent = (componentId) => {
    this.props.getImageUrlByComponent(componentId);
  };

  componentDidMount() {
    AxiosConfig.setupAxiosDefaults()
    this.getInitialComponentData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.MasterData) {
      this.getMasterDataList(nextProps.MasterData);
    }

    if (nextProps.MasterData.deleteComponentSuccessFully) {
      this.getInitialComponentData();
    }
  }

  getMasterDataList = (MasterData) => {
    let masterDataHtml = MasterData.allComponents.map((data, index) => {
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
          <td>{data.uom ? data.uom : ""}</td>
          <td>{data.name ? data.name : ""}</td>
          <td>
            {data.imagePath !== null &&
            data.imagePath.length !== 0 &&
            data.imagePath !== undefined ? (
              <div>
                <div className="float-left">
                  <ImageCarousel
                    handleViewClick={this.getImageURLListByComponent}
                    uniqueId={data.id}
                  />
                </div>
              </div>
            ) : (
              "No Images"
            )}
          </td>
          {this.props.showActions === "true" ? (
            <td className="w-100 text-center d-inline-block">
              <div className="d-inline-block float-left">
                <button
                  className="ui button tn-edit-btn"
                  onClick={() =>
                    this.props.handleEditBOM(
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
                  msgToDisplay="Are you sure you want to permanently delete the selected Component?"
                  deleteClick={this.deleteHandler.bind(this, data.id)}
                />
              </div>
            </td>
          ) : null}
        </tr>
      );
    });
    this.setState({
      totalResults: MasterData.count,
      componentData: MasterData.allComponents,
      masterDataHtml: masterDataHtml,
    });
  };

  render() {
    let numberOfPages = Math.ceil(
      this.state.totalResults / this.state.pageSize
    );
    let componentDataBinding;

    if (this.state.masterDataHtml.length > 0) {
      componentDataBinding = <tbody>{this.state.masterDataHtml}</tbody>;
    } else {
      componentDataBinding = (
        <tbody>
          <tr>
            <td colspan="6" style={{ textAlign: "center" }}>
              No Component Found
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
                onClick={this.props.handleAddBOM}
              >
                <i className="icon plus" />
                Add Component
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
                  <th style={{ minWidth: "60px" }}>S. No.</th>
                  <th style={{ minWidth: "150px" }}>Component Code</th>
                  <th style={{ minWidth: "150px" }}>UOM</th>
                  <th style={{ minWidth: "250px" }}>Description</th>
                  <th style={{ minWidth: "120px" }}>Image</th>
                  {this.props.showActions === "true" ? (
                    <th style={{ minWidth: "150px" }}>Action</th>
                  ) : null}
                </tr>
              </thead>
              {componentDataBinding}
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
  auth: state.auth,
  MasterData: state.MasterData,
});

export default connect(mapStateToProps, {
  getAllComponets,
  addComponents,
  getImageUrlByComponent,
  deleteComponents,
})(ComponentList)