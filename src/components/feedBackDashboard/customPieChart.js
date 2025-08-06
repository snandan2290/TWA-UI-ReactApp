import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const LineWiseQFBChart = ({ data }) => {
  
  const [chartData, setChartData] = useState(null);
  const totalFeedback = data.reduce((acc, item) => acc + item.value, 0);

  useEffect(() => {

    if (data.length === 0){
      setChartData({
        labels: ["No Feedback"],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#5e6267ff'],
            borderWidth: 0,
          },
        ],
      });      
    } else  {
      const labels = data.map(item => item.name);
      const counts = data.map(item => item.value);

      const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      const COLORS = [];
      const usedColors = new Set();
      for (let i = 0; i < data.length; i++) {
        let color;
        do {
          color = getRandomColor();
        } while (usedColors.has(color));
        usedColors.add(color);
        COLORS.push(color);
      }

      setChartData({
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: COLORS,
            borderWidth: 0,
          },
        ],
      });
    }
  }, [data]);

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        onClick: () => {}, 
      },
      title: {
        display: true,
        text: 'Line Wise No of QFB',
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value) => {
          return totalFeedback === 0 ? '' : value;
        },
      },
      tooltip: {
        enabled: totalFeedback !== 0, // disable tooltip when no feedback
      },
    },
  };

  return (
   <div style={{ width: '300px', height: '300px', position: 'relative',margin:'auto' }}>
      {chartData ? (
        <>
          <Pie data={chartData} options={options} plugins={[ChartDataLabels]} />
          {totalFeedback === 0 && (
            <div
              style={{
    position: 'absolute',
    top: '42%',
    left: '50%',
    transform: 'translate(-50%, -55%)',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e4e7ebff',
    pointerEvents: 'none',
    textAlign: 'center',
  }}
            >
              0
            </div>
          )}
        </>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default LineWiseQFBChart;
