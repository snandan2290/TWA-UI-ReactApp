import React, { Component } from "react";
import { Button, Modal } from "semantic-ui-react";

class ConfirmationModal extends Component {
  state = { size: "small", open: this.props.isOpen };

  close = () => {
    this.setState({ open: false });
    this.props.onClickCancelOperation();
  };

  render() {
    const { open, size } = this.state;

    return (
      <div>
        <Modal
          size={size}
          open={open}
          onClose={this.close}
          className="tn-modal-body"
        >
          <i className="close icon" onClick={this.close} />
          <Modal.Header>Confirm Message</Modal.Header>
          <Modal.Content>
            <p className="text-center p-5 m-0" style={{ fontSize: "16px" }}>
              {this.props.msgToDisplay}
            </p>
            <Modal.Actions className="text-center">
              <div className="w-50 float-left text-right tn-cancel-btn">
                <Button className="ui black deny button" onClick={this.close}>
                  Cancel
                </Button>
              </div>
              <div className="w-50 float-right text-left tn-yes-btn">
                <Button
                  positive
                  content="Yes"
                  onClick={this.props.onClickConfirmOperation}
                />
              </div>
            </Modal.Actions>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default ConfirmationModal;
