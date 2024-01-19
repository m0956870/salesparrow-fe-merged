import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function Top5Category({ categories }) {
  // console.log("categories", categories)

  let colorArray = ["#fe58d9", "#3edfef", "#fe7658", "#587dfe", "#55ef94", "#fe58d9", "#4eb548"]

  let dataArr = [
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
    {
      id: 4,
      label: "",
      data: 0,
      color: "#fff",
    },
    {
      id: 5,
      label: "",
      data: 0,
      color: "#fff",
    },
  ]

  categories?.map((category, i) => {
    if (dataArr[i].id === i + 1) {
      dataArr[i] = {
        id: i + 1,
        label: `${category.catagory_name}: ${category.catagory_sale_amount}`,
        data: category.catagory_sale_amount,
        color: colorArray[i % colorArray.length],
      }
    }

    // dataArr.push({
    //   id: i + 1,
    //   // x: "Total Sale: ₹20,000",
    //   label: `${category.catagory_name}: ${category.catagory_sale_amount}`,
    //   data: category.catagory_sale_amount,
    //   color: colorArray[i % colorArray.length],
    // })
  })
  // console.log(dataArr)

  const data = {
    labels: dataArr?.map((item) => item.label),
    datasets: [
      {
        label: "",
        data: dataArr?.map((item) => item.data),
        backgroundColor: dataArr?.map((item) => item.color),
        // borderColor: "black",
        // borderWidth: 2,
        borderRadius: 32,
        borderSkipped: false,
        barThickness: 12,
      },
    ],
  };

  const options = {
    indexAxis: "y",
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
        stacked: true,
        grid: {
          borderWidth: 0,
          display: false,
        },
        ticks: {
          display: true,
        },
      },
      y: {
        stacked: true,
        grid: {
          borderWidth: 0,
          display: false,
        },
        ticks: {
          display: true,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default Top5Category;
