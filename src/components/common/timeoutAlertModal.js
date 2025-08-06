import React, { Component } from 'react';
import alertImg from '../../style/images/alert-icon.png';
import { Button, Modal } from "semantic-ui-react";


export class TimeoutAlertModal extends Component {
    state = { open: this.props.isOpen, size: "small" };

    close = () => this.setState({ open: false });
  
    ok = () => {
      this.setState({ open: false });
      this.props.handleOkClick();
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
            <i className="close icon" onClick={this.ok}
            />
            <Modal.Content>
              <div className="text-center p-3">
                <img
                  src={alertImg}
                  className="img-fluid text-center"
                  alt=""
                  title=""
                  width="80"
                  height="80"
                />
              </div>
              <h2 className="text-center m-2">Alert!</h2>
              <p className="text-center p-2 m-0" style={{ fontSize: "14px" }}>
                {this.props.message}
              </p>
              <Modal.Actions className="text-center">
                <div className="tn-cancel-btn">
                  <Button className="ui black deny button m-2" onClick={this.ok}>
                    OK
                  </Button>
                </div>
              </Modal.Actions>
            </Modal.Content>
          </Modal>
        </div>
      );
    }
}

export default TimeoutAlertModal;
