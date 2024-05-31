const enUsTranslation = {
  welcome: "Welcome back {name}!",
  buy: "Buy",
  sell: "Sell",
  currentLiquidInventoryValue: "Current Liquid Inventory Value",
  recentPurchasesSales: "Recent Purchases/Sales",
  dateTime: "Date & Time",
  item: "Item",
  price: "Price",
  buySell: "Buy/Sell",
  dashboard: "Dashboard",
  inventoryManagement: "Inventory Management",
  logOut: "Log out",
  logIn: "Log in",
  noTransactions: "No transactions",
  name: "Name",
  description: "Description",
  type: "Type",
  addTransaction: "Add Transaction",
  yourFriends: "Your Friends",
};

export default enUsTranslation;

export type TranslationType = keyof typeof enUsTranslation;
