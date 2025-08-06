import React, { Component } from "react";
import { connect } from "react-redux";
import icon_chat_room from "../../style/images/icon_chat_room.svg";
import icon_invoices from "../../style/images/icon_Invoices.svg";
import icon_dashboard from "../../style/images/icon_dashboard.svg";
import icon_customers from "../../style/images/icon_customers.svg";
import icon_feedback_dashboard from "../../style/images/feedback-dashboard.svg";
import { Link } from "react-router-dom";

export class SideNavbar extends Component {
  constructor() {
    super();
    this.state = {
      toggleSideBar: false,
      manageWorkOrder: "",
      masterdatamanagement: "",
      userDataManagement: "",
      feedback: "",
      feedbackDashboardSupervisor: "",
      feedbackDashboardOperator: "",
    };
  }

  openSideNavbar = (e) => {
    this.setState({
      toggleSideBar: !this.state.toggleSideBar,
    });
  };

  closeSideNavbar = (e) => {
    this.setState({
      toggleSideBar: false,
    });
  };
  openSideNavbarOnHover = (e) => {
    this.setState({
      toggleSideBar: true,
    });
  };

  componentWillMount() {
    document.addEventListener("click", this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick, false);
  }

  handleClick = (e) => {
    if (this.state.toggleSideBar) {
      if (this.node.contains(e.target)) {
        this.setState({
          toggleSideBar: true,
        });
      } else {
        this.setState({
          toggleSideBar: false,
        });
      }
    }
  };

  componentDidMount() {
    switch (window.location.pathname) {
      case "/masterdatamanagement":
        this.setState({
          manageWorkOrder: "nav-item",
          masterdatamanagement: "nav-item active",
          userDataManagement: "nav-item",
          feedback: "nav-item",
          feedbackDashboardSupervisor: "nav-item",
           feedbackDashboardOperator: "nav-item",
        });
        break;
      case "/usermanagement":
        this.setState({
          manageWorkOrder: "nav-item",
          masterdatamanagement: "nav-item",
          userDataManagement: "nav-item active",
          feedback: "nav-item",
          feedbackDashboardSupervisor: "nav-item",
           feedbackDashboardOperator: "nav-item",
        });
        break;
      case "/feedback":
        this.setState({
          manageWorkOrder: "nav-item",
          masterdatamanagement: "nav-item",
          userDataManagement: "nav-item",
          feedback: "nav-item active",
          feedbackDashboardSupervisor: "nav-item",
           feedbackDashboardOperator: "nav-item",
        });
        break;
      case "/feedbackDashboardSupervisor":
        this.setState({
          manageWorkOrder: "nav-item",
          masterdatamanagement: "nav-item",
          userDataManagement: "nav-item",
          feedback: "nav-item",
          feedbackDashboardSupervisor: "nav-item active",
            feedbackDashboardOperator: "nav-item",
        });
        break;
        case "/feedbackDashboardOperator":
        this.setState({
          manageWorkOrder: "nav-item",
          masterdatamanagement: "nav-item",
          userDataManagement: "nav-item",
          feedback: "nav-item",
          feedbackDashboardSupervisor: "nav-item",
           feedbackDashboardOperator: "nav-item active",
        });
        break;
      case "/manageWorkOrder":
        this.setState({
          manageWorkOrder: "nav-item active",
          masterdatamanagement: "nav-item",
          userDataManagement: "nav-item",
          feedback: "nav-item",
          feedbackDashboardSupervisor: "nav-item",
           feedbackDashboardOperator: "nav-item",
        });
        break;
      default:
        this.setState({
          manageWorkOrder: "nav-item active",
          masterdatamanagement: "nav-item",
          userDataManagement: "nav-item",
          feedback: "nav-item",
          feedbackDashboardSupervisor: "nav-item",
           feedbackDashboardOperator: "nav-item",
        });
    }
  }

  render() {
    let classNameOfSideNav = "navbar-nav animate side-nav pt-4";
    if (this.state.toggleSideBar) {
      classNameOfSideNav = "navbar-nav animate side-nav open pt-4";
    }

    let user = this.props.auth.user;
    let Sidenav;

    if (user.role === "Supervisor" && user.isAdmin === true) {
      Sidenav = (
        <ul className={classNameOfSideNav} id="tt">
          <li className={this.state.manageWorkOrder}>
            <Link to="/manageWorkOrder" className="nav-link">
              <img
                src={icon_invoices}
                className="img-fluid"
                width="20"
                height="20"
                alt=""
              />{" "}
              Manage Work Order
            </Link>
          </li>
          <li className={this.state.masterdatamanagement}>
            <Link to="/masterdatamanagement" className="nav-link">
              <img
                src={icon_dashboard}
                className="img-fluid"
                width="20"
                height="20"
                alt=""
              />{" "}
              Master Data Management
            </Link>
          </li>
          <li className={this.state.userDataManagement}>
            <Link to="/usermanagement" className="nav-link">
              <img
                src={icon_customers}
                className="img-fluid"
                width="20"
                height="20"
                alt=""
              />{" "}
              User Management
            </Link>
          </li>
          <li className={this.state.feedback}>
            <Link to="/feedback" className="nav-link">
              <img
                src={icon_chat_room}
                className="img-fluid"
                width="20"
                height="20"
                alt=""
              />{" "}
              Feedback
            </Link>
          </li>
          <li className={this.state.feedbackDashboardSupervisor}>
            <Link to="/feedbackDashboardSupervisor" className="nav-link">
              <img
                src={icon_feedback_dashboard}
                className="img-fluid"
                width="25"
                height="28"
                alt=""
              />{" "}
              Feedback Dashboard
            </Link>
          </li>
        </ul>
      );
    } else if (user.role === "Supervisor" && user.isAdmin === false) {
      Sidenav = (
        <ul className={classNameOfSideNav} id="tt">
          <li className={this.state.manageWorkOrder}>
            <Link to="/manageWorkOrder" className="nav-link">
              <img
                src={icon_invoices}
                className="img-fluid"
                width="20"
                height="20"
                alt=""
              />{" "}
              Manage Work Order
            </Link>
          </li>
          <li className={this.state.feedback}>
            <Link to="/feedback" className="nav-link">
              <img
                src={icon_chat_room}
                className="img-fluid"
                width="20"
                height="20"
                alt=""
              />{" "}
              Feedback
            </Link>
          </li>
          <li className={this.state.feedbackDashboardSupervisor}>
            <Link to="/feedbackDashboardSupervisor" className="nav-link">
              <img
                src={icon_feedback_dashboard}
                className="img-fluid"
                width="25"
                height="28"
                alt=""
              />{" "}
              Feedback Dashboard
            </Link>
          </li>
        </ul>
      );
    }
    if (
      user.role === "Admin" ||
      (user.role === "Operator" && user.isAdmin === true)
    ) {
      Sidenav = (
        <ul className={classNameOfSideNav} id="tt">
          <li className={this.state.masterdatamanagement}>
            <Link to="/masterdatamanagement" className="nav-link">
              <img
                src={icon_dashboard}
                className="img-fluid"
                width="20"
                height="20"
                alt=""
              />{" "}
              Master Data Management
            </Link>
          </li>
          <li className={this.state.userDataManagement}>
            <Link to="/usermanagement" className="nav-link">
              <img
                src={icon_customers}
                className="img-fluid"
                width="20"
                height="20"
                alt=""
              />{" "}
              User Management
            </Link>
          </li>
              <li className={this.state.feedbackDashboardOperator}>
            <Link to="/feedbackDashboardOperator" className="nav-link">
              <img
                src={icon_feedback_dashboard}
                className="img-fluid"
                width="25"
                height="28"
                alt=""
              />{" "}
              Feedback Dashboard
            </Link>
          </li>
        </ul>
      );
    }

    return (
      <div id="wrapper" className="animate" ref={(node) => (this.node = node)}>
        <nav
          className="navbar fixed-top navbar-expand-lg navbar-dark"
          id="wrapper"
        >
          <span
            onClick={this.openSideNavbar}
            className="navbar-toggler-icon leftmenutrigger"
          />
          <div
            className="collapse navbar-collapse"
            id="navbarText"
            onMouseEnter={this.openSideNavbarOnHover}
            onMouseLeave={this.closeSideNavbar}
          >
            {Sidenav}
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(SideNavbar);