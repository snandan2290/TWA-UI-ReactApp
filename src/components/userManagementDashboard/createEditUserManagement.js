import React, { Component } from "react";
import TextInput from "../../components/common/textInput";
import { connect } from "react-redux";
import {
  getAllUserLocationList,
  addUserData
} from "../../actions/masterDataAction";
import { resetPassword } from "../../actions/loginAction";
import MessageModal from "../../components/common/messageModal";
import isEmpty from "../../validation/isEmpty";
import DeleteModal from "../common/deleteModal";
import { Dropdown } from "semantic-ui-react";

export class createEditUserManagement extends Component {
  state = {
    userId: "",
    name: "",
    empCode: "",
    email: "",
    designation: "",
    locationList: [],
    locationId: "",
    isAdmin: false,
    isActive: true,
    showErrorDiv: false,
    errors: [],
    showMessageDiv: false
  };

  handleValidation() {
    let name = this.state.name;
    let empCode = this.state.empCode;
    let email = this.state.email;
    let designation = this.state.designation;
    let locationId = this.state.locationId;
    let errors = [];
    let formIsValid = true;

    let remail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gim;

    if (!locationId) {
      formIsValid = false;
      errors.push("Please select Location");
    }
    if (name.match(/^\s+|\s+$/)) {
      formIsValid = false;
      errors.push("Name space not allowed");
    }
    if (!name) {
      formIsValid = false;
      errors.push("Please enter Name");
    }

    if (empCode.match(/^\s+|\s+$/g)) {
      formIsValid = false;
      errors.push("Employee code space not allowed");
    }

    if (!empCode) {
      formIsValid = false;
      errors.push("Please enter Employee Code");
    }

    if (email.match(/^\s+|\s+$/g)) {
      formIsValid = false;
      errors.push("Email space not allowed");
    }

    if (!isEmpty(email)) {
      if (!remail.test(email)) {
        formIsValid = false;
        errors.push("Invalid email address");
      }
    }

    if (!designation) {
      formIsValid = false;
      errors.push("Please select Designation");
    }

    if (formIsValid === false) {
      this.setState({
        errors: errors,
        showErrorDiv: true
      });
    }
    return formIsValid;
  }

  onDataChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onDesignationChangeHandler = (e,data) => {
    this.setState({
     designation:data.value
    });
  };
  onLocationChangeHandler = (e,data) => {
    this.setState({
      locationId:data.value
    });
  };


  handleChangeName = e => {
    let nameVal = "";
    nameVal = e.target.value;
    if (nameVal.match("^[a-zA-Z-, ]*$") !== null) {
      this.setState({
        name: e.target.value,
        showErrorDiv: false
      });
    } else {
      let errors = ["Name takes only alphbets"];
      this.setState({
        errors: errors,
        showErrorDiv: true
      });
    }
  };

  adminHandler = e => {
    this.setState({
      isAdmin: !this.state.isAdmin
    });
  };
  isActiveHandler = e => {
    this.setState({
      isActive: !this.state.isActive
    });
  };

  componentDidMount() {
    this.props.getAllUserLocationList();
    if (this.props.dataForEdit != null) {
      let { dataForEdit } = this.props;
      this.setState({
        userId: dataForEdit.id,
        name: dataForEdit.username,
        empCode: dataForEdit.uniqueUserId,
        email: dataForEdit.email,
        designation: dataForEdit.role,
        locationId: dataForEdit.location ? dataForEdit.location.id : "",
        isActive: dataForEdit.isActive,
        isAdmin: dataForEdit.isAdmin
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UserData.location) {
      if(nextProps.UserData.location.length > 0){
        let locationDatastateOptions = nextProps.UserData.location.map(
          location => ({
            text: location.code,
            value: location.id
          })
        );
        this.setState({
          locationList: locationDatastateOptions
        });
      }
    }

    if (nextProps.UserData.errorInProcessing) {
      let errors = ["Unable to save the data"];
      if (
        nextProps.UserData.errorInProcessing != null &&
        nextProps.UserData.errorInProcessing.data != null
      ) {
        errors = [nextProps.UserData.errorInProcessing.data.message];
      }
      this.setState({
        errors: errors,
        showErrorDiv: true
      });
    }

    if (nextProps.UserData.saveSuccessFully) {
      let message = "New User added successfully";
      if (this.props.dataForEdit !== null) {
        message = "User updated successfully";
      }
      this.setState({
        showMessageDiv: true,
        messageValue: message
      });
    }
    if (nextProps.UserData.resetPasswordSucceessfully) {
      let message = "Password Reset successfully";
      this.setState({
        showMessageDiv: true,
        messageValue: message
      });
    }
  }

  onModalCloseHandler = () => {
    this.props.handleCloseCreateEditUser();
  };

  nameCaps = name => name.split(' ').map( value =>  value.substring(0,1).toUpperCase()+ 
  value.substring(1)).join(' ');

  onSubmitHandler = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      let userName = this.nameCaps(this.state.name);
      const userData = {
        username: userName,
        locationId: this.state.locationId,
        role: this.state.designation,
        email: this.state.email,
        uniqueUserId: this.state.empCode,
        isAdmin: this.state.isAdmin,
        isActive: this.state.isActive
      };
      if (this.state.userId !== null && this.state.userId !== "") {
        userData["id"] = this.state.userId;
      }
      this.props.addUserData(userData);
    }
  };

  resetPassword = () => {
    let userId = {
      id: this.props.dataForEdit.id
    };
    this.props.resetPassword(userId);
  };

  render() {
    let error = this.state.errors;
    let errorBinding;
    let oprtionArrayOfLocation = [ {text: "Select Location", value:""},...this.state.locationList ];
  
    let oprtionArray = [
      {text: "Select Designation", value:""},
      {text: "Operator", value: "Operator"},
      {text: "Admin", value: "Admin"},
      {text: "Supervisor", value: "Supervisor"}
  ];

    if (error.length !== 0) {
      errorBinding = error.map((res, i) => {
        return <ul key={i + 1}>{res ? <li>{res}</li> : ""}</ul>;
      });
    } else {
      errorBinding = null;
    }
    return (
      <div className="col-12 col-md-12 col-lg-6 mb-4">
        {this.state.showMessageDiv ? (
          <MessageModal
            isOpen={true}
            message={this.state.messageValue}
            handleOkClick={this.onModalCloseHandler}
          />
        ) : null}
        <div className="tn-tabs tn-bg px-4">
          <div className="row">
            <div
              className="close tn-close"
              onClick={this.props.handleCloseCreateEditUser}
            >
              <i className="close icon" />
            </div>
            <div className="col-12 my-4">
              <div className="col-6 float-left d-flex h-100 align-items-center">
                <h1 className="m-0 p-0 tn-font-21">
                  {this.props.dataForEdit === null
                    ? "Add New User"
                    : "Edit User"}
                </h1>
              </div>
            </div>
            {this.state.showErrorDiv === true ? (
              <div className="col-12 my-2" style={{ color: "red" }}>
                {errorBinding}
              </div>
            ) : null}

            <form onSubmit={this.onSubmitHandler}>
              <div className="w-100">
                <div className="row m-0">
                  <div className="col-6 my-2">
                    <label>Location</label>
                    <Dropdown
                    className="ui search dropdown w-100 tn-multi-dropdown selection"
                    placeholder="Select"
                    fluid
                    selection
                    options={oprtionArrayOfLocation}
                    onChange={this.onLocationChangeHandler}
                    value={this.state.locationId}
                  />
                  </div>

                  <div className="col-6 my-2">
                    <label>Name</label>
                    <div className="ui fluid form">
                      <TextInput
                        type="text"
                        name="name"
                        maxlength="50"
                        placeholder="Enter Name"
                        value={this.state.name}
                        onChange={this.handleChangeName}
                      />
                    </div>
                  </div>

                  <div className="col-6 my-2">
                    <label>Employee Code</label>
                    <div className="ui fluid form">
                      <TextInput
                        type="text"
                        name="empCode"
                        maxlength="50"
                        placeholder="Enter Employee Code"
                        value={this.state.empCode}
                        onChange={this.onDataChangeHandler}
                      />
                    </div>
                  </div>

                  <div className="col-6 my-2">
                    <div className="ui fluid form">
                      <label>Email</label>
                      <div className="field">
                        <TextInput
                          type="text"
                          name="email"
                          value={this.state.email}
                          placeholder="Email"
                          maxlength="50"
                          onChange={this.onDataChangeHandler}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6 my-2">
                    <label>Designation</label>
                    <Dropdown
                    className="ui search dropdown w-100 tn-multi-dropdown selection"
                    placeholder="Select"
                    fluid
                    selection
                    options={oprtionArray}
                    onChange={this.onDesignationChangeHandler}
                    value={this.state.designation}
                  />
                  </div>
                 {this.state.designation !== "Admin" ?
                  <div className="col-6 my-2">
                    <label>Is Admin</label>
                    <br />
                    <label style={{ marginRight: "4px" }}>No </label>
                    <div className="ui toggle checkbox tn-toggle">
                      <input
                        type="checkbox"
                        name="public"
                        checked={this.state.isAdmin}
                        onChange={this.adminHandler}
                      />
                      <label className="my-2">Yes</label>
                    </div>
                  </div>:<div className="col-6 my-2"></div>}


                  <div className="col-6 my-2">
                    <label>Status</label>
                    <br />
                    <label style={{ marginRight: "4px" }}>ACTIVE</label>
                    <div className="ui toggle checkbox tn-toggle">
                      <input 
                        type="checkbox"
                        name="public"
                        checked={this.state.isActive}
                        onChange={this.isActiveHandler}
                      />
                      <label className="my-2">&nbsp;</label>
                    </div>
                  </div>
                  <div className="col-6 my-2">
                    <label>&nbsp;</label>
                    <br />
                    {this.props.dataForEdit !== null ? (
                <div className="col-12 p-0">
                  <DeleteModal
                    msgToDisplay={`Are you sure you want to reset ${this.state.name} password`}
                    deleteClick={this.resetPassword}
                    ButtonMessage={`Reset Password`}
                    buttonCls={`ui button ui basic button tn-btn-primary`}
                    headerMessage={`Confirm Reset Password`}
                  />
                </div>
              ) : null}
                  </div>
                  <div className="col-12 text-center my-5">
                    <button type="submit" className="ui basic button tn-btn-primary">
                      {this.props.dataForEdit === null ? "Save" : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  UserData: state.UserData
});

export default connect(
  mapStateToProps,
  {
    getAllUserLocationList,
    addUserData,
    resetPassword
  }
)(createEditUserManagement);
