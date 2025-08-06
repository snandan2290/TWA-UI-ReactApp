import React, { Component } from "react";
import {
  getSOPByvariantId,
  getBOMByvariantId
} from "../../actions/masterDataAction";
import { connect } from "react-redux";
import { API_IMAGE_URL } from "./../../constants/configValues";
import axios from "axios";
const fileDownload = require("js-file-download");

class ViewSopBom extends Component {
  state = {
    sopList: [],
    bomList: [],
    activeTab: this.props.activeTab
  };

  componentDidMount() {
    this.props.getSOPByvariantId(this.props.viewSopBomId);
    this.props.getBOMByvariantId(this.props.viewSopBomId);
  }

  onSopTabClick = () => {
    this.setState({
      activeTab: "sop"
    });
  };

  onBomTabClick = () => {
    this.setState({
      activeTab: "bom"
    });
  };

  getTabActiveClass = tabName => {
    if (this.state.activeTab === tabName) {
      return "item active";
    } else {
      return "item";
    }
  };

  getTabDivActiveClass = tabName => {
    if (this.state.activeTab === tabName) {
      return "ui bottom attached tab segment active m-0 py-0";
    } else {
      return "ui bottom attached tab segment m-0 py-0";
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.SubVariantData.getSOPByvariantId !== undefined) {
      this.setState({
        sopList: nextProps.SubVariantData.getSOPByvariantId
      });
    }

    if (nextProps.SubVariantData.getBOMByvariantId !== undefined) {
      this.setState({
        bomList: nextProps.SubVariantData.getBOMByvariantId
      });
    }
  }

  populateBomData = () => {
    if (this.state.bomList.length === 0) {
      return (
        <tr>
          <td colspan="3" className="text-center">
            BOM is not available
          </td>
        </tr>
      );
    } else {
      return this.state.bomList.map((value, i) => {
        return (
          <tr>
            <td>{value.code}</td>
            <td>{value.uom}</td>
            <td>{value.name}</td>
          </tr>
        );
      });
    }
  };

  downloadSOP = imgUrl => {
    let fileName = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
    axios
      .get(imgUrl, {
        responseType: "blob"
      })
      .then(response => {
        var blob = new Blob([response.data], { type: "application/pdf" });

        var fileURL = URL.createObjectURL(blob);
        var newWin = window.open(fileURL);
        newWin.focus();
      });
  };

  populateSopData = () => {
    if (this.state.sopList.length === 0) {
      return (
        <tr>
          <td colspan="3" className="text-center">
            SOPs are not available
          </td>
        </tr>
      );
    } else {
      return this.state.sopList.map((value, i) => {
        return (
          <tr>
            <td>{value.process.name}</td>
            <td>
              {value.fileLocation.substring(
                value.fileLocation.lastIndexOf("\\") + 1
              )}
            </td>
            <td>
              <a
                href="#"
                onClick={() => this.downloadSOP(API_IMAGE_URL + value.fileUrl)}
              >
                View
              </a>
            </td>
          </tr>
        );
      });
    }
  };

  render() {
    return (
      <div className="col-12 col-md-12 col-lg-6 mb-4">
        <div className="tn-tabs tn-bg px-4 tabComponentBorder">
          <div className="row">
            <div className="tn-close">
              <i
                className="close icon"
                onClick={this.props.handleCloseViewSopBom}
              />
            </div>
            <div className="w-100">
              <div className="row m-0">
                <div className="tn-two-tabs mt-5">
                  <div
                    className="ui top attached tabular menu border-0 m-0"
                    style={{ width: "160px" }}
                  >
                    <a
                      className={this.getTabActiveClass("sop")}
                      data-tab="sop"
                      onClick={this.onSopTabClick}
                    >
                      SOP
                    </a>
                    <a
                      className={this.getTabActiveClass("bom")}
                      data-tab="bom"
                      onClick={this.onBomTabClick}
                    >
                      BOM
                    </a>
                  </div>
                  <div
                    className={this.getTabDivActiveClass("sop")}
                    data-tab="sop"
                  >
                    <div className="row">
                      <div className="col-12 my-4 tn-font-21">
                        Variant Code: {this.props.viewSopBomVariantCode}
                      </div>

                      <div
                        className="col-12"
                        // style={{
                        //   overflowX: "auto",
                        //   overflowY: "auto",
                        //   height: "283px"
                        // }}
                      >
                        <table className="ui celled single table tn-table">
                          <thead>
                            <tr>
                              <th style={{ minWidth: "150px" }}>Operation</th>
                              <th style={{ minWidth: "150px" }}>File Name</th>
                              <th style={{ minWidth: "100px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>{this.populateSopData()}</tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div
                    className={this.getTabDivActiveClass("bom")}
                    data-tab="bom"
                  >
                    <div className="row">
                      <div className="col-12 my-4 tn-font-21">
                        Variant Code: {this.props.viewSopBomVariantCode}
                      </div>

                      <div
                        className="col-12"
                        // style={{
                        //   overflowX: "auto",
                        //   overflowY: "auto",
                        //   height: "283px"
                        // }}
                      >
                        <table className="ui celled single table tn-table">
                          <thead>
                            <tr>
                              <th style={{ minWidth: "150px" }}>
                                Component Code
                              </th>
                              <th style={{ minWidth: "50px" }}>UOM</th>
                              <th style={{ minWidth: "150px" }}>Description</th>
                            </tr>
                          </thead>
                          <tbody>{this.populateBomData()}</tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  SubVariantData: state.SubVariantData
});

export default connect(
  mapStateToProps,
  {
    getSOPByvariantId,
    getBOMByvariantId
  }
)(ViewSopBom);
