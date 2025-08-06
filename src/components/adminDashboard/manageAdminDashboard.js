import React, { Component } from "react";
import Navbar from "../layouts/navbar";
import ManageLocation from "./../adminManageLocation/manageLocation";
import ManageVariant from "./../adminManageVariant/manageVariant";
import ManageOperation from "./../adminManageOperation/manageOperation";
import ManageComponent from "./manageComponent";

class ManageAdminDashboard extends Component {
  constructor() {
    super();
    if (
      localStorage.getItem("adminSelectedTab") === undefined ||
      localStorage.getItem("adminSelectedTab") === null
    ) {
      localStorage.setItem("adminSelectedTab", "component");
    }
    this.state = {
      activeTab: localStorage.getItem("adminSelectedTab")
    };
  }

  onVariantTabClick = e => {
    localStorage.setItem("adminSelectedTab", "variant");
    this.setState({
      activeTab: "variant"
    });
  };

  onOperationTabClick = e => {
    localStorage.setItem("adminSelectedTab", "operation");
    this.setState({
      activeTab: "operation"
    });
  };

  onLocationTabClick = e => {
    localStorage.setItem("adminSelectedTab", "location");
    this.setState({
      activeTab: "location"
    });
  };

  onComponentTabClick = e => {
    localStorage.setItem("adminSelectedTab", "component");
    this.setState({
      activeTab: "component"
    });
  };

  getActiveTabClass(tabName) {
    if (this.state.activeTab === tabName) {
      return "item active";
    } else {
      return "item";
    }
  }

  getActiveDivClass(tabName) {
    if (this.state.activeTab === tabName) {
      return "ui bottom attached tab segment active px-4";
    } else {
      return "ui bottom attached tab segment px-4";
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="body-wrapper">
          <div className="row m-0 justify-content-center">
            <div className="col-11 my-5">
              <div className="tn-tabs">
                <div className="ui top attached tabular menu d-flex justify-content-center border-0">
                  <a
                    className={this.getActiveTabClass("component")}
                    data-tab="component"
                    onClick={this.onComponentTabClick}
                  >
                    Component
                  </a>
                  <a
                    className={this.getActiveTabClass("variant")}
                    data-tab="variant"
                    onClick={this.onVariantTabClick}
                  >
                    Variant
                  </a>
                  <a
                    className={this.getActiveTabClass("operation")}
                    data-tab="operation"
                    onClick={this.onOperationTabClick}
                  >
                    Operation
                  </a>
                  <a
                    className={this.getActiveTabClass("location")}
                    data-tab="location"
                    onClick={this.onLocationTabClick}
                  >
                    Location
                  </a>
                </div>

                <div
                  className={this.getActiveDivClass("component")}
                  data-tab="component"
                >
                  <ManageComponent />
                </div>
                <div
                  className={this.getActiveDivClass("variant")}
                  data-tab="variant"
                >
                    <ManageVariant />
         
                </div>
                <div
                  className={this.getActiveDivClass("operation")}
                  data-tab="operation"
                >
                  <ManageOperation />
                </div>
                <div
                  className={this.getActiveDivClass("location")}
                  data-tab="location"
                >
                  <ManageLocation />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageAdminDashboard;
