import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import BusinessesPage from "./pages/BusinessesPage";
import BusinessPage from "./pages/BusinessPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MyBusinessPage from "./pages/MyBusinessPage";
import CreateBusinessPage from "./pages/CreateBusinessPage";
import CategoryManagementPage from "./pages/CategoryManagementPage";
import EditBusinessPage from "./pages/EditBusinessPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "businesses",
        element: <BusinessesPage />,
      },
      {
        path: "business/:id",
        element: <BusinessPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "my-business",
        element: <MyBusinessPage />,
      },
      {
        path: "create-business",
        element: <CreateBusinessPage />,
      },
      {
        path: "category-management",
        element: <CategoryManagementPage />,
      },
      {
        path: "edit-business/:id",
        element: <EditBusinessPage />,
      },
    ],
  },
]);

export default router;