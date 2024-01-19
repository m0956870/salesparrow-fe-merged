import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function PartyPrimarySale({ primarySale }) {
  // console.log("primarySale", primarySale)

  const data = {
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: "#7f66ff",
        barThickness: 7,
      },
      {
        label: "",
        data: [],
        backgroundColor: "#3edfef",
        barThickness: 7,
      },
      {
        label: "",
        data: [],
        backgroundColor: "#fe7658",
        barThickness: 7,
      },
    ],
  };

  const options = {
    indexAxis: "x",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        max: 40,
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

  primarySale?.map(state => {
    data.labels.push(state.state_name.length > 12 ? state.state_name.slice(0, 12).concat("...") : state.state_name)
    data.datasets[0].data.push(state.state_primary_sales)
    data.datasets[1].data.push(state.state_collection)
    data.datasets[2].data.push(state.state_outstanding)
    // data.datasets[0].data.push(200)
    // data.datasets[1].data.push(150)
    // data.datasets[2].data.push(100)
  })
  // console.log(data)

  return <Bar data={data} options={options} />;
}

export default PartyPrimarySale;
