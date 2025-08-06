import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../layouts/navbar";
import CircularProgressChart from "../feedBackDashboard/circularProgressChart";
import CustomBarChart from "./customBarChart";
import CustomPieChart from "./customPieChart";
import AxiosConfig from "../../utils/axiosConfig";

const FeedbackDashboardSupervisor = () => {
  const today = new Date().toISOString().split("T")[0];
  const dateObj = new Date(today); // parse string back to Date object
  const options = { month: "short", day: "numeric" };
  const formattedDate = dateObj.toLocaleDateString("en-US", options);

  const [summary, setSummary] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
  });

  const [categorySummary, setCategorySummary] = useState({
    clarification: 0,
    production_stoppage: 0,
    information: 0,
  });

  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    AxiosConfig.setupAxiosDefaults();
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`/getFeedbackSummary?date=${today}`);
        const result = res.data;

        if (result.status === "success") {
          if (result.data.length > 0) {
            const summaryData = result.data[0];
            setSummary({
              total: parseInt(summaryData.total_feedbacks),
              resolved: parseInt(summaryData.resolved_count),
              pending: parseInt(summaryData.pending_count),
            });
          } else {
            setSummary({
              total: 0,
              resolved: 0,
              pending: 0,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load summary:", err);
      }
    };

    const fetchCategorySummary = async () => {
      try {
        const categorySummaryDatares = await axios.get(
          `/getFeedbackCategorySummary?date=${today}`
        );
        const categorySummaryDataresult = categorySummaryDatares.data;

        if (categorySummaryDataresult.status === "success") {
          if (categorySummaryDataresult.data.length > 0) {
            const categorySummaryData = categorySummaryDataresult.data[0];

            setCategorySummary({
              clarification: parseInt(categorySummaryData.clarification),
              production_stoppage: parseInt(
                categorySummaryData.production_stoppage
              ),
              information: parseInt(categorySummaryData.information),
            });
          } else {
            setCategorySummary({
              clarification: 0,
              production_stoppage: 0,
              information: 0,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load summary:", err);
      }
    };

    const fetchAssemblyLineSummary = async () => {
      try {
        const lineSummaryres = await axios.get(
          `/getFeedbackLineSummary?date=${today}`
        );
        const lineSummaryresult = lineSummaryres.data;
        if (
          lineSummaryresult.status === "success" &&
          Array.isArray(lineSummaryresult.data)
        ) {
          const pieData = lineSummaryresult.data.map((item) => ({
            name: item.code,
            value: parseInt(item.total_feedbacks),
          }));
          setPieChartData(pieData);
        }
      } catch (err) {
        console.error("Failed to load line summary:", err);
      }
    };

    fetchSummary();
    fetchCategorySummary();
    fetchAssemblyLineSummary();
  }, [today]);

  const { total, resolved, pending } = summary;
  const { clarification, production_stoppage, information } = categorySummary;

  return (
    <div>
      <Navbar />
      <div className="body-wrapper">
        <div className="row m-0 justify-content-center">
          <div className="col-11 my-5 pb-4">
            <div className="tn-tabs tn-bg px-4 pb-3">
              <div className="row">
                <div className="col-12 my-3 pt-3">
                  <div className="float-left d-flex h-100 align-items-center">
                    <h1 className="m-0 p-0 tn-font-18">
                      Feedback Dashboard - Supervisor
                    </h1>
                  </div>
                </div>
              </div>
              <div className="row px-3 mt-3">
                <div className="col-8 pb-4 custom-bg-charts">
                  <div className="d-flex justify-content-between align-items-center my-3">
                    <div>
                      <div className="float-left d-flex h-100 align-items-center my-2 px-4">
                        <h1 className="m-0 p-0 tn-font-18">
                          Feedbacks Raised - {formattedDate}
                        </h1>
                      </div>
                      <CircularProgressChart
                        percentage={total}
                        fillColor="#053931ff"
                      />
                    </div>

                    <div>
                      <div className="float-left d-flex h-100 align-items-center my-2 px-4">
                        <h1 className="m-0 p-0 tn-font-18">
                          Feedbacks Resolved - {formattedDate}
                        </h1>
                      </div>
                      <CircularProgressChart
                        percentage={resolved}
                        fillColor="#2E8B57"
                      />
                    </div>

                    <div>
                      <div className="float-left d-flex h-100 align-items-center my-2 px-4">
                        <h1 className="m-0 p-0 tn-font-18">
                          Feedbacks Pending - {formattedDate}
                        </h1>
                      </div>
                      <CircularProgressChart
                        percentage={pending}
                        fillColor="#CD7F32"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-4 pb-4 ">
                  <div className="custom-bg-clarification">
                    <h1 className="m-0 p-0 px-4 pt-4 tn-font-18">
                      Classification :
                    </h1>
                    <div className="px-4 pt-4 tn-font-16">
                      <div className="feedback-type">
                        <h3>Production Stop - {production_stoppage} </h3>
                      </div>
                      <div className="feedback-type mt-4">
                        <h3>Clarification - {clarification}</h3>
                      </div>
                      <div className="feedback-type mt-4">
                        <h3>Information - {information}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row pb-4 mt-0 px-3 pt-1">
                <div className="col-8 outline-border-chart pt-3 bg-light-grey">
                  <div className="align-items-center my-2 px-4">
                    <h1 className="m-0 p-0 px-2 tn-font-18 text-center">
                      Component Wise Split Up
                    </h1>
                  </div>
                  <CustomBarChart />
                </div>

                <div className="col-4 ">
                  <div className="custom-piechart-bg outline-border-chart">
                    <div className="align-items-center my-2 px-4 mb-4">
                      <h1 className="m-0 p-0 px-2 tn-font-18">
                        Line Wise No of QFB​
                      </h1>
                    </div>

                    <CustomPieChart data={pieChartData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboardSupervisor;