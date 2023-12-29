import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function PartyMTD({partyMTDData}) {
  // console.log("partyMTDData", partyMTDData)

  const data = {
    labels: ["MTD", "LMTD"],
    datasets: [
      {
        label: "",
        data: [partyMTDData?.mtd_order_amount, partyMTDData?.lmtd_order_amount],
        backgroundColor: "#7f66ff",
        barPercentage: 1,
        barThickness: 30,
      },
      {
        label: "",
        data: [partyMTDData?.mtd_completed_order_amount, partyMTDData?.lmtd_completed_order_amount],
        backgroundColor: "#3edfef",
        barPercentage: 1,
        barThickness: 30,
      },
      {
        label: "",
        data: [partyMTDData?.mtd_pending_order_amount, partyMTDData?.lmtd_pending_order_amount],
        backgroundColor: "#fe7658",
        barPercentage: 1,
        barThickness: 30,
      },
    ],
  };

  const options = {
    indexAxis: "x",
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 0,
        },
        title: {
            display: false,
            text: 'MTD/LMTD'
          }
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

export default PartyMTD;
