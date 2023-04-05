import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Deploy } from "./pages/Deploy";
import { IndexPage } from "./pages/Index";
import { TronProvider } from "./providers/TronProvider";
import { QueryClient, QueryClientProvider } from 'react-query';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminBills } from "./pages/admin/AdminBills";
import { AdminMenu } from "./pages/admin/AdminMenu";
import { AppHomePage } from "./pages/app/Home";
import { OrderProvider } from "./providers/OrderProvider";
import { AppOrdersPage } from "./pages/app/Orders";
import { AppStart } from "./pages/app/Start";
import { AppBillPage } from "./pages/app/Bill";

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
    path: '/admin/menu',
    element: <AdminMenu />
  },
  {
    path: '/admin/bills',
    element: <AdminBills />
  },
  {
    path: '/app',
    element: <AppHomePage />
  },
  {
    path: '/app/start',
    element: <AppStart />
  },
  {
    path: '/app/order',
    element: <AppOrdersPage />
  },
  {
    path: '/app/bill',
    element: <AppBillPage />
  },
]);

 // Create a client
 const queryClient = new QueryClient()

function App() {
  return (
    <>
    <OrderProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <TronProvider>
          <RouterProvider router={router} />
        </TronProvider>
      </QueryClientProvider>
    </OrderProvider>
    </>
  );
}

export default App;
