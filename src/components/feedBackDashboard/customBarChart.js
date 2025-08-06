import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const data = [
  { name: "Crown", value: 300 },
  { name: "Movement", value: 200 },
  { name: "Hands", value: 400 },
  { name: "Dial", value: 100 },
   { name: "Case", value: 10 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042","#00b1ad"];

const CustomBarChart = () => {
  return (
    <>
    {
    data ? 
    (<ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" />
        <Tooltip formatter={(value) => `${value}`} />
        <Bar dataKey="value" barSize={30} label={{ position: "right" }}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>) : (
      <p>Loading chart...</p>
    )
    }
    </>

  );
};

export default CustomBarChart;