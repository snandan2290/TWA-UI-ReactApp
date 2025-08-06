import React, { Component } from "react";
import { Button, Modal, TextArea } from "semantic-ui-react";
import { connect } from "react-redux";
import { feedbackResolve } from "../../actions/manageWorkOrderAction";

class ResolveModal extends Component {
  state = { open: false, message: "", showErrorDiv: false, errors: [] };

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
    let message = this.state.message;

    if (!message) {
      formIsValid = false;
      errors.push("Message is required");
    }
    if (formIsValid === false) {
      this.setState({
        errors: errors,
        showErrorDiv: true,
      });
    }
    return formIsValid;
  }

  onSubmitHandler = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      let data = {
        id: this.props.id,
        resolveMessage: this.state.message,
        isResolved: true,
      };
      this.props.feedbackResolve(data);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.FeedbackData.resolvedSuccessFully) {
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
        <Button className="ui button tn-green-btn" onClick={this.show("small")}>
          Resolve
        </Button>
        <Modal
          size={size}
          open={open}
          onClose={this.close}
          className="tn-modal-body"
          style={{ height: "295px" }}
        >
          <i className="close icon" onClick={this.close} />
          <Modal.Header>Resolve</Modal.Header>
          <Modal.Content>
            {this.state.showErrorDiv === true ? (
              <div className="errorDiv" style={{ marginTop: "-32px" }}>
                <small className="col-12" style={{ color: "red" }}>
                  {errorBinding}
                </small>
              </div>
            ) : null}
            <form onSubmit={this.onSubmitHandler}>
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
                      borderRadius: "13px",
                      border: "none",
                      marginTop: "-2px",
                    }}
                  ></TextArea>
                </div>
              </div>
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

export default connect(mapStateToProps, { feedbackResolve })(ResolveModal);