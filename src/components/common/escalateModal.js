import React, { Component } from "react";
import { Button, Modal, TextArea } from "semantic-ui-react";
import { connect } from "react-redux";
import { feedbackEscalate } from "../../actions/manageWorkOrderAction";
import isEmpty from "../../validation/isEmpty";

export class EscalateModal extends Component {
  state = {
    open: false,
    showErrorDiv: false,
    errors: [],
    message: "",
    cc: "",
    email: "",
  };

  onDataChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      showErrorDiv: false,
    });
  };

  show = (size) => () => this.setState({ size, open: true });
  close = () => {
    this.setState({ open: false });
  };

  handleValidation() {
    let errors = [];
    let formIsValid = true;

    const { email, cc, message } = this.state;
    const email_regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gim;

    if (!email || !email_regex.test(email)) {
      formIsValid = false;
      errors.push("Please enter a valid To email address");
    }

    if (this.props.isNew === true) {
      if (!cc || email_regex.test(cc)) {
        formIsValid = false;
        errors.push("Please enter a valid CC email address");
      }
    }

    if (this.props.isNew === false) {
      if (!message || message.trim() === "") {
        formIsValid = false;
        errors.push("Please enter a message");
      }
    }

    if (!formIsValid) {
      this.setState({
        errors,
        showErrorDiv: true,
      });
    }

    return formIsValid;
  }

  onSubmitHandler = (e) => {
    e.preventDefault();

    if (this.handleValidation()) {
      const data = {
        id: this.props.id,
        escalateMessage: this.state.message,
        isEscalated: true,
        escalatedTo: this.state.email,
        escalatedCC: this.state.cc,
        isNew: this.props.isNew,
      };

      this.props
        .feedbackEscalate(data)
        .then(() => {
          this.setState({
            open: false,
            email: "",
            cc: "",
            message: "",
            errors: [],
            showErrorDiv: false,
          });
        })
        .catch((err) => {
          //Handle error callback
          console.error("Escalate failed", err);
          this.setState({
            errors: ["Escalate failed. Please try again."],
            showErrorDiv: true,
          });
        });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.FeedbackData.escalateSuccessFully) {
      this.setState({ open: false });
      if (this.props.setOpen) {
        this.props.setOpen(false);
      }
    }
  }

  render() {
    const { open, size } = this.state;
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
      <div>
        <Button
          className="ui button tn-delete-btn"
          onClick={this.show("small")}
        >
          Escalate
        </Button>
        <Modal
          size={size}
          open={open}
          onClose={this.close}
          className="tn-modal-body"
          style={{ height: "335px" }}
        >
          <i className="close icon" onClick={this.close} />
          <Modal.Header>Escalate</Modal.Header>
          <Modal.Content>
            {this.state.showErrorDiv === true ? (
              <div className="errorDiv" style={{ marginTop: "-32px" }}>
                <small className="col-12" style={{ color: "red" }}>
                  {errorBinding}
                </small>
              </div>
            ) : null}
            <form onSubmit={this.onSubmitHandler}>
              <div className="col-12 mb-2">
                <div className="row">
                  <div
                    className="col-12 mb-2"
                    style={{ marginLeft: "-16px", marginTop: "-19px" }}
                  >
                    <h5>To</h5>
                  </div>
                </div>
                <div className="col-10">
                  <div className="ui fluid form mb-3">
                    <div className="field">
                      <input
                        type="text"
                        name="email"
                        placeholder="Enter concerned person email id"
                        value={this.state.email}
                        onChange={this.onDataChangeHandler}
                        maxlength="50"
                        className="tn-input"
                        style={{ marginLeft: "-27px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {this.props.isNew === false ? (
                <div className="ui fluid form">
                  <div className="field">
                    <TextArea
                      name="message"
                      rows="5"
                      onChange={this.onDataChangeHandler}
                      cols="46"
                      placeholder="Type your message..."
                      style={{
                        background: "#e8e8e8",
                        resize: "none",
                        borderRadius: "14px",
                        border: "none",
                        marginTop: "-5px",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="col-12 mt-3">
                  <div className="row mt-4">
                    <div
                      className="col-12 mb-2"
                      style={{ marginLeft: "-16px", marginTop: "-19px" }}
                    >
                      <h5>CC</h5>
                    </div>
                  </div>
                  <div className="col-10">
                    <div className="ui fluid form mb-3">
                      <div className="field">
                        <input
                          type="text"
                          name="cc"
                          placeholder="Enter concerned person email id"
                          value={this.state.cc}
                          onChange={this.onDataChangeHandler}
                          maxlength="50"
                          className="tn-input"
                          style={{ marginLeft: "-27px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <hr />
              <Modal.Actions className="text-center">
                <div className="w-50 float-left text-right tn-cancel-btn mb-3">
                  <Button
                    style={{ borderRadius: "20px" }}
                    className="ui basic button tn-btn"
                    onClick={this.close}
                  >
                    Close
                  </Button>
                </div>
                <div className="w-50 float-right text-left tn-cancel-btn mb-3">
                  <Button className="ui basic button tn-btn-primary">
                    Send
                  </Button>
                </div>
              </Modal.Actions>
            </form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  FeedbackData: state.FeedbackData,
});

export default connect(mapStateToProps, { feedbackEscalate })(EscalateModal);