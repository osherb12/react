import {
    Box,
    Stack,
    Text,
    Heading,
    useColorModeValue,
    VStack,
    HStack,
    Icon,
  } from "@chakra-ui/react";
  import { FaUserPlus, FaRegImages, FaLink, FaChartLine } from "react-icons/fa";
  
  
  interface JourneyStep {
    icon: React.ElementType;
    title: string;
    description: string;
    side: "left" | "right";
  }
  
  const steps: JourneyStep[] = [
    {
      icon: FaUserPlus,
      title: "Step 1: Create Your Profile",
      description: "Start with a beautiful business card layout. No tech skills needed.",
      side: "left",
    },
    {
      icon: FaRegImages,
      title: "Step 2: Build Your Board",
      description: "Add pins, images, updates, and services in seconds.",
      side: "right",
    },
    {
      icon: FaLink,
      title: "Step 3: Share & Connect",
      description: "Send your board as a link, QR code, or embed it anywhere.",
      side: "left",
    },
    {
      icon: FaChartLine,
      title: "Step 4: Watch It Grow",
      description: "Get insights on visits, saves, and customer interest.",
      side: "right",
    },
  ];
  
  const JourneySection = () => {
    
    const lineColor = useColorModeValue("gray.300", "gray.600");
    const descriptionColor = useColorModeValue("gray.600", "gray.400");
    const bgColor = useColorModeValue("gray.50", "gray.800");

    return (
      <Box px={6} py={24} bg={bgColor}>
        <Stack spacing={4} textAlign="center" mb={10}>
          <Heading fontSize="3xl">{"Your Journey with BizBoard"}</Heading>
          <Text color={useColorModeValue("gray.600", "gray.400")}>
            {"Simple steps to get your business online and thriving."}
          </Text>
        </Stack>
  
        <VStack spacing={12} position="relative" maxW="4xl" mx="auto">
          {steps.map((step, i) => (
            <HStack
              key={i}
              align="start"
              spacing={6}
              flexDir={step.side === "right" ? "row-reverse" : "row"}
              w="full"
            >
              <Icon as={step.icon} boxSize={8} color="teal.400" mt={1} />
              <Stack textAlign={step.side} spacing={1}>
                <Text fontWeight="bold" fontSize="lg">
                  {step.title}
                </Text>
                <Text color={descriptionColor} fontSize="sm">
                  {step.description}
                </Text>
              </Stack>
            </HStack>
          ))}
  
          {/* Timeline Line */}
          <Box
            position="absolute"
            left="50%"
            top="0"
            bottom="0"
            w="2px"
            bg={lineColor}
            transform="translateX(-50%)"
            zIndex={-1}
          />
        </VStack>
      </Box>
    );
  };
  
  export default JourneySection;
  