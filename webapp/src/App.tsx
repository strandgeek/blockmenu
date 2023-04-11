import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Deploy } from "./pages/Deploy";
import { IndexPage } from "./pages/Index";
import { QueryClient, QueryClientProvider } from "react-query";
import { publicProvider } from "wagmi/providers/public";
import { ToastContainer, toast } from "react-toastify";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import "react-toastify/dist/ReactToastify.css";
import { AdminBills } from "./pages/admin/AdminBills";
import { AdminMenu } from "./pages/admin/AdminMenu";
import { AppHomePage } from "./pages/app/Home";
import { OrderProvider } from "./providers/OrderProvider";
import { AppOrdersPage } from "./pages/app/Orders";
import { AppStart } from "./pages/app/Start";
import { AppBillPage } from "./pages/app/Bill";
import { chains, connectors, metaMaskConnector } from "./lib/wagmi";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { WalletProvider } from "./providers/WalletProvider";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminConfig } from "./pages/admin/AdminConfig";
import { AdminPreview } from "./pages/admin/AdminPreview";
import { QrCodeGenerator } from "./pages/admin/QrCodeGenerator";
import { Welcome } from "./pages/app/Welcome";
import { EthereumClient, w3mConnectors } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { AdminAuth } from "./pages/admin/AdminAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/deploy",
    element: <Deploy />,
  },
  {
    path: "/admin/auth",
    element: <AdminAuth />,
  },
  {
    path: "/admin/menu",
    element: <AdminMenu />,
  },
  {
    path: "/admin/orders",
    element: <AdminOrders />,
  },
  {
    path: "/admin/bills",
    element: <AdminBills />,
  },
  {
    path: "/admin/users",
    element: <AdminUsers />,
  },
  {
    path: "/admin/config",
    element: <AdminConfig />,
  },
  {
    path: "/admin/preview",
    element: <AdminPreview />,
  },
  {
    path: "/admin/qr-code",
    element: <QrCodeGenerator />,
  },
  {
    path: "/app",
    element: <AppHomePage />,
  },
  {
    path: "/app/welcome",
    element: <Welcome />,
  },
  {
    path: "/app/start",
    element: <AppStart />,
  },
  {
    path: "/app/order",
    element: <AppOrdersPage />,
  },
  {
    path: "/app/bill",
    element: <AppBillPage />,
  },
]);

// Create a React-Query client
const queryClient = new QueryClient();

const { provider } = configureChains(chains, [publicProvider()]);

const projectId = import.meta.env.VITE_CONNECT_WALLET_PROJECT_ID;

// Create a Wagmi Client (Wallet)
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains)

function App() {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <WalletProvider>
          <OrderProvider>
            <QueryClientProvider client={queryClient}>
              <ToastContainer />
              <RouterProvider router={router} />
            </QueryClientProvider>
          </OrderProvider>
        </WalletProvider>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

export default App;
