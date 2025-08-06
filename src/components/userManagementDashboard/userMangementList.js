import React, { Component } from "react";
import { connect } from "react-redux";
import DeleteModal from "../common/deleteModal";
import Pagination from "../common/pagination";
import {
  getAllUsers,
  deleteUserData,
  addUserData,
} from "../../actions/masterDataAction";
import SelectDropdown from "../common/selectPageSize";

export class userMangementList extends Component {
  state = {
    pageSize: 10,
    totalResults: 0,
    currentPage: this.props.onSelectCurrentPage || 1,
    user: [],
    userDataHtml: [],
    searchParam: this.props.existingSearchParam || "",
    selectedSize: "",
  };

  getInitialUserData = () => {
    let pageNumber = this.state.currentPage;
    let pageSize = this.state.pageSize;
    this.props.getAllUsers(pageNumber, pageSize, this.state.searchParam);
  };

  componentDidMount() {
    this.getInitialUserData();
  }
  onPageSizeChangeHandler = (e, data) => {
    this.props.getAllUsers(1, data.value, this.state.searchParam);
    this.setState({
      pageSize: data.value,
      currentPage: 1,
      selectedSize: data.value,
    });
  };

  nextPageClickHandler = (pageNumber) => {
    let pageSize = this.state.pageSize;
    this.props.getAllUsers(pageNumber, pageSize, this.state.searchParam);
    this.setState({
      currentPage: pageNumber,
    });
  };

  onSearchValueChange = (e) => {
    this.setState({
      searchParam: e.target.value,
    });
    if (e.target.value === "") {
      this.props.getAllUsers(1, this.state.pageSize, e.target.value);
    }
  };

  onEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      this.props.getAllUsers(1, this.state.pageSize, this.state.searchParam);
      this.setState({
        currentPage: 1,
      });
    }
  };

  onClickSearchRecords = () => {
    this.props.getAllUsers(1, this.state.pageSize, this.state.searchParam);
    this.setState({
      currentPage: 1,
    });
  };

  deleteHandler = (id) => {
    let deleteData = {
      id: id,
      isActive: false,
    };
    this.props.deleteUserData(deleteData);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UserData) {
      this.getUserDataList(nextProps.UserData);
    }
    if (nextProps.UserData.DeleteSuccess) {
      this.getInitialUserData();
    }
  }

  getUserDataList = (UserData) => {
    let userDataHtml = UserData.allUsers.map((data, index) => {
      let activeClass;
      if (
        this.props.SelectedData !== undefined &&
        this.props.SelectedData !== null
      ) {
        activeClass = this.props.SelectedData === data.id ? "tn-tbl-color" : "";
      }

      let styleIsActive = "active-green-color";
      if (!data.isActive) {
        styleIsActive = "inActive-green-color";
      }
      let num = (this.state.currentPage - 1) * this.state.pageSize;
      return (
        <tr key={index} className={activeClass}>
          <td>{index + 1 + num}</td>
          <td>{data.username ? data.username : ""}</td>
          <td>{data.uniqueUserId ? data.uniqueUserId : ""}</td>
          <td>{data.email ? data.email : ""}</td>
          <td>{data.role ? data.role : ""}</td>
          <td>{data.location ? data.location.code : ""}</td>
          <td className={styleIsActive}>
            {data.isActive ? "ACTIVE" : "INACTIVE"}
          </td>
          {this.props.showActions === "true" ? (
            <td className="w-100 text-center d-inline-block">
              <div className="float-left d-inline-block">
                <button
                  className="ui button tn-edit-btn"
                  onClick={() =>
                    this.props.handleEditUser(
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
                  msgToDisplay="Are you sure you want to mark selected user as INACTIVE?"
                  deleteClick={this.deleteHandler.bind(this, data.id)}
                />
              </div>
            </td>
          ) : null}
        </tr>
      );
    });
    this.setState({
      totalResults: UserData.count,
      userDataHtml: userDataHtml,
    });
  };

  render() {
    let numberOfPages = Math.ceil(
      this.state.totalResults / this.state.pageSize
    );
    let userDataBinding;

    if (this.state.userDataHtml.length > 0) {
      userDataBinding = <tbody>{this.state.userDataHtml}</tbody>;
    } else {
      userDataBinding = (
        <tbody>
          <tr>
            <td colspan="8" style={{ textAlign: "center" }}>
              No User Found
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <div className="tn-tabs tn-bg px-4">
        <div className="row tn-table-wrapper">
          <div className="col-12 my-3 pt-3">
            <div className="float-left d-flex h-100 align-items-center">
              <h1 className="m-0 p-0 tn-font-18">User Management</h1>
            </div>
            {this.props.showActions === "true" ? (
              <div className="float-right">
                <button
                  className="ui basic button tn-btn-primary"
                  onClick={this.props.handleAddNewUser}
                >
                  <i className="icon plus" /> Add User
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
                    <th style={{ minWidth: "150px" }}>Name</th>
                    <th style={{ minWidth: "150px" }}>Employee Code</th>
                    <th style={{ minWidth: "150px" }}>Email Id</th>
                    <th style={{ minWidth: "150px" }}>Designation</th>
                    <th style={{ minWidth: "100px" }}>Location</th>
                    <th style={{ minWidth: "100px" }}>Status</th>
                    {this.props.showActions === "true" ? (
                      <th style={{ minWidth: "150px" }}>Action</th>
                    ) : null}
                  </tr>
                </thead>
                {userDataBinding}
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  UserData: state.UserData,
});

export default connect(mapStateToProps, {
  getAllUsers,
  addUserData,
  deleteUserData,
})(userMangementList);
