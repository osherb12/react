import {
  Box,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaSearch, FaClipboardList, FaUsers, FaChartBar } from "react-icons/fa";


interface FeatureProps {
  title: string;
  text: string;
  icon: React.ElementType;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack align="center" textAlign="center" spacing={3}>
      <Flex
        w={12}
        h={12}
        align="center"
        justify="center"
        rounded="full"
        bg={useColorModeValue("blue.100", "blue.900")}
        color={useColorModeValue("blue.600", "blue.200")}
        mb={2}
      >
        <Icon as={icon} boxSize={6} />
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={useColorModeValue("gray.600", "gray.400")}>{text}</Text>
    </Stack>
  );
};

const FeaturesSection = () => {
  
  return (
    <Box px={6} py={20}>
      <Stack spacing={4} mb={12} textAlign="center">
        <Heading fontSize="3xl">{"Features"}</Heading>
        <Text color={useColorModeValue("gray.600", "gray.400")}>
          {"Discover how BizBoard helps your business thrive."}
        </Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
        <Feature
          icon={FaSearch}
          title="Get Discovered"
          text="Show up when customers search for businesses like yours."
        />
        <Feature
          icon={FaClipboardList}
          title="Organize Easily"
          text="Pin services, offers, and updates in a visual board."
        />
        <Feature
          icon={FaUsers}
          title="Connect with Clients"
          text="Let people follow your board and stay updated."
        />
        <Feature
          icon={FaChartBar}
          title="Track Your Growth"
          text="See how your visibility improves over time."
        />
      </SimpleGrid>
    </Box>
  );
};

export default FeaturesSection;
