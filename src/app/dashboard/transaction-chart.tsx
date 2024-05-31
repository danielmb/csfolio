"use client";

import { type Transaction } from "./data";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartProps {
  data: Transaction[];
}

export const InventoryValue = ({ data }: ChartProps) => {
  const labels = data.map((d) => d.date);
  const prices = data.map((d) => d.price);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Price",
        data: prices,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
};
