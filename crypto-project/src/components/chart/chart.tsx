import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import { FormateDate } from '../../utils/format-date';
import { History } from "../../models/coins";

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
  history: History[] | null;
  name: string | undefined;
};
export const ChartComponent = ({history, name}: ChartComponentProps) => {
  const dataArray: string[] = [];
  const labels: string[] = [];
    
  history?.map(el => {
      dataArray.push(el.value);
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