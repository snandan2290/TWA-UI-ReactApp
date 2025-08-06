import React, { Component } from "react";
import TextInput from "../../components/common/textInput";
import { connect } from "react-redux";
import { addLocation } from "../../actions/masterDataAction";
import MessageModal from "../../components/common/messageModal";

export class createEditLocation extends Component {
  state = {
    locationId: "",
    LocationName: "",
    description: "",
    assemblyLine: [{ name: "", code: "" }],
    assemblyLineUpdated: [],
    assemblyLineDelete: [],
    showErrorDiv: false,
    errors: [],
    showMessageDiv: false
  };

  handleValidation() {
    let name = this.state.LocationName;
    let description = this.state.description;

    let errors = [];
    let formIsValid = true;

    if (name.match(/^\s+|\s+$/)) {
      formIsValid = false;
      errors.push("Location Name space not allowed");
    }
    if (!name) {
      formIsValid = false;
      errors.push("Please enter Location Name");
    }

    if (description.match(/^\s+|\s+$/)) {
      formIsValid = false;
      errors.push("Description space not allowed");
    }

    if (!description) {
      formIsValid = false;
      errors.push("Please enter Description");
    }

    //Check for Duplicate Belt Code
    let assemblyLineData = [];
    if (this.state.locationId !== null && this.state.locationId !== "") {
      assemblyLineData = this.state.assemblyLineDelete;
    } else {
      assemblyLineData = this.state.assemblyLine;
    }
    let uniqueAssCodeList = [];
    assemblyLineData.forEach(element => {
      //Skip if the belt is deleted during edit
      if (element.deleted === undefined) {
        if (uniqueAssCodeList.indexOf(element.code.toUpperCase()) === -1) {
          uniqueAssCodeList.push(element.code.toUpperCase());
        } else {
          formIsValid = false;
          errors.push(`Belt Code ${element.code} already exists`);
        }
      }
    });

    if (formIsValid === false) {
      this.setState({
        errors: errors,
        showErrorDiv: true
      });
    } else {
      this.setState({
        errors: errors,
        showErrorDiv: false
      });
    }
    return formIsValid;
  }

  onDataChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    if (this.props.dataForEdit != null) {
      let { dataForEdit } = this.props;
      this.setState({
        locationId: dataForEdit.id,
        description: dataForEdit.name,
        LocationName: dataForEdit.code,
        assemblyLine: dataForEdit.assemblyLine,
        assemblyLineUpdated: dataForEdit.assemblyLine,
        assemblyLineDelete: dataForEdit.assemblyLine
      });
    }
  }

  addAssamblyLine = e => {
    if (this.props.dataForEdit != null) {
      this.setState(prevState => ({
        assemblyLineUpdated: [
          ...prevState.assemblyLineUpdated,
          { name: "", code: "" }
        ],
        assemblyLineDelete: [
          ...prevState.assemblyLineDelete,
          { name: "", code: "" }
        ]
      }));
    }else{
      this.setState(prevState => ({
        assemblyLine: [...prevState.assemblyLine, { name: "", code: "" }]
      }));
    }
  };

  setDeleteAssemblyLine = id => {
    let assemblyLineArray = this.state.assemblyLineDelete;
    assemblyLineArray.find(result => {
      if (result.id === id) {
        result["deleted"] = true;
      }
    });
  };

  handleRemove = (id, index) => {
    if (id !== undefined) {
      let assemblyLineArray = this.state.assemblyLineUpdated;
      var newAssemblyLine = assemblyLineArray.filter(result => {
        return result.id !== id;
      });
      this.setState({
        assemblyLineUpdated: [...newAssemblyLine]
      });
      this.setDeleteAssemblyLine(id);
    } else {
      this.state.assemblyLine.splice(index, 1);
      this.state.assemblyLineUpdated.splice(index, 1);
      this.setState({
        assemblyLine: [...this.state.assemblyLine]
      });
    }
  };

  handleChange = e => {
    if (["name", "code"].includes(e.target.name)) {
      if (this.props.dataForEdit != null) {
        let assemblyLineUpdated = [...this.state.assemblyLineUpdated];
        assemblyLineUpdated[e.target.dataset.id][e.target.name] =
          e.target.value;
        this.setState({
          assemblyLineUpdated,
          assemblyLineDelete: assemblyLineUpdated
        });
      } else {
        let assemblyLine = [...this.state.assemblyLine];
        assemblyLine[e.target.dataset.id][e.target.name] = e.target.value;
        this.setState({ assemblyLine });
      }
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  onSubmitHandler = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      let locationData = {};
      if (this.state.locationId !== null && this.state.locationId !== "") {
        let assembly = [...this.state.assemblyLine, ...this.state.assemblyLineDelete]
        locationData["id"] = this.state.locationId;
        locationData["assemblyLine"] = assembly;
      } else {
        locationData["assemblyLine"] = this.state.assemblyLine;
      }
      locationData["name"] = this.state.LocationName;
      locationData["description"] = this.state.description;

      this.props.addLocation(locationData);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.LocationData.errorInProcessing) {
      let errors = ["Unable to save the data"];
      this.setState({
        errors: errors,
        showErrorDiv: true
      });
    }

    if (nextProps.LocationData.saveLocationSuccessFully) {
      let message = "Location added successfully";
      if (this.props.dataForEdit !== null) {
        message = "Location updated successfully";
      }
      this.setState({
        showMessageDiv: true,
        messageValue: message
      });
    }
  }

  onModalCloseHandler = () => {
    this.props.handleCloseCreateEditLocation();
  };

  render() {
    let MapDataAssemblyLine;

    if (this.props.dataForEdit !== null) {
      MapDataAssemblyLine = this.state.assemblyLineUpdated;
    } else {
      MapDataAssemblyLine = this.state.assemblyLine;
    }
    let error = this.state.errors;
    let errorBinding;

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
        <div className="tn-tabs tn-bg px-4 tabComponentBorder">
          <div className="row">
            <div
              className="close tn-close"
              onClick={this.props.handleCloseCreateEditLocation}
            >
              <i className="close icon" />
            </div>

            <div className="col-12 my-4">
              <div className="float-left d-flex h-100 align-items-center">
                <h1 className="m-0 p-0 tn-font-21">
                  {this.props.dataForEdit === null
                    ? "Add Location"
                    : "Edit Location"}
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
                    <div className="ui fluid form">
                      <TextInput
                        type="text"
                        name="LocationName"
                        placeholder="Location Name"
                        value={this.state.LocationName}
                        onChange={this.onDataChangeHandler}
                        maxlength="50"
                      />
                    </div>
                  </div>

                  <div className="col-6 my-2">
                    <label>Description</label>
                    <div className="ui fluid form">
                      <TextInput
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={this.state.description}
                        onChange={this.onDataChangeHandler}
                        maxlength="50"
                      />
                    </div>
                  </div>

                  <hr className="w-100" />
                  {MapDataAssemblyLine.map((val, idx) => {
                    let nameId = `name-${idx}`,
                      codeId = `code-${idx}`;
                    return (
                      <div className="w-100" key={idx}>
                        <div className="row m-0 pb-3">
                          <div className="col-6 my-2">
                            <label>Belt </label>
                            <div className="ui fluid form">
                              <input
                                type="text"
                                name="name"
                                placeholder="Belt"
                                data-id={idx}
                                id={nameId}
                                value={MapDataAssemblyLine[idx].name}
                                onChange={this.handleChange}
                                className="tn-input"
                                autoComplete="off"
                                maxLength="50"
                              />
                            </div>
                          </div>

                          <div className="col-5 my-2">
                            <label htmlFor={codeId}>Belt Code</label>
                            <div className="ui fluid form">
                              <input
                                type="text"
                                name="code"
                                className="tn-input"
                                placeholder="Enter Code"
                                data-id={idx}
                                id={codeId}
                                value={MapDataAssemblyLine[idx].code}
                                onChange={this.handleChange}
                                autoComplete="off"
                                maxLength="50"
                              />
                            </div>
                          </div>

                          <div className="col-1 pl-0 mt-4 pt-2">
                            <div
                              className="d-flex h-100 align-items-center"
                              onClick={this.handleRemove.bind(
                                this,
                                val.id,
                                idx
                              )}
                            >
                              <i className="close icon" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="row m-0 pb-2">
                    <div className="col-12" onClick={this.addAssamblyLine}>
                      <i className="icon plus tn-plus" />
                    </div>
                  </div>

                  <div className="col-12 text-center my-3">
                    <button className="ui basic button tn-btn-primary">
                      Save
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
  LocationData: state.LocationData
});

export default connect(
  mapStateToProps,
  { addLocation }
)(createEditLocation);
