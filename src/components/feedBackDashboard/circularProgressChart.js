import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

const CircularProgressChart = ({ percentage = 0, fillColor = "#00C49F" }) => {
  const [data, setData] = useState([
  ]);

  const COLORS = [fillColor, "#fff"];

  useEffect(() => {
    setData([
      { name: "Completed", value: percentage },
      { name: "Remaining", value: 100 - percentage },
    ]);
  },[data])

  return (
    <div style={{ width: 200, height: 200, position: "relative" }}>
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={-270}
          innerRadius={40}
          outerRadius={70}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>

      <div
        style={{
          position: "absolute",
          top: "67%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {percentage}
      </div>
    </div>
  );
};

export default CircularProgressChart;
