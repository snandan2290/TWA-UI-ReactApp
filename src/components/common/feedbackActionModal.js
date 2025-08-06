import React, { useState, useEffect } from "react";
import { Button, Modal, Dropdown, TextArea } from "semantic-ui-react";
import ResolveModal from "./resolveModal";
import EscalateModal from "./escalateModal";
import TextInput from "./textInput";
import axios from "axios";

const FeedbackActionModal = ({ id, status }) => {
  const [open, setOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const errorRef = React.useRef(null);

  const [formData, setFormData] = useState({
    date: "",
    fromAssyUnit: "",
    reportNo: "",
    type: "",
    component: "",
    itemRef: "",
    newProduct: "",
    watchModel: "",
    severity: "",
    cluster: "",
    supplier: "",
    assembledQty: "",
    repetition: "",
    rejn: "",
    defect: "",
    rejPer: "",
    calibre: "",
    assemblyWIP: "",
    ucpInInr: "",
    fpsStock: "",
    reportedBy: "",
    remark: "",
    title: "",
    toName: "",
    ccName: "",
  });

  const defectOptionArray = [
    { text: "Select Defect", value: "" },
    { text: "Module Defect", value: "Module Defect" },
    { text: "Case Defect", value: "Case Defect" },
    { text: "Dial Defect", value: "Dial Defect" },
    { text: "Hands Defect", value: "Hands Defect" },
    { text: "Crown Defect", value: "Crown Defect" },
  ];

  const productOptionArray = [
    { text: "New Product", value: "" },
    { text: "Yes", value: "Yes" },
    { text: "No", value: "No" },
  ];

  const repeatOptionArray = [
    { text: "Select Repetition", value: "" },
    { text: "1st", value: "1st" },
    { text: "2nd", value: "2nd" },
    { text: "3rd", value: "3rd" },
    { text: ">3", value: ">3" },
  ];

  const criticalityOptionArray = [
    { text: "Select Criticality Type", value: "" },
    { text: "Critical", value: "Critical" },
    { text: "Major", value: "Major" },
    { text: "Minor", value: "Minor" },
  ];

  const handleRejectedQuantityChange = (e) => {
    const rejected = e.target.value;
    setFormData((prev) => {
      const total = prev.assembledQty || 0;
      let percent = "";
      if (total && !isNaN(total) && !isNaN(rejected) && Number(total) > 0) {
        percent = ((Number(rejected) / Number(total)) * 100).toFixed(2);
      }
      return { ...prev, rejn: rejected, rejPer: percent };
    });
  };

  const handleTotalQuantityChange = (e) => {
    const total = e.target.value;
    setFormData((prev) => {
      const rejected = prev.rejn || 0;
      let percent = "";
      if (rejected && !isNaN(total) && !isNaN(rejected) && Number(total) > 0) {
        percent = ((Number(rejected) / Number(total)) * 100).toFixed(2);
      }
      return { ...prev, assembledQty: total, rejPer: percent };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/getFeedbackTemplate/${id}`);
        const template = res.data.data.template;
        setFormData({
          date: template.date,
          fromAssyUnit: template.fromAssyUnit,
          reportNo: template.reportNo,
          type: template.type,
          component: template.component,
          itemRef: template.itemRef,
          newProduct: template.newProduct,
          watchModel: template.watchModel,
          typeOfCriticality: template.typeOfCriticality,
          cluster: template.cluster,
          supplier: template.supplier,
          assembledQty: template.assembledQty,
          repetition: template.repetition,
          rejn: template.rejn,
          defect: template.defect,
          rejPer: template.rejPer,
          calibre: template.calibre,
          assemblyWIP: template.assemblyWIP,
          ucpInInr: template.ucpInInr,
          fpsStock: template.fpsStock,
          reportedBy: template.reportedBy,
          remark: template.remark,
          title: template.title,
          toName: template.toName,
          ccName: template.ccName,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    if (open) fetchData();
  }, [open]);

  const handleUpdate = async () => {
    const requiredFields = [
      "toName",
      "ccName",
      "supplier",
      "assembledQty",
      "rejn",
      "remark",
      "newProduct",
      "typeOfCriticality",
      "defect",
      "repetition",
      "fpsStock",
    ];

    const emptyFields = requiredFields.filter(
      (field) =>
        formData[field].toString().trim() === "" ||
        formData[field].toString().trim() === "NA"
    );

    if (emptyFields.length > 0) {
      setErrorMessage(`Please fill the mandatory fields`);

      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);

      return;
    }
    
    setErrorMessage("");
    setIsUpdated(true);

    const payload = new FormData();
    for (let key in formData) {
      payload.append(key, formData[key]);
    }

    await axios.put(`/saveFeedbackTemplate/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setIsUpdated(true);
  };
  const getDisplayValue = (value) =>
    value === "NA" || value === "" ? "" : value;

  return (
    <>
      {status === "Resolved" ? (
        <Button
          onClick={() => {
            setOpen(true);
            setIsUpdated(true);
          }}
          className="ui basic button tn-btn-primary"
        >
          View
        </Button>
      ) : status === "Escalated" ? (
        <Button
          onClick={() => {
            setOpen(true);
            setIsUpdated(true);
          }}
          className="ui basic button tn-btn-primary"
        >
          Action
        </Button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="ui basic button tn-btn-primary"
        >
          Action
        </Button>
      )}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setIsUpdated(false);
        }}
        size="small"
        style={{ marginTop: "80px" }}
        className="custom-modal"
      >
        <i
          className="close icon"
          onClick={() => setOpen(false)}
          style={{ top: "1rem", right: "1rem", color: "#000" }}
        />
        <Modal.Header className="my-2">{formData.title}</Modal.Header>

        <Modal.Content
          style={{ overflowY: "auto" }}
          className="scrollable-content"
        >
          {errorMessage && (
            <div
              ref={errorRef}
              style={{
                color: "red",
                marginBottom: "1rem",
                fontSize: "0.95em",
                fontWeight: "bold",
                backgroundColor: "#fff3f3",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ffc2c2",
              }}
            >
              {errorMessage}
              <span style={{ color: "red" }} className="px-1">
                *
              </span>
            </div>
          )}

          <div className="w-100">
            <div className="row m-0">
              <div className="col-6 my-2">
                <label>Date</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.date)}
                    placeholder="Date"
                  />
                </div>
              </div>
              <div className="col-6 my-2">
                <label>From Assy Unit</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.fromAssyUnit)}
                    placeholder="From Assy Unit"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <div className="row m-0">
              <div className="col-6 my-2">
                <label>To</label>
                <span style={{ color: "red" }}>*</span>
                <div className="ui fluid form email-form-field">
                  <TextInput
                    type="text"
                    value={getDisplayValue(formData.toName)}
                    disabled={isUpdated}
                    placeholder="To"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        toName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="col-6 my-2">
                <label>CC</label>
                <span style={{ color: "red" }}>*</span>
                <div className="ui fluid form email-form-field">
                  <TextInput
                    type="text"
                    value={getDisplayValue(formData.ccName)}
                    disabled={isUpdated}
                    placeholder="CC"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ccName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <div className="row m-0">
              <div className="col-6 my-2">
                <label>Report No</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.reportNo)}
                    placeholder="Report No"
                  />
                </div>
              </div>
              <div className="col-6 my-2">
                <label>Type</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.type)}
                    placeholder="Type"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <div className="row m-0">
              <div className="col-6 my-2">
                <label>Component</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.component)}
                    placeholder="Component"
                  />
                </div>
              </div>
              <div className="col-6 my-2">
                <label>Item Ref</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.itemRef)}
                    placeholder="Item Ref"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <div className="row m-0">
              <div className="col-6 my-2">
                <label>New Product</label>
                <span style={{ color: "red" }}>*</span>
                <div className="ui fluid form">
                  <Dropdown
                    className="ui search dropdown w-100 tn-multi-dropdown selection"
                    placeholder="Select"
                    fluid
                    selection
                    value={getDisplayValue(formData.newProduct)}
                    disabled={isUpdated}
                    onChange={(e, { value }) =>
                      setFormData((prev) => ({ ...prev, newProduct: value }))
                    }
                    options={productOptionArray}
                  />
                </div>
              </div>
              <div className="col-6 my-2">
                <label>Watch Model</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.watchModel)}
                    placeholder="Watch Model"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <div className="row m-0">
              <div className="col-6 my-2">
                <label>Type of Criticality</label>
                <span style={{ color: "red" }}>*</span>
                <div className="ui fluid form">
                  <Dropdown
                    className="ui search dropdown w-100 tn-multi-dropdown selection"
                    placeholder="Select"
                    fluid
                    selection
                    value={getDisplayValue(formData.severity)}
                    disabled={isUpdated}
                    onChange={(e, { value }) =>
                      setFormData((prev) => ({
                        ...prev,
                        severity: value,
                      }))
                    }
                    options={criticalityOptionArray}
                  />
                </div>
              </div>
              <div className="col-6 my-2">
                <label>Defect</label>
                <span style={{ color: "red" }}>*</span>
                <div className="ui fluid form">
                  <Dropdown
                    className="ui search dropdown w-100 tn-multi-dropdown selection"
                    placeholder="Select"
                    fluid
                    selection
                    value={getDisplayValue(formData.defect)}
                    disabled={isUpdated}
                    onChange={(e, { value }) =>
                      setFormData((prev) => ({ ...prev, defect: value }))
                    }
                    options={defectOptionArray}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <div className="row m-0">
              <div className="col-6 my-2">
                <label>Repetition</label>
                <span style={{ color: "red" }}>*</span>
                <div className="ui fluid form">
                  <Dropdown
                    className="ui search dropdown w-100 tn-multi-dropdown selection"
                    placeholder="Select"
                    fluid
                    selection
                    value={getDisplayValue(formData.repetition)}
                    disabled={isUpdated}
                    onChange={(e, { value }) =>
                      setFormData((prev) => ({ ...prev, repetition: value }))
                    }
                    options={repeatOptionArray}
                  />
                </div>
              </div>
              <div className="col-6 my-2">
                <label>Cluster</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.cluster)}
                    placeholder="Cluster"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <div className="row m-0">
              <div className="col-6 my-2">
                <label>Supplier</label>
                <span style={{ color: "red" }}>*</span>
                <div className="ui fluid form email-form-field">
                  <TextInput
                    type="text"
                    value={getDisplayValue(formData.supplier)}
                    disabled={isUpdated}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        supplier: e.target.value,
                      }))
                    }
                    placeholder="Supplier"
                  />
                </div>
              </div>
              <div className="col-6 my-2">
                <label>Assembled Qty</label>
                <span style={{ color: "red" }}>*</span>
                <div className="ui fluid form email-form-field">
                  <TextInput
                    type="number"
                    value={getDisplayValue(formData.assembledQty)}
                    placeholder="Assembled Qty"
                    disabled={isUpdated}
                    onChange={handleTotalQuantityChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <div className="row m-0">
              <div className="col-6 my-2">
                <label>Rejn</label>
                <span style={{ color: "red" }}>*</span>
                <div className="ui fluid form email-form-field">
                  <TextInput
                    type="text"
                    disabled={isUpdated}
                    value={getDisplayValue(formData.rejn)}
                    placeholder="Rejn"
                    onChange={handleRejectedQuantityChange}
                  />
                </div>
              </div>
              <div className="col-6 my-2">
                <label>Rej Per</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.rejPer)}
                    placeholder="Rej Per"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <div className="row m-0">
              <div className="col-6 my-2">
                <label>Calibre</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.calibre)}
                    placeholder="Calibre"
                  />
                </div>
              </div>
              <div className="col-6 my-2">
                <label>Assembly WIP</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.assemblyWIP)}
                    placeholder="Assembly WIP"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <div className="row m-0">
              <div className="col-6 my-2">
                <label>UCP in INR</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.ucpInInr)}
                    placeholder="UCP in INR"
                  />
                </div>
              </div>
              <div className="col-6 my-2">
                <label>FPS Stock</label>
                <span style={{ color: "red" }}>*</span>
                <div className="ui fluid form email-form-field">
                  <TextInput
                    type="text"
                    disabled={isUpdated}
                    value={getDisplayValue(formData.fpsStock)}
                    placeholder="FPS Stock"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fpsStock: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <div className="row m-0">
              <div className="col-6 my-2">
                <label>Reported By</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.reportedBy)}
                    placeholder="Reported By"
                  />
                </div>
              </div>
            </div>
            <div className="row m-0">
              <div className="col-12 my-2">
                <label>Assembly Preliminary Analysis & Observation</label>
                <span style={{ color: "red" }}>*</span>
                <div className="ui fluid form email-form-field">
                  <TextArea
                    name="remark"
                    rows="5"
                    value={getDisplayValue(formData.remark)}
                    cols="46"
                    placeholder="Type your message..."
                    disabled={isUpdated}
                    onChange={(e, { value }) =>
                      setFormData((prev) => ({ ...prev, remark: value }))
                    }
                    style={{
                      background: "#e8e8e8",
                      resize: "none",
                      borderRadius: "14px",
                      border: "none",
                      marginTop: "-5px",
                    }}
                    className="custom-textarea"
                  ></TextArea>
                </div>
              </div>
            </div>
          </div>

          <div className="w-100 d-none">
            <div className="row m-0">
              <div className="col-12 my-2">
                <label>Title</label>
                <div className="ui fluid form">
                  <TextInput
                    type="text"
                    disabled
                    value={getDisplayValue(formData.title)}
                    placeholder="Title"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Content>

        <Modal.Actions
          style={{
            display: "flex",
            justifyContent: "flex-end",
            background: "#fff",
            height: "65px",
            flexShrink: 0,
            padding: "10px 20px",
          }}
        >
          {!isUpdated && (
            <Button
              onClick={handleUpdate}
              className="ui basic button tn-btn-primary"
            >
              Update
            </Button>
          )}
          {isUpdated && status === "Pending" && (
            <>
              <ResolveModal id={id} setOpen={setOpen} />
              <EscalateModal id={id} setOpen={setOpen} isNew={true} />
            </>
          )}
          {isUpdated && status === "Escalated" && (
            <>
              <ResolveModal id={id} setOpen={setOpen} />
            </>
          )}
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default FeedbackActionModal;