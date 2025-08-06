import React, { Component } from "react";
import TextInput from "../common/textInput";
import MessageModal from "../common/messageModal";
import {
  getVariants,
  getAssemblyLine,
  saveWorkOrderDetails,
} from "../../actions/manageWorkOrderAction";
import { connect } from "react-redux";
import AutoCompleteSearchModal from "../common/autoCompleteSearchModal";
import { Dropdown } from "semantic-ui-react";

class CreateEditWorkOrder extends Component {
  state = {
    variantList: [],
    assemblyLineList: [],
    workOrderId: null,
    workorderCode: "",
    quantity: "",
    variantId: "",
    assemblyLineId: "",
    priorityList: [],
    showErrorDiv: false,
    errors: [],
    showMessageDiv: false,
    selectedVariant: "",
  };

  handleValidation() {
    let workorderCode = this.state.workorderCode;
    let quantity = this.state.quantity;
    let variantId = this.state.variantId;
    let assemblyLineId = this.state.assemblyLineId;
    let priority = this.state.priority;

    let errors = [];
    let formIsValid = true;

    if (!priority) {
      formIsValid = false;
      errors.push("Please select Priority");
    }

    if (!workorderCode) {
      formIsValid = false;
      errors.push("Please enter Work Order");
    }

    if (!quantity) {
      formIsValid = false;
      errors.push("Please enter Quantity");
    }

    if (!variantId) {
      formIsValid = false;
      errors.push("Please select Variant");
    }

    if (!assemblyLineId) {
      formIsValid = false;
      errors.push("Please select Assembly Line");
    }

    if (formIsValid === false) {
      this.setState({
        errors: errors,
        showErrorDiv: true,
      });
    }
    return formIsValid;
  }

  componentDidMount() {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    let locationId = user.locationId;
    this.props.getVariants();
    this.props.getAssemblyLine(locationId);
    const staticPriorityList = [
      { text: "NPPL", value: "NPPL" },
      { text: "FWS2", value: "FWS2" },
      { text: "FWS1", value: "FWS1" },
      { text: "FWS4", value: "FWS4" },
      { text: "FWE4", value: "FWE4" },
      { text: "OTHER", value: "OTHER" },
    ];
    this.setState({ priorityList: staticPriorityList });
    if (this.props.dataForEdit != null) {
      let { dataForEdit } = this.props;

      this.setState({
        workOrderId: dataForEdit.id,
        workorderCode: dataForEdit.name,
        quantity: dataForEdit.quantity,
        selectedVariant: dataForEdit.variant ? dataForEdit.variant.id : "",
        variantId: dataForEdit.variant ? dataForEdit.variant.id : "",
        assemblyLineId: dataForEdit.assemblyLine
          ? dataForEdit.assemblyLine.id
          : "",
        priority: dataForEdit.priority ? dataForEdit.priority : "",
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataProps.variants) {
      let variantsDatastateOptions = nextProps.dataProps.variants.map(
        (variant) => ({
          text: variant.code,
          value: variant.id,
        })
      );

      this.setState({ variantList: variantsDatastateOptions });
    }

    if (nextProps.dataProps.assemblyLine) {
      let assemblyLineDatastateOptions = nextProps.dataProps.assemblyLine.map(
        (assemblyLine) => ({
          text: assemblyLine.code,
          value: assemblyLine.id,
        })
      );
      this.setState({ assemblyLineList: assemblyLineDatastateOptions });
    }

    if (nextProps.dataProps.saveWorkOrderSuccess) {
      let message = "The Work Order is assigned successfully";
      if (this.props.dataForEdit !== null) {
        message = "The Work Order is updated successfully";
      }
      this.setState({
        showMessageDiv: true,
        messageValue: message,
      });
    }

    if (nextProps.dataProps.errorInProcessing) {
      let errors = ["Unable to save the data"];
      if (
        nextProps.dataProps.errorInProcessing != null &&
        nextProps.dataProps.errorInProcessing.data != null
      ) {
        errors = [nextProps.dataProps.errorInProcessing.data.message];
      }
      this.setState({
        errors: errors,
        showErrorDiv: true,
      });
    }
  }

  onModalCloseHandler = () => {
    this.props.handleCloseCreateEditWorkOrder();
  };

  onDataChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onAssemblyLineChangeHandler = (e, data) => {
    this.setState({
      assemblyLineId: data.value,
    });
  };
  onPriorityChangeHandler = (e, data) => {
    this.setState({
      priority: data.value,
    });
  };
  onSubmitHandler = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      const assignWorkOrder = {
        name: this.state.workorderCode,
        variantId: this.state.variantId,
        assemblyLineId: this.state.assemblyLineId,
        quantity: this.state.quantity,
        priority: this.state.priority,
        assignedTime: Date.now(),
        status: "InProgress",
      };
      if (this.state.workOrderId !== null) {
        assignWorkOrder["id"] = this.state.workOrderId;
      }
      this.props.saveWorkOrderDetails(assignWorkOrder, this.props.history);
    }
  };

  onVarinatChange = (e, data) => {
    this.setState({
      selectedVariant: data.value,
      variantId: data.value,
    });
  };

  render() {
    let error = this.state.errors;
    let errorBinding;
    let oprtionArray = [
      { text: "Select Assembly Line", value: "" },
      ...this.state.assemblyLineList,
    ];
    let priorityOptionArray = [
      { text: "Select Priority", value: "" },
      ...this.state.priorityList,
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
              onClick={this.props.handleCloseCreateEditWorkOrder}
            >
              <i className="close icon" />
            </div>

            <div className="col-12 my-4">
              <div className="float-left d-flex h-100 align-items-center">
                <h1 className="m-0 p-0 tn-font-21">
                  {this.props.dataForEdit === null
                    ? "Assign Work Order"
                    : "Edit Work Order"}
                </h1>
              </div>
            </div>
            {this.state.showErrorDiv === true ? (
              <div className="col-12 my-2" style={{ color: "red" }}>
                {errorBinding}
              </div>
            ) : null}

            <form onSubmit={this.onSubmitHandler}>
              <div
                className="w-100"
                style={{ overflow: "auto", height: "350px" }}
              >
                <div className="row m-0">
                  <div className="col-6 my-2">
                    <label>Work Order</label>
                    <div className="ui fluid form">
                      <TextInput
                        type="number"
                        name="workorderCode"
                        placeholder="Enter Work Order Code"
                        value={this.state.workorderCode}
                        onChange={this.onDataChangeHandler}
                      />
                    </div>
                  </div>

                  <div className="col-6 my-2">
                    <label>Variant</label>

                    <AutoCompleteSearchModal
                      optionsList={this.state.variantList}
                      text={this.state.selectedVariant}
                      handleOnChangeEvent={this.onVarinatChange}
                    />
                  </div>

                  <div className="col-6 my-3">
                    <div className="ui fluid form">
                      <label>Quantity</label>
                      <div className="field">
                        <TextInput
                          type="number"
                          name="quantity"
                          value={this.state.quantity}
                          placeholder="Enter Quantity"
                          onChange={this.onDataChangeHandler}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-6 my-3">
                    <label>Assembly Line</label>
                    <Dropdown
                      className="ui search dropdown w-100 tn-multi-dropdown selection"
                      placeholder="Select"
                      fluid
                      selection
                      options={oprtionArray}
                      onChange={this.onAssemblyLineChangeHandler}
                      value={this.state.assemblyLineId}
                    />
                  </div>

                  <div className="col-6 my-3">
                    <label>Priority</label>
                    <Dropdown
                      className="ui search dropdown w-100 tn-multi-dropdown selection"
                      placeholder="Select"
                      fluid
                      selection
                      options={priorityOptionArray}
                      onChange={this.onPriorityChangeHandler}
                      value={this.state.priority}
                    />
                  </div>
                  <div className="col-12 text-center my-3">
                    <button className="ui basic button tn-btn-primary">
                      {this.props.dataForEdit === null ? "Assign" : "Update"}
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

const mapStateToProps = (state) => ({
  dataProps: state.WorkOrder,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getVariants,
  getAssemblyLine,
  saveWorkOrderDetails,
})(CreateEditWorkOrder);