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
  inventoryValue: "Inventory Value",
  news: "News",
  notAuthenticated:
    "The page you are trying to access is only available to authenticated users. Please {login} to access the page.",
};

export default enUsTranslation;

export type TranslationType = keyof typeof enUsTranslation;
