import React, { Component } from 'react';
import  Navbar  from '../layouts/navbar';
import OperatorFeedbackList  from './operatorFeedbackList';

export class operatorFeedback extends Component {
    render() {
        return (
            <div>
            <Navbar />
            <div className="body-wrapper">
              <div className="row m-0 justify-content-center">
                <div className="col-11 my-5">
               <OperatorFeedbackList/>
                </div>
              </div>
            </div>
          </div>
        )
    }
}

export default operatorFeedback;
