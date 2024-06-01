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
  const end = new Date();
  const start = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());
  const labels = new Array(25)
    .fill(0)
    .map((_, i) => new Date(start.getTime() + i * 24 * 60 * 60 * 1000));

  const prices = labels.map((date) => {
    const randomNum = Math.random() * 1000000;
    return Math.round(randomNum);
  });
  const chartData = {
    labels: labels.map((date) => date.toISOString().split("T")[0]),
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
