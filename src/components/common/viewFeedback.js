import React, { Component } from "react";
import { Button, Modal, TextArea } from "semantic-ui-react";

class ViewFeedback extends Component {
  state = { open: false };

  show = size => () => {
    this.setState({
      size,
      open: true
    });
  };
  close = () => this.setState({ open: false });

  render() {
    const { open, size } = this.state;

    return (
      <React.Fragment>
        <Button
          className="ui button tn-edit-btn float-right"
          onClick={this.show("small")}
        >
          read more
        </Button>
        <Modal
          size={size}
          open={open}
          onClose={this.close}
          className="tn-modal-body"
          style={{ height: "295px" }}
        >
          <i className="close icon" onClick={this.close}></i>
          <Modal.Header>Feedback Message</Modal.Header>
          <Modal.Content>
            <div className="ui fluid form">
              <div className="field">
                <TextArea
                  name="message"
                  rows="5"
                  value={this.props.textFeedback}
                  cols="46"
                  placeholder="Type your message..."
                  style={{
                    background: "#e8e8e8",
                    resize: "none",
                    borderRadius: "13px",
                    border: "none",
                    marginTop: "-2px"
                  }}
                ></TextArea>
              </div>
            </div>
            <hr />
            <Modal.Actions className="text-center">
              <div className="w-50 tn-cancel-btn">
                <Button
                  style={{
                    borderRadius: "20px",
                    marginLeft: "132px",
                    marginTop: "15px"
                  }}
                  className="ui basic button tn-btn-primary"
                  onClick={this.close}
                >
                  Close
                </Button>
              </div>
            </Modal.Actions>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ViewFeedback;
