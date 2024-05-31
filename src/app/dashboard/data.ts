export interface Transaction {
  date: Date;
  item: string;
  price: number;
  valuta: string;
  buy: boolean;
}
export const recentTransactions = [
  {
    // date: "2014-07-01 12:00",
    date: new Date("2014-07-01 12:00"),
    item: "AWP | Dragon Lore",
    price: 100,
    valuta: "NOK",
    buy: true,
  },
  {
    // date: "2023-10-10 12:00",
    date: new Date("2023-10-10 12:00"),
    item: "AWP | Dragon Lore",
    // price: "124 507.00",
    price: 124507,
    valuta: "NOK",
    buy: false,
  },
] as const satisfies Transaction[];

export interface InventoryValue {
  date: Date;
  price: number;
}

const now = new Date();
const prevYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
let val = 100;
export const inventoryValue = new Array(365).fill(0).map((_, i) => {
  val += Math.random() * 10 - 5;
  return {
    date: new Date(prevYear.getTime() + i * 24 * 60 * 60 * 1000),
    price: val,
  };
}) satisfies InventoryValue[];
