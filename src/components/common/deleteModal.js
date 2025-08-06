import React, { Component } from "react";
import { Button, Modal } from "semantic-ui-react";
import {connect} from 'react-redux';

class DeleteModal extends Component { 
  state = { open: false };

  show = size => () => this.setState({ size, open: true });
  close = () => {
    this.setState({ open: false });
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.UserData.resetPasswordSucceessfully){
        this.close();
    }
}

  render() {
    const { open, size } = this.state;
        return (
      <div>
        <Button
          type="button"
          className={this.props.buttonCls ? this.props.buttonCls :"ui button tn-delete-btn"}
          onClick={this.show("small")}
        >
        {this.props.ButtonMessage ? this.props.ButtonMessage : 'Delete'}
        </Button>
        <Modal
          size={size}
          open={open}
          onClose={this.close}
          className="tn-modal-body"
        >
          <i className="close icon" onClick={this.close} />
          <Modal.Header>{this.props.headerMessage ? this.props.headerMessage :'Confirm Deletion'} </Modal.Header>
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
                  onClick={() => {
                    this.props.deleteClick();
                    this.close();
                  }}
                />
              </div>
            </Modal.Actions>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps= state =>({
  UserData: state.UserData
})

export default connect(mapStateToProps) (DeleteModal);