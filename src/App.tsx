import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/home";
import { Admin } from "./pages/admin";
import { Login } from "./pages/login";
import { Networks } from "./pages/networks";
import { Private } from "./components/routes/Private";
import { ErrorPage } from "./pages/error";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/admin",
    element: <Private><Admin/></Private>
  },
  {
    path: "/admin/social",
    element: <Private><Networks/></Private>
  },
  {
    path: "*",
    element: <ErrorPage/>
  }
]);

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}