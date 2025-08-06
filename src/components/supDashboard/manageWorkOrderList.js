import React, { Component } from "react";
import { getAllWorkOrder } from "../../actions/manageWorkOrderAction";
import Pagination from "../common/pagination";
import { markCompleteDeleteWorkOrderDetails } from "../../actions/manageWorkOrderAction";
import { connect } from "react-redux";
import DeleteModal from "../common/deleteModal";
import MarkupModal from "../common/markupModal";
import MessageModal from "../common/messageModal";
import SelectDropdown from "../common/selectPageSize";

class ManageWorkOrderList extends Component {
  state = {
    pageSize: 10,
    totalResults: 0,
    currentPage: this.props.onSelectCurrentPage || 1,
    workOrder: [],
    workOrderDataHtml: [],
    showMessageDiv: false,
    searchParam: this.props.existingSearchParam || "",
    selectedSize: "",
    selectedPriorities: {},
  };

  getPriorityData(code) {
    const priorityMap = {
      NPPL: { label: "NPPL", tooltip: "Top Most Priority in Conversion" },
      FWS2: { label: "FWS2", tooltip: "1st Priority in Conversion" },
      FWS1: { label: "FWS1", tooltip: "2nd Priority in Conversion" },
      FWS4: { label: "FWS4", tooltip: "Priority in Regular Conversion" },
      FWE4: { label: "FWE4", tooltip: "Priority with 100% FTA" },
      OTHER: { label: "OTHER", tooltip: "Seasonal Priority Order" },
    };
    return priorityMap[code] || priorityMap["OTHER"];
  }

  getInitialWorkOrderData = () => {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    let locationId = user.locationId;
    let pageNumber = this.state.currentPage;
    let pageSize = this.state.pageSize;
    this.props.getAllWorkOrder(
      locationId,
      pageNumber,
      pageSize,
      this.state.searchParam
    );
  };

  componentDidMount() {
    this.getInitialWorkOrderData();
  }
  handlePriorityChange = (id, newPriority) => {
    const updateData = {
      id: id,
      priority: newPriority,
    };
    this.props.markCompleteDeleteWorkOrderDetails(updateData);
  };
  onPageSizeChangeHandler = (e, data) => {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    let locationId = user.locationId;
    this.props.getAllWorkOrder(
      locationId,
      1,
      data.value,
      this.state.searchParam
    );
    this.setState({
      pageSize: data.value,
      currentPage: 1,
      selectedSize: data.value,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.WorkOrder) {
      this.getWorkOrderDataList(nextProps.WorkOrder);
    }
    if (nextProps.WorkOrder.markCompleteDeleteSuccess) {
      this.getInitialWorkOrderData();
    }
    if (nextProps.WorkOrder.markAllWorkOrderAsComplete) {
      let user = localStorage.getItem("user");
      user = JSON.parse(user);
      this.props.getAllWorkOrder(
        user.locationId,
        1,
        this.state.pageSize,
        this.state.searchParam
      );
      this.setState({
        currentPage: 1,
      });
    }
  }

  onMessageModalCloseHandler = () => {
    this.props.handleActionComplete();
  };

  nextPageClickHandler = (pageNumber) => {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    let locationId = user.locationId;
    let pageSize = this.state.pageSize;
    this.props.getAllWorkOrder(
      locationId,
      pageNumber,
      pageSize,
      this.state.searchParam
    );
    this.setState({
      currentPage: pageNumber,
    });
  };

  markupHandler = (id) => {
    let markupData = {
      id: id,
      status: "Complete",
    };
    this.props.markCompleteDeleteWorkOrderDetails(markupData);
  };

  deleteHandler = (id) => {
    let deleteData = {
      id: id,
      isActive: false,
    };
    this.props.markCompleteDeleteWorkOrderDetails(deleteData);
  };

  onSearchValueChange = (e) => {
    this.setState({
      searchParam: e.target.value,
    });
    if (e.target.value === "") {
      let user = localStorage.getItem("user");
      user = JSON.parse(user);
      let locationId = user.locationId;
      this.props.getAllWorkOrder(
        locationId,
        1,
        this.state.pageSize,
        e.target.value
      );
    }
  };

  onEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      let user = localStorage.getItem("user");
      user = JSON.parse(user);
      let locationId = user.locationId;
      this.props.getAllWorkOrder(
        locationId,
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
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    let locationId = user.locationId;
    this.props.getAllWorkOrder(
      locationId,
      1,
      this.state.pageSize,
      this.state.searchParam
    );
    this.setState({
      currentPage: 1,
    });
  };

  getWorkOrderDataList = (workOrderData) => {
    let workOrderDataHtml = workOrderData.allWorkOrder.map((data, index) => {
      let activeClass;
      if (
        this.props.SelectedData !== undefined &&
        this.props.SelectedData !== null
      ) {
        activeClass = this.props.SelectedData === data.id ? "tn-tbl-color" : "";
      }

      let num = (this.state.currentPage - 1) * this.state.pageSize;
      const selectedPriority = data.priority || "OTHER";

      return (
        <tr key={index} className={activeClass}>
          <td>{index + 1 + num}</td>
          <td>{data.name ? data.name : ""}</td>
          <td>{data.variant ? data.variant.code : ""}</td>
          <td>{data.variant ? data.variant.description : ""}</td>
          <td>{data.quantity ? data.quantity : ""}</td>
          <td>{data.assemblyLine ? data.assemblyLine.code : ""}</td>
          <td>
            <select
              value={selectedPriority}
              onChange={(e) =>
                this.handlePriorityChange(data.id, e.target.value)
              }
              className="form-select"
              style={{ padding: "4px", borderRadius: "4px", width: "100%" }}
            >
              {["NPPL", "FWS2", "FWS1", "FWS4", "FWE4", "OTHER"].map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </td>
          <td>{data.type}</td>
          <td>{data.cluster}</td>
          <td>{data.UCP}</td>
          {this.props.showActions === "true" ? (
            <td className="w-100 text-center d-inline-block">
              <div className="float-left d-inline-block">
                <MarkupModal
                  markupClick={this.markupHandler.bind(this, data.id)}
                />
              </div>
              <div className="d-inline-block">
                <button
                  className="ui button tn-edit-btn"
                  onClick={() =>
                    this.props.handleEditWorkOrder(
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
                  msgToDisplay="Are you sure you want to permanently delete the selected work order?"
                  deleteClick={this.deleteHandler.bind(this, data.id)}
                />
              </div>
            </td>
          ) : null}
        </tr>
      );
    });
    this.setState({
      totalResults: workOrderData.count,
      workOrder: workOrderData.WorkOrder,
      workOrderDataHtml: workOrderDataHtml,
    });
  };

  render() {
    let numberOfPages = Math.ceil(
      this.state.totalResults / this.state.pageSize
    );

    let manageWorkOrderDataBinding;

    if (this.state.workOrderDataHtml.length > 0) {
      manageWorkOrderDataBinding = (
        <tbody>{this.state.workOrderDataHtml}</tbody>
      );
    } else {
      manageWorkOrderDataBinding = (
        <tbody>
          <tr>
            <td colspan="7" style={{ textAlign: "center" }}>
              No Work Order Found
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <div className="tn-tabs tn-bg px-4">
        {this.state.showMessageDiv ? (
          <MessageModal
            isOpen={true}
            message={this.state.messageValue}
            handleOkClick={this.onMessageModalCloseHandler}
          />
        ) : null}
        <div className="row tn-table-wrapper">
          <div className="col-12 my-3 pt-3">
            <div className="row d-flex align-items-center">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 float-left d-flex h-100 align-items-center my-2">
                <h1 className="m-0 p-0 tn-font-18">Manage Work Order</h1>
              </div>
              {this.props.showActions === "true" ? (
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 float-right">
                  <button
                    className="ui basic button tn-btn-primary float-right"
                    onClick={this.props.handleAssignWorkOrder}
                  >
                    Assign Work Order
                  </button>
                  <button
                    className="ui basic button tn-btn-primary float-right mr-2"
                    onClick={this.props.handleUploadWorkOrder}
                  >
                    Upload Work Order
                  </button>
                </div>
              ) : null}
            </div>
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
                    <th style={{ minWidth: "150px" }}>Work Order</th>
                    <th style={{ minWidth: "150px" }}>Variant</th>
                    <th style={{ minWidth: "150px" }}>Caliber</th>
                    <th style={{ minWidth: "100px" }}>Quantity</th>
                    <th style={{ minWidth: "100px" }}>Assembly Line</th>
                    <th style={{ minWidth: "120px" }}>Priority</th>
                    <th style={{ minWidth: "100px" }}>Type</th>
                    <th style={{ minWidth: "100px" }}>Cluster</th>
                    <th style={{ minWidth: "100px" }}>UCP</th>
                    {this.props.showActions === "true" ? (
                      <th style={{ minWidth: "250px" }}>Action</th>
                    ) : null}
                  </tr>
                </thead>
                {manageWorkOrderDataBinding}
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
  WorkOrder: state.WorkOrder,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllWorkOrder,
  markCompleteDeleteWorkOrderDetails,
})(ManageWorkOrderList);