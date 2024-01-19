import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function StateWIseMS({ teamMonthlySale }) {
    // console.log("teamMonthlySale", teamMonthlySale)
    let colors = ["#fe58d9", "#3edfef", "#fe7658", "#587dfe", "#55ef94", "#fe58d9", "#4eb548"]

    const data = {
        labels: teamMonthlySale?.map((state) => state.state_name.length > 12 ? state.state_name.slice(0, 12).concat("...") : state.state_name),
        datasets: [
            {
                label: "",
                data: teamMonthlySale?.map((item) => item.total_sale),
                // data: teamMonthlySale?.map((item) => 200),
                backgroundColor: colors?.map((item, i) => colors[i % teamMonthlySale.length]),
                borderRadius: 15,
                barThickness: 12,
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

    // teamMonthlySale.map((state, i) => {
    //     data.labels.push(state.state_name.length > 12 ? state.state_name.slice(0, 12).concat("...") : state.state_name)
    //     // data.datasets[0].data.push(state.state_name)
    //     data.datasets[0].data.push(200)
    // })
    // console.log("swms",data)

    return <Bar data={data} options={options} />;
}

export default StateWIseMS;
