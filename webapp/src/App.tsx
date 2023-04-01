import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Deploy } from "./pages/Deploy";
import { IndexPage } from "./pages/Index";
import { TronProvider } from "./providers/TronProvider";
import { QueryClient, QueryClientProvider } from 'react-query';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminBills } from "./pages/admin/AdminBills";
import { AdminMenu } from "./pages/admin/AdminMenu";

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
  }
]);

 // Create a client
 const queryClient = new QueryClient()

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <TronProvider>
          <RouterProvider router={router} />
        </TronProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
