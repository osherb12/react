import { Box } from "@chakra-ui/react";
import HeroSection from "../components/HeroSection";
import JourneySection from "../components/JourneySection";
import FeaturesSection from "../components/FeaturesSection";

const HomePage = () => {
  return (
    // The grid is no longer needed here
    <Box>
      {/* The <Outlet /> is also removed */}
      <HeroSection />
      <JourneySection />
      <FeaturesSection />
    </Box>
  );
};

export default HomePage;