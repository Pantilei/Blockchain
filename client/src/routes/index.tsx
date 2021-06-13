import Blockchain from "../components/Blockchain";
import Blocks from "../components/Blocks";
import Network from "../components/Network";
import Transactions from "../components/Transactions";
import { IRoute } from "../types/routes";

export const routes: IRoute[] = [
  {
    path: "/",
    exact: true,
    menuName: "Blockchain",
    component: Blockchain,
  },
  {
    path: "/blocks",
    exact: true,
    menuName: "Blocks",
    component: Blocks,
  },
  {
    path: "/transactions",
    exact: true,
    menuName: "Transactions",
    component: Transactions,
  },
  {
    path: "/network",
    exact: true,
    menuName: "Network",
    component: Network,
  },
];
