import { FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { FormateDate } from "../../function/formatDate";
import { THistory } from "../../type/coins";

import './chart.scss';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'chart on 2023 year',
      },
    },
    maintainAspectRatio : false,
    
  };

type ChartComponentProps = {
    history: THistory[] | null,
    name: string | undefined,
}
export const ChartComponent:FC<ChartComponentProps> = ({history, name}) => {
    const dataArray: string[] = [];
    const labels: string[] = [];
    
    history?.map(el => {
        dataArray.push(el.priceUsd);
        labels.push(FormateDate(el.time));
    })

  const data = {
    labels: labels,
    datasets: [
      {
        label: `${name}`,
        data: dataArray,
        borderColor: '#ff6384',        
      },
    ],
  };

    return (
      <div className="chart">
        <Line options={options} data={data} />;
      </div>
    );
}