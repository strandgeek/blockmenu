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
import { chains, metaMaskConnector } from "./lib/wagmi";

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
    path: "/admin/menu",
    element: <AdminMenu />,
  },
  {
    path: "/admin/bills",
    element: <AdminBills />,
  },
  {
    path: "/app",
    element: <AppHomePage />,
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

// Create a Wagmi Client (Wallet)
const wagmiClient = createClient({
  autoConnect: true,
  connectors: [metaMaskConnector],
  provider,
});

function App() {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <OrderProvider>
          <QueryClientProvider client={queryClient}>
            <ToastContainer />
            <RouterProvider router={router} />
          </QueryClientProvider>
        </OrderProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
