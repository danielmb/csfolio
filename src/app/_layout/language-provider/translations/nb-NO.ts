import { type TranslationType } from "./en-US";

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
  inventoryValue: "Inventarverdi",
  news: "Nyheter",
  notAuthenticated:
    "Siden du prøver å få tilgang til, er bare tilgjengelig for autentiserte brukere. Vennligst {login} for å få tilgang til siden.",
} as Record<TranslationType, string>;

export default nbNoMessages;
