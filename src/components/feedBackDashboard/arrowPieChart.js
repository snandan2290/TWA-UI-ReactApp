import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ArrowPieChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (!data) return;

    const labels = ["Critical", "Major", "Minor"];
    const counts = [data.critical, data.major, data.minor];
    const total = counts.reduce((sum, val) => sum + val, 0);

    if (total === 0) {
      setIsEmpty(true);
      setChartData({
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#d3d3d3"], // grey color
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      });
    } else {
      setIsEmpty(false);
      setChartData({
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: ["#FF4C4C", "#FFA500", "#82ca9d"],
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      });
    }
  }, [data]);

  const options = {
    cutout: "60%",
    plugins: {
      legend: {
        display: !isEmpty,
        position: "bottom",
        labels: {
          color: "#333",
          font: { size: 14 },
        },
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => (isEmpty ? "" : value === 0 ? "" : value),
      },
    },
  };

  return (
    <div style={{ width: "300px", height: "333px", margin: "auto", position: "relative" }}>
      {chartData && (
        <>
          <Doughnut data={chartData} options={options} plugins={[ChartDataLabels]} />
          {isEmpty && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "#555",
                fontSize: "16px",
                fontWeight: "500",
                width: "80%",
              }}
            >
              No Critical, Major or Minor feedbacks found
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ArrowPieChart;
