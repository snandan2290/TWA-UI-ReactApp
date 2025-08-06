import React, { Component } from "react";
import { Button, Modal } from "semantic-ui-react";
import Tick from '../../style/images/tick.svg';

class MarkupModal extends Component {
  state = { open: false };

  show = size => () => {
    this.setState({
     size, open: true
     })};
  close = () => this.setState({ open: false });

  render() {
    const { open, size } = this.state;

    return (
      <div>
        <Button className="ui button tn-green-btn" 
        onClick={this.show("small")}
        >Mark&nbsp;Complete</Button>
        <Modal size={size} open={open} onClose={this.close} className="tn-modal-body">
        <i className="close icon" onClick={this.close}></i>
          <Modal.Content>
          <div className="text-center p-3">
            <img src={Tick} className="img-fluid text-center" alt="" title="" width="80" height="80" />
          </div>
          <h2 className="text-center m-2">Success!</h2>
          <p className="text-center p-2 m-0" style={{fontSize:"20px"}}>Marked as complete</p>
           <Modal.Actions className="text-center">
            <div className="tn-cancel-btn">
            <Button className="ui black deny button" onClick={() => { this.props.markupClick(); this.close(); }} >OK</Button>
            </div>
          </Modal.Actions>
          </Modal.Content>
     
        </Modal>
      </div>
    );
  }
}

export default MarkupModal;
