import { TranslationType } from "./en-US";

const nbNoMessages = {
  welcome: "Velkommen tilbake {name}!",
  buy: "Kjøp",
  sell: "Selg",
  currentLiquidInventoryValue: "Nåværende flytende beholdningsverdi",
  buySell: "Kjøp/selg",
  price: "Pris",
  item: "Vare",
  dateTime: "Dato/tid",
  recentPurchasesSales: "Nylige kjøp/salg",
  dashboard: "Dashbord",
  inventoryManagement: "Lagerstyring",
  logIn: "Logg inn",
  logOut: "Logg ut",
  noTransactions: "Ingen transaksjoner",
  yourFriends: "Dine venner",
} as Record<TranslationType, string>;

export default nbNoMessages;
