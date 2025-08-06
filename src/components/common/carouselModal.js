import React, { Component } from "react";
import { Button, Modal, Carousel } from "react-bootstrap";
import { connect } from "react-redux";
import { API_IMAGE_URL } from "./../../constants/configValues";

class ImageCarousel extends Component {
  state = {
    show: false,
    index: 0,
    direction: null,
    imageUrl: []
  };

  handleSelect = (selectedIndex, e) => {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => {
    if(this.props.handleViewClick){
      let result = this.props.handleViewClick(this.props.uniqueId);
      this.setState({ show: true, imageUrl: result });
    }
    if(this.props.imagePath){
      this.setState({ show: true, imageUrl: this.props.imagePath});
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.masterData.carouselModelImages) {
      this.setState({
        imageUrl: nextProps.masterData.carouselModelImages
      });
    }
  }
  
  render() {
    let imageCarousel;
    if (this.state.imageUrl != undefined && this.state.imageUrl.length !== 0) {
      imageCarousel = this.state.imageUrl.map((imgPath, i) => {
        let imagePathURL = API_IMAGE_URL + imgPath;
        
        return (
          <Carousel.Item key={i}>
            <img className="img-responsive" style={{width:"470px" , height:"313px" ,
             objectFit:"contain", objectPosition:"center"
            }} 
            src={imagePathURL} alt="" /> 
          </Carousel.Item>
        );
      });
    }

    return (
      <div>
        <Button className="ui button tn-edit-btn" onClick={this.handleShow}>
          View
        </Button>

        <Modal centered show={this.state.show} onHide={this.handleClose}>
          <Modal.Body>
            <Carousel
              activeIndex={this.state.index}
              direction={this.state.direction}
              onSelect={this.handleSelect}
            >
              {imageCarousel}
            </Carousel>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  masterData: state.MasterData
});

export default connect(mapStateToProps)(ImageCarousel);
