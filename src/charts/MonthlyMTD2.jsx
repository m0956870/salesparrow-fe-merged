import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function MonthlyMTD2({monthlyPSSSData}) {
// console.log("monthlyPSSSData", monthlyPSSSData)

  const data = {
    labels: ["Secondary Sales", "Primary Sales"],
    datasets: [
      {
        label: "",
        data: [monthlyPSSSData?.mtd_secondary_sales, monthlyPSSSData?.mtd_primary_sales],
        backgroundColor: "#fe7658",
        barPercentage: 1,
        barThickness: 40,
      },
      {
        label: "",
        data: [monthlyPSSSData?.lmtd_secondary_sales, monthlyPSSSData?.lmtd_primary_sales],
        backgroundColor: "#3edfef",
        barPercentage: 1,
        barThickness: 40,
      },
    ],
  };

  const options = {
    indexAxis: "x",
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 0,
        },
      },
    },
    scales: {
      x: {
        grid: {
          borderWidth: 0,
          display: false,
        },
        // ticks: {
        //   display: false,
        // },
      },
      y: {
        grid: {
          borderWidth: 0,
          display: false,
        },
        // ticks: {
        //   display: false,
        // },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default MonthlyMTD2;
