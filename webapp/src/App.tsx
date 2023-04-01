import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Deploy } from "./pages/Deploy";
import { IndexPage } from "./pages/Index";
import { TronProvider } from "./providers/TronProvider";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/deploy",
    element: <Deploy />,
  },
]);

function App() {
  return (
    <>
      <ToastContainer />
      <TronProvider>
        <RouterProvider router={router} />
      </TronProvider>
    </>
  );
}

export default App;
