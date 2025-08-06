import React, { Component } from "react";
import DeleteModal from "../common/deleteModal";
import Pagination from "../common/pagination";
import {
  getAllOperations,
  deleteOperation,
  getGIFile,
} from "../../actions/masterDataAction";
import { connect } from "react-redux";
import axios from "axios";
import { API_IMAGE_URL } from "./../../constants/configValues";
import SelectDropdown from "../common/selectPageSize";
const fileDownload = require("js-file-download");

class OperationList extends Component {
  state = {
    pageSize: 10,
    totalResults: 0,
    currentPage: this.props.onSelectCurrentPage || 1,
    operationData: [],
    operationDataHtml: [],
    images: [],
    searchParam: this.props.existingSearchParam || "",
    selectedSize: "",
  };
  getInitialOperationData = () => {
    let pageNumber = this.state.currentPage;
    let pageSize = this.state.pageSize;
    this.props.getAllOperations(pageNumber, pageSize, this.state.searchParam);
  };
  nextPageClickHandler = (pageNumber) => {
    let pageSize = this.state.pageSize;
    this.props.getAllOperations(pageNumber, pageSize, this.state.searchParam);
    this.setState({
      currentPage: pageNumber,
    });
  };

  getGIFile = (processId) => {
    this.props.getGIFile(processId);
  };

  componentDidMount() {
    this.getInitialOperationData();
  }

  onPageSizeChangeHandler = (e, data) => {
    this.props.getAllOperations(1, data.value, this.state.searchParam);
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
      this.props.getAllOperations(1, this.state.pageSize, e.target.value);
    }
  };

  onEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      this.props.getAllOperations(
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
    this.props.getAllOperations(1, this.state.pageSize, this.state.searchParam);
    this.setState({
      currentPage: 1,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.OperationData) {
      this.getOperationDataList(nextProps.OperationData);
    }

    if (nextProps.OperationData.deleteOperationSuccessFully) {
      this.getInitialOperationData();
    }

    if (nextProps.OperationData.fileUrlGI) {
      let value = nextProps.OperationData.fileUrlGI;
      let fileName = value.substring(value.lastIndexOf("/") + 1);
      axios
        .get(API_IMAGE_URL + value, {
          responseType: "blob",
        })
        .then((response) => {
          fileDownload(response.data, fileName);
        });
    }
  }

  deleteHandler = (id) => {
    let deleteData = {
      id: id,
      isActive: false,
    };
    this.props.deleteOperation(deleteData);
  };

  getOperationDataList = (OperationData) => {
    let operationDataHtml = OperationData.allOperations.map((data, index) => {
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
          <td>{data.name ? data.name : ""}</td>
          <td>{data.code ? data.code : ""}</td>
          <td>
            {" "}
            <div className="d-inline-block float-left">
              <button
                className="ui button tn-edit-btn"
                onClick={() => this.getGIFile(data.id)}
              >
                General Instructions (GI)
              </button>
            </div>
          </td>
          {this.props.showActions === "true" ? (
            <td className="w-100 text-center d-inline-block">
              <div className="d-inline-block float-left">
                <button
                  className="ui button tn-edit-btn"
                  onClick={() =>
                    this.props.handleEditOperation(
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
                  msgToDisplay="Are you sure you want to permanently delete the selected Operation?"
                  deleteClick={this.deleteHandler.bind(this, data.id)}
                />
              </div>
            </td>
          ) : null}
        </tr>
      );
    });
    this.setState({
      totalResults: OperationData.operationsCount,
      operationData: OperationData.allOperations,
      operationDataHtml: operationDataHtml,
    });
  };

  render() {
    let numberOfPages = Math.ceil(
      this.state.totalResults / this.state.pageSize
    );

    let operationDataBinding;

    if (this.state.operationDataHtml.length > 0) {
      operationDataBinding = <tbody>{this.state.operationDataHtml}</tbody>;
    } else {
      operationDataBinding = (
        <tbody>
          <tr>
            <td colspan="5" style={{ textAlign: "center" }}>
              No Operation Found
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
                onClick={this.props.handleAddOperation}
              >
                <i className="icon plus" />
                Add Operation
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
                  <th style={{ minWidth: "250px" }}>Operation Name</th>
                  <th style={{ minWidth: "200px" }}>Operation Code</th>
                  <th style={{ minWidth: "250px" }}>
                    General Instructions (GI)
                  </th>
                  {this.props.showActions === "true" ? (
                    <th style={{ minWidth: "150px" }}>Action</th>
                  ) : null}
                </tr>
              </thead>
              {operationDataBinding}
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
  OperationData: state.OperationData,
});

export default connect(mapStateToProps, {
  getAllOperations,
  deleteOperation,
  getGIFile,
})(OperationList);