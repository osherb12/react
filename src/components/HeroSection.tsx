import {
  Box,
  Button,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import heroImage from "../assets/logo4.png";
import BizBoardText from "./BizBoardText";
import { useNavigate } from "react-router-dom";


const MotionImage = motion(Image);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);

const HeroSection = () => {
  const navigate = useNavigate();
  
  const textColor = useColorModeValue("gray.700", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const bgButton = useColorModeValue("teal.400", "teal.300");
  const bgButtonHover = useColorModeValue("teal.500", "teal.400");

  return (
    <Box px={{ base: 4, md: 8 }} py={{ base: 10, md: 20 }}>
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, md: 16 }}
        alignItems="center"
        maxW="1200px"
        mx="auto"
      >
        {/* Left: Text + Button (wrapped in Flex for centering) */}
        <Flex
          direction="column"
          align={{ base: "center", md: "start" }}
          justify="center"
        >
          <Stack
            spacing={{ base: 6, md: 8 }}
            textAlign={{ base: "center", md: "start" }}
            align={{ base: "center", md: "start" }}
            w="full"
          >
            <MotionHeading
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              color={textColor}
              lineHeight="1.2"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <BizBoardText mt={4} mb={2} fontSize="6xl" />
              <br />
              {"Welcome to BizBoard!"}
            </MotionHeading>

            <MotionText
              fontSize={{ base: "md", md: "lg" }}
              color={subTextColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {"Discover local businesses and services. Connect with your community."}
            </MotionText>

            <MotionButton
              size="lg"
              bg={bgButton}
              color="white"
              _hover={{ bg: bgButtonHover }}
              _focus={{ boxShadow: "outline" }}
              rounded="full"
              px={8}
              w={{ base: "full", sm: "auto" }}
              ms={{ base: "auto", sm: "0" }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
              onClick={() => navigate('/businesses')}
            >
              {"Explore All Businesses"}
            </MotionButton>
          </Stack>
        </Flex>

        {/* Right: Image */}
        <MotionImage
          src={heroImage}
          alt="BizBoard visual"
          objectFit="contain"
          w="100%"
          maxW={{ base: "280px", sm: "320px", md: "400px", lg: "480px" }}
          mx="auto"
          animate={{
            y: [0, -6, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </SimpleGrid>
    </Box>
  );
};

export default HeroSection;
