import { Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import CategoriesNav from "./components/CategoriesNav"; // Import CategoriesNav
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.documentElement.dir = 'ltr';
  }, []);

  return (
    <Box>
      <Navbar />
      <CategoriesNav /> {/* Place it right after the main navbar */}
      {/* Add padding to the main content area */}
      <Box padding={5}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;