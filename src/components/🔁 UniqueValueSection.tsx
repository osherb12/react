import {
    Box,
    Heading,
    Text,
    Stack,
    useColorModeValue,
    SimpleGrid,
    Icon,
  } from "@chakra-ui/react";
  import { motion } from "framer-motion";
  import {
    FaMagic,
    FaRegLightbulb,
    FaHandshake,
    FaRegThumbsUp,
  } from "react-icons/fa";
  
  const MotionBox = motion(Box);
  
  interface ValueCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
  }
  
  const ValueCard = ({ icon, title, description }: ValueCardProps) => (
    <MotionBox
      p={6}
      rounded="xl"
      boxShadow="lg"
      whileHover={{ scale: 1.05, rotate: 1 }}
    >
      <Stack align="center" spacing={4}>
        <Icon as={icon} boxSize={8} color="teal.400" />
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
        <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
          {description}
        </Text>
      </Stack>
    </MotionBox>
  );
  
  const UniqueValueSection = () => {
    return (
      <Box px={6} py={24}>
        <Stack spacing={4} textAlign="center" mb={10}>
          <Heading fontSize="3xl">What Makes BizBoard Different?</Heading>
          <Text color={useColorModeValue("gray.600", "gray.400")}>
            We don’t just pin content. We make your business feel alive.
          </Text>
        </Stack>
  
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <ValueCard
            icon={FaMagic}
            title="Instant Visuals"
            description="Boards that pop — your content stands out effortlessly."
          />
          <ValueCard
            icon={FaRegLightbulb}
            title="Smart Discovery"
            description="Your board connects you with local customers intelligently."
          />
          <ValueCard
            icon={FaHandshake}
            title="Human First"
            description="We prioritize people and trust. Every board is personal."
          />
          <ValueCard
            icon={FaRegThumbsUp}
            title="Zero Learning Curve"
            description="No training needed. You’re live in under 60 seconds."
          />
        </SimpleGrid>
      </Box>
    );
  };
  
  export default UniqueValueSection;
  