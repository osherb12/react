import {
  HStack,
  useColorMode,
  Box,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { LiaSunSolid, LiaMoonSolid } from "react-icons/lia";

// Animated toggle button
const MotionBox = motion(Box);

const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isRTL = document.documentElement.dir === 'rtl';

  const toggleBg = useColorModeValue("gray.300", "gray.600");
  const knobBg = useColorModeValue("white", "gray.800");

  const knobX = isDark ? (isRTL ? -28 : 28) : 0;

  return (
    <HStack spacing={3} align="center">
      {/* Toggle Switch */}
      <Box
        as="button"
        w="56px"
        h="28px"
        p="2px"
        rounded="full"
        bg={toggleBg}
        boxShadow="inset 0 0 4px rgba(0,0,0,0.2)"
        display="flex"
        alignItems="center"
        onClick={toggleColorMode}
        transition="background 0.3s ease"
        _hover={{ boxShadow: "0 0 8px rgba(0,0,0,0.25)" }}
      >
        <MotionBox
          layout
          w="24px"
          h="24px"
          rounded="full"
          bg={knobBg}
          boxShadow="md"
          animate={{ x: knobX }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </Box>

      {/* Right icon: show active mode icon */}
      <Icon
        as={isDark ? LiaMoonSolid : LiaSunSolid}
        color={isDark ? "blue.300" : "yellow.400"}
        fontSize="22px"
        filter={
          isDark
            ? "drop-shadow(0 0 6px rgba(147,197,253,0.8))"
            : "drop-shadow(0 0 6px rgba(253,224,71,0.8))"
        }
        transition="all 0.3s ease-in-out"
      />
    </HStack>
  );
};

export default ColorModeSwitch;
