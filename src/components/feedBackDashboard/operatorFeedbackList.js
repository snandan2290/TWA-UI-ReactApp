import React, { Component } from "react";
import {
  getAllfeedback,
  resetFeedbackFlags,
} from "../../actions/manageWorkOrderAction";
import { getAllUserLocationList } from "../../actions/masterDataAction";
import { connect } from "react-redux";
import Pagination from "../../components/common/pagination";
import moment from "moment";
import MessageModal from "../../components/common/messageModal";
import { API_IMAGE_URL } from "./../../constants/configValues";
import ViewFeedback from "../common/viewFeedback";
import ImageCarousel from "../common/carouselModal";
import SelectDropdown from "../common/selectPageSize";
import { Dropdown } from "semantic-ui-react";
import AxiosConfig from "../../utils/axiosConfig";
import * as XLSX from "xlsx";
import axios from "axios";
import FeedbackActionModal from "../common/feedbackActionModal";
import ResolveModal from "../common/resolveModal";
import EscalateModal from "../common/escalateModal";

export class operatorFeedbackList extends Component {
  state = {
    pageSize: 10,
    totalResults: 0,
    feedbackData: [],
    feedbackDataHtml: [],
    currentPage: this.props.onSelectCurrentPage || 1,
    searchParam: "",
    searchlocationId: "",
    locationData: [],
    showMessageDiv: false,
    locationIdValue: this.props.auth.user.locationId,
    selectedSize: "",
  };

  getInitialFeedbackData = () => {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    let locationId =
      this.state.searchlocationId === ""
        ? user.locationId
        : this.state.searchlocationId;
    let pageNumber = this.state.currentPage;
    let pageSize = this.state.pageSize;
    this.props.getAllfeedback(locationId, pageNumber, pageSize);
    this.props.getAllUserLocationList();
    this.setState({
      searchlocationId: locationId,
    });
  };
  componentDidMount() {
    AxiosConfig.setupAxiosDefaults();
    this.getInitialFeedbackData();
  }

  onPageSizeChangeHandler = (e, data) => {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    let locationId =
      this.state.searchlocationId === ""
        ? user.locationId
        : this.state.searchlocationId;
    this.props.getAllfeedback(locationId, 1, data.value);
    this.setState({
      pageSize: data.value,
      currentPage: 1,
      selectedSize: data.value,
    });
  };

  nextPageClickHandler = (pageNumber) => {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    let locationId =
      this.state.searchlocationId === ""
        ? user.locationId
        : this.state.searchlocationId;
    let pageSize = this.state.pageSize;
    this.props.getAllfeedback(locationId, pageNumber, pageSize);
    this.setState({
      currentPage: pageNumber,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.FeedbackData) {
      this.getFeedbackDataList(nextProps.FeedbackData);
    }
    if (nextProps.UserData.location) {
      if (nextProps.UserData.location.length > 0) {
        let locationDatastateOptions = nextProps.UserData.location.map(
          (location) => ({
            text: location.code,
            value: location.id,
          })
        );
        this.setState({
          locationData: locationDatastateOptions,
        });
      }
    }

    if (nextProps.FeedbackData.resolvedSuccessFully) {
      let message = "Feedback Resolved Successfully";
      this.setState({
        showMessageDiv: true,
        messageValue: message,
      });
    }
    if (nextProps.FeedbackData.escalateSuccessFully) {
      let message = "Escalated Successfully";
      this.setState({
        showMessageDiv: true,
        messageValue: message,
      });
    }
  }

  onModalCloseHandler = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const locationId = this.state.searchlocationId || user.locationId;

    this.props.getAllfeedback(
      locationId,
      this.state.currentPage,
      this.state.pageSize
    );

    this.setState({
      showMessageDiv: false,
      messageValue: "",
    });

    this.props.resetFeedbackFlags();
  };

  searchByLocation = (e, data) => {
    let locationId = data.value;
    let pageSize = this.state.pageSize;
    let pageNumber = this.state.currentPage;
    this.props.getAllfeedback(locationId, pageNumber, pageSize);
    this.setState({
      currentPage: pageNumber,
      searchlocationId: locationId,
      locationIdValue: locationId,
    });
  };

  onSearchValueChange = (e) => {
    this.setState({
      searchParam: e.target.value,
    });
    if (e.target.value === "") {
      let user = localStorage.getItem("user");
      user = JSON.parse(user);
      let locationId =
        this.state.searchlocationId === ""
          ? user.locationId
          : this.state.searchlocationId;
      this.props.getAllfeedback(
        locationId,
        this.state.currentPage,
        this.state.pageSize,
        e.target.value
      );
      this.setState({
        searchlocationId: locationId,
      });
    }
  };

  onEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      let user = localStorage.getItem("user");
      user = JSON.parse(user);
      let locationId =
        this.state.searchlocationId === ""
          ? user.locationId
          : this.state.searchlocationId;
      this.props.getAllfeedback(
        locationId,
        this.state.currentPage,
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
    let locationId =
      this.state.searchlocationId === ""
        ? user.locationId
        : this.state.searchlocationId;
    this.props.getAllfeedback(
      locationId,
      this.state.currentPage,
      this.state.pageSize,
      this.state.searchParam
    );
    this.setState({
      currentPage: 1,
      searchlocationId: locationId,
    });
  };

  componentWillUpdate() {
    document.addEventListener(
      "play",
      function (e) {
        let audios = document.getElementsByTagName("audio");
        for (let i = 0, len = audios.length; i < len; i++) {
          if (audios[i] != e.target) {
            audios[i].pause();
          }
        }
      },
      true
    );
  }

  getStatusColor(status) {
    switch (status) {
      case "Pending":
        return "#FFA500";
      case "Resolved":
        return "green";
      case "Escalated":
        return "red";
      default:
        return "#808080";
    }
  }

  getFeedbackDataList = (FeedbackData) => {
    let feedbackDataHtml = FeedbackData.allFeedbacks.map((data, index) => {
      let num = (this.state.currentPage - 1) * this.state.pageSize;

      let date = moment(data.createdAt).format("L");
      let time = moment(data.createdAt).format("LTS");

      return (
        <tr key={index}>
          <td>{index + 1 + num}</td>
          <td>{data.workorder_no}</td>
          <td>{data.variant_code}</td>
          <td>{data.user ? data.user.username : ""}</td>
          <td>{data.assemblyLine ? data.assemblyLine.code : ""}</td>
          <td>{data.process ? data.process.name : ""}</td>
          <td>{data.category ? data.category : ""}</td>
          <td>
            {data.voiceFeedbackURL ? (
              <audio
                src={API_IMAGE_URL + data.voiceFeedbackURL}
                controls
                style={{ outline: "none", marginTop: "5px" }}
              />
            ) : data.textFeedback ? (
              <React.Fragment>
                {data.textFeedback.length < 55 ? (
                  <p>{data.textFeedback}</p>
                ) : (
                  <p>
                    {data.textFeedback.substr(0, 35)}...
                    <ViewFeedback textFeedback={data.textFeedback} />
                  </p>
                )}
              </React.Fragment>
            ) : null}
          </td>
          <td>
            {data.filePathURL !== null &&
            data.filePathURL.length !== 0 &&
            data.filePathURL !== undefined ? (
              <div>
                <div className="float-left">
                  <ImageCarousel imagePath={data.filePathURL} />
                </div>
              </div>
            ) : (
              "No Images"
            )}
          </td>
          <td>
            {date}
            <br />
            <small>{time}</small>
          </td>
          <td style={{ color: this.getStatusColor(data.Status) }}>
            {data.Status || "Pending"}
          </td>
          {Number(this.props.auth.user.locationId) ===
          Number(this.state.locationIdValue) ? (
            <td className="stickColumn text-centre">
               { console.log("isnew status" , data.isNew)}
              {
              
               data.isNew == true ? (
                <div className="float-left d-inline-block">
                  {/* {console.log(data.id)} */}
                <FeedbackActionModal id={data.id} status={data.Status}  />
              </div>
               ) : (
              <React.Fragment>
                <div className="float-left d-inline-block">
                  <ResolveModal id={data.id} />
                </div>
                <div className="float-right d-inline-block">
                  <EscalateModal id={data.id} isNew={data.isNew} />
                </div>
              </React.Fragment>
               )
              }
            </td>
          ) : null}
        </tr>
      );
    });
    this.setState({
      totalResults: FeedbackData.feedbackCount,
      FeedbackData: FeedbackData.allFeedbacks,
      feedbackDataHtml: feedbackDataHtml,
    });
  };

  downloadExcel = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const locationId = this.state.searchlocationId || user.locationId;

    try {
      const searchParam = this.state.searchParam?.trim() || "undefined";
      const totalResults = this.state.totalResults || 0;

      const response = await axios.get(
        `/getFeedbacksByLocation/${locationId}/1/${totalResults}/${encodeURIComponent(
          searchParam
        )}`
      );

      const allData = response.data.data?.rows;

      if (!allData || allData.length === 0) {
        alert("No data available to export.");
        return;
      }

      const exportData = allData.map((data, index) => ({
        "S. No": index + 1,
        "Work Order": data.workorder_no || "",
        Variant: data.variant_code || "",
        Operator: data.user?.username || "",
        Belt: data.assemblyLine?.code || "",
        Operation: data.process?.name || "",
        Category: data.category || "",
        Feedback:
          data.textFeedback || (data.voiceFeedbackURL ? "Audio Feedback" : ""),

        "Time Stamp":
          moment(data.createdAt).format("L") +
          " " +
          moment(data.createdAt).format("LTS"),
        Status: data.Status || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Feedback");

      XLSX.writeFile(workbook, "AllFeedbackList.xlsx");
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to export data. Check console.");
    }
  };

  render() {
    let numberOfPages = Math.ceil(
      this.state.totalResults / this.state.pageSize
    );

    let feedbackDataBinding;

    if (this.state.feedbackDataHtml.length > 0) {
      feedbackDataBinding = <tbody>{this.state.feedbackDataHtml}</tbody>;
    } else {
      feedbackDataBinding = (
        <tbody>
          <tr>
            <td colspan="8" style={{ textAlign: "center" }}>
              No Feedback Found
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <div className="tn-tabs tn-bg px-4">
        <div className="row tn-table-wrapper">
          {this.state.showMessageDiv ? (
            <MessageModal
              isOpen={this.state.showMessageDiv}
              message={this.state.messageValue}
              handleOkClick={this.onModalCloseHandler}
            />
          ) : null}
          <div className="col-12 my-4">
            <div className="float-left d-flex h-100 align-items-center">
              <h1 className="m-0 p-0 tn-font-18">Operator Feedback</h1>
            </div>

            <div className="float-right d-flex h-100 align-items-center">
              <button
                className="ui basic button tn-btn-primary"
                onClick={this.downloadExcel}
                disabled={this.state.feedbackDataHtml.length === 0}
              >
                Download Excel
              </button>
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
            <div
              className="col-3 my-2 float-left d-flex justify-content-center"
              style={{ marginLeft: "150px" }}
            >
              <span className="p-2">Location</span>
              <Dropdown
                className="ui search dropdown w-100 tn-multi-dropdown selection"
                placeholder="Select"
                fluid
                selection
                value={this.state.locationIdValue}
                options={this.state.locationData}
                onChange={this.searchByLocation}
              />
            </div>

            <div className="float-right" style={{ marginTop: "8px" }}>
              <div className="ui search">
                <div className="ui icon input">
                  <span className="p-2">Search</span>
                  <input
                    className="prompt tn-search-box"
                    type="text"
                    placeholder=""
                    value={this.state.searchParam}
                    onChange={this.onSearchValueChange}
                    onKeyDown={this.onEnterKeyPress}
                    maxLength="50"
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
          </div>

          <div className="col-12 my-3">
            <div className="styleTable">
              <table className="ui celled single table tn-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: "40px" }}>S. No.</th>
                    <th style={{ minWidth: "110px" }}>Work Order</th>
                    <th style={{ minWidth: "110px" }}>Variant</th>
                    <th style={{ minWidth: "100px" }}>Operator</th>
                    <th style={{ minWidth: "75px" }}>Belt</th>
                    <th style={{ minWidth: "100px" }}>Operation</th>
                    <th style={{ minWidth: "100px" }}>Category</th>
                    <th style={{ minWidth: "200px" }}>Feedback</th>
                    <th style={{ minWidth: "120px" }}>Image</th>
                    <th style={{ minWidth: "100px" }}>Time Stamp</th>
                    <th style={{ minWidth: "100px" }}>Status</th>
                    {Number(this.props.auth.user.locationId) ===
                    Number(this.state.locationIdValue) ? (
                      <th className="stickColumn" style={{ minWidth: "180px" }}>
                        Action
                      </th>
                    ) : null}
                  </tr>
                </thead>
                {feedbackDataBinding}
              </table>
            </div>
            <div className="float-right d-flex">
              {this.state.totalResults > 10 ? (
                <Pagination
                  totalResults={this.state.totalResults}
                  pages={numberOfPages}
                  nextPage={this.nextPageClickHandler}
                  currentPage={this.state.currentPage}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  FeedbackData: state.FeedbackData,
  UserData: state.UserData,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllfeedback,
  getAllUserLocationList,
  resetFeedbackFlags,
})(operatorFeedbackList);
