import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function TeamWIseMS({ teamMonthlySale }) {
  // console.log("teamMonthlySale", teamMonthlySale)

  let colorArray = ["#fe58d9", "#3edfef", "#fe7658", "#587dfe", "#55ef94", "#fe58d9", "#4eb548"]

  const dataArr = [
    {
      id: 1,
      label: "",
      data: 0,
      color: "#fff",
    },
    {
      id: 2,
      label: "",
      data: 0,
      color: "#fff",
    },
    {
      id: 3,
      label: "",
      data: 0,
      color: "#fff",
    },
  ];

  teamMonthlySale?.map((category, i) => {
    if (dataArr[i] !== undefined) {
      dataArr[i] = {
        id: i + 1,
        label: category.grp_name,
        data: category.total_sale,
        // data: 5,
        color: colorArray[i % colorArray.length],
      }
    } else {
      dataArr[i] = {
        id: i + 1,
        label: category.grp_name,
        data: category.total_sale,
        color: colorArray[i % colorArray.length],
      }
    }
  })
  // console.log(dataArr)


  const data = {
    labels: dataArr.map((item) => item.label),
    datasets: [
      {
        label: "",
        data: dataArr.map((item) => item.data),
        backgroundColor: dataArr.map((item) => item.color),
        borderRadius: 14,
        borderSkipped: false,
        barThickness: 20,

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
        // min: 2,
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
