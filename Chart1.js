import React from 'react';
import { Bar } from "react-chartjs-2";
import count3 from "./DataCount-3.json";

const data1 = {
    labels: [0,1],
    datasets: [
        {
            label: "Negative for Pneumonia",
            data: [count3[0], count3[1]],
            fill: true,
            backgroundColor: "rgba(53, 152, 254, 0.8)",
            barPercentage: 1,
            categoryPercentage: 1,
        }
    ],
};

const options = { 
    scales: { 
        y: { 
            display: false,
        },
    },
    plugins:{
        legend: {
          display: false
        }
    }
}



export default function Chart1() {
    return (
        <div className="container-mini">
            <Bar data={data1}
            options={options}/>
        </div>
    );
}

