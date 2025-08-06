import React, { Component } from "react";
import DeleteModal from "../common/deleteModal";
import Pagination from "../common/pagination";
import {
  getAllVariants,
  deleteVariant,
  getImageUrlByVariant,
} from "../../actions/masterDataAction";
import { connect } from "react-redux";
import ImageCarousel from "../common/carouselModal";
import SelectDropdown from "../common/selectPageSize";

export class variantList extends Component {
  state = {
    pageSize: 10,
    totalResults: 0,
    currentPage: this.props.onSelectCurrentPage || 1,
    variantData: [],
    variantDataHtml: [],
    images: [],
    searchParam: this.props.existingSearchParam || "",
    selectedSize: "",
  };

  getInitialComponentData = () => {
    let pageNumber = this.state.currentPage;
    let pageSize = this.state.pageSize;
    this.props.getAllVariants(pageNumber, pageSize, this.state.searchParam);
  };

  nextPageClickHandler = (pageNumber) => {
    let pageSize = this.state.pageSize;
    this.props.getAllVariants(pageNumber, pageSize, this.state.searchParam);
    this.setState({
      currentPage: pageNumber,
    });
  };

  componentDidMount() {
    this.getInitialComponentData();
  }

  getImageURLListByVariant = (variantId) => {
    this.props.getImageUrlByVariant(variantId);
  };

  onPageSizeChangeHandler = (e, data) => {
    this.props.getAllVariants(1, data.value, this.state.searchParam);
    this.setState({
      pageSize: data.value,
      currentPage: 1,
      selectedSize: data.value,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.VariantData) {
      this.getVariantDataList(nextProps.VariantData);
    }

    if (nextProps.VariantData.deleteVariantSuccessFully) {
      this.getInitialComponentData();
    }
  }

  onSearchValueChange = (e) => {
    this.setState({
      searchParam: e.target.value,
    });
    if (e.target.value === "") {
      this.props.getAllVariants(1, this.state.pageSize, e.target.value);
    }
  };

  onEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      this.props.getAllVariants(1, this.state.pageSize, this.state.searchParam);
      this.setState({
        currentPage: 1,
      });
    }
  };

  onClickSearchRecords = () => {
    this.props.getAllVariants(1, this.state.pageSize, this.state.searchParam);
    this.setState({
      currentPage: 1,
    });
  };
  deleteHandler = (id) => {
    let data = {
      id: id,
      isActive: false,
    };
    this.props.deleteVariant(data);
  };

  getVariantDataList = (VariantData) => {
    let variantDataHtml = VariantData.allVariants.map((data, index) => {
      let activeClass;
      if (
        this.props.SelectedData !== undefined &&
        this.props.SelectedData !== null
      ) {
        activeClass = this.props.SelectedData === data.id ? "tn-tbl-color" : "";
      }
      let num = (this.state.currentPage - 1) * this.state.pageSize;

      return (
        <tr key={index} className={activeClass}>
          <td>{index + 1 + num}</td>
          <td>{data.code ? data.code : ""}</td>
          <td>{data.description ? data.description : ""}</td>
          <td>
            {data.imagePath !== null &&
            data.imagePath.length !== 0 &&
            data.imagePath !== undefined ? (
              <div>
                <div className="float-left">
                  <ImageCarousel
                    handleViewClick={this.getImageURLListByVariant}
                    uniqueId={data.id}
                  />
                </div>
              </div>
            ) : (
              "No Images"
            )}
          </td>
          {this.props.showActions === "true" ? (
            <td>
              <button
                className="ui button tn-edit-btn"
                onClick={() => this.props.handleViewSopBom(data, "sop")}
              >
                Special Instruction(SOP)
              </button>
            </td>
          ) : null}
          {this.props.showActions === "true" ? (
            <td>
              <button
                className="ui button tn-edit-btn"
                onClick={() => this.props.handleViewSopBom(data, "bom")}
              >
                Bill of Material (BOM)
              </button>
            </td>
          ) : null}
          {this.props.showActions === "true" ? (
            <td className="w-100 text-center d-inline-block">
              <div className="d-inline-block float-left">
                <button
                  className="ui button tn-edit-btn"
                  onClick={() =>
                    this.props.handleEditVariant(
                      data,
                      this.state.currentPage,
                      this.state.searchParam
                    )
                  }
                >
                  Edit
                </button>
              </div>
              <div className="float-right d-inline-block">
                <DeleteModal
                  msgToDisplay="Are you sure you want to permanently delete the selected Variant?"
                  deleteClick={this.deleteHandler.bind(this, data.id)}
                />
              </div>
            </td>
          ) : null}
        </tr>
      );
    });
    this.setState({
      totalResults: VariantData.variantscount,
      variantData: VariantData.allVariant,
      variantDataHtml: variantDataHtml,
    });
  };

  render() {
    let numberOfPages = Math.ceil(
      this.state.totalResults / this.state.pageSize
    );
    let variantDataBinding;

    if (this.state.variantDataHtml.length > 0) {
      variantDataBinding = <tbody>{this.state.variantDataHtml}</tbody>;
    } else {
      variantDataBinding = (
        <tbody>
          <tr>
            <td colspan="6" style={{ textAlign: "center" }}>
              No Variant Found
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <div className="row tn-table-wrapper">
        <div className="col-12 my-3">
          <div className="float-left d-flex h-100 align-items-center">
            <h1 className="m-0 p-0 tn-font-18">Master Data Management</h1>
          </div>
          {this.props.showActions === "true" ? (
            <div className="float-right">
              <button
                className="ui basic button tn-btn-primary"
                onClick={this.props.handleAddVariant}
              >
                <i className="icon plus" />
                Add Variant
              </button>
              <button
                className="ui basic button tn-btn-primary float-right mr-2"
                onClick={this.props.handleUploadVariant}
              >
                Bulk Upload
              </button>
            </div>
          ) : null}
        </div>

        <div className="col-12 my-3">
          <div className="float-left d-flex h-100 align-items-center">
            <span>Show</span>
            <SelectDropdown
              handleOnChangeEvent={this.onPageSizeChangeHandler}
              text={this.state.selectedSize}
            />

            <span>Entries</span>
          </div>
          {this.props.showActions === "true" ? (
            <div className="float-right">
              <div className="ui search">
                <div className="ui icon input">
                  <span className="p-2"></span>
                  <input
                    className="prompt tn-search-box"
                    type="text"
                    placeholder="Search"
                    maxLength="50"
                    value={this.state.searchParam}
                    onChange={this.onSearchValueChange}
                    onKeyDown={this.onEnterKeyPress}
                  />
                  <a className="tn-search-pos">
                    <i
                      className="search icon"
                      onClick={this.onClickSearchRecords}
                    />
                  </a>
                </div>
                <div className="results" />
              </div>
            </div>
          ) : null}
        </div>

        <div className="col-12 my-3">
          <div className="styleTable">
            <table className="ui celled single table tn-table">
              <thead>
                <tr>
                  <th style={{ minWidth: "60px" }}>S. No.</th>
                  <th style={{ minWidth: "150px" }}>Variant Code</th>
                  <th style={{ minWidth: "200px" }}>Description</th>
                  <th style={{ minWidth: "120px" }}>Image</th>
                  {this.props.showActions === "true" ? (
                    <th style={{ minWidth: "100px" }}>
                      Special Instructions (SOP)
                    </th>
                  ) : null}
                  {this.props.showActions === "true" ? (
                    <th style={{ minWidth: "100px" }}>
                      Bill of Material (BOM)
                    </th>
                  ) : null}

                  {this.props.showActions === "true" ? (
                    <th style={{ minWidth: "150px" }}>Action</th>
                  ) : null}
                </tr>
              </thead>
              {variantDataBinding}
              {this.state.totalResults > 10 ? (
                <Pagination
                  totalResults={this.state.totalResults}
                  pages={numberOfPages}
                  nextPage={this.nextPageClickHandler}
                  currentPage={
                    this.props.onSelectCurrentPage
                      ? this.props.onSelectCurrentPage
                      : this.state.currentPage
                  }
                />
              ) : null}
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  VariantData: state.VariantData,
});

export default connect(mapStateToProps, {
  getAllVariants,
  deleteVariant,
  getImageUrlByVariant,
})(variantList);
