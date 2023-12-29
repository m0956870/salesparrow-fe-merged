import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function TeamWIseMS({monthlyTCPCData}) {
  // console.log("monthlyTCPCData", monthlyTCPCData)

  const data = {
    labels: ["TC", "PC"],
    datasets: [
      {
        label: "",
        data: [monthlyTCPCData?.mtd_tc, monthlyTCPCData?.mtd_pc],
        backgroundColor: "#55ef94",
        barPercentage: 1,
        barThickness: 40,
      },
      {
        label: "",
        data: [monthlyTCPCData?.lmtd_tc, monthlyTCPCData?.lmtd_pc],
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

export default TeamWIseMS;
