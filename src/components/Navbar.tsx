import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  Button,
  Avatar,
  useColorModeValue,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import logo from "../assets/logo4.png";
import ColorModeSwitch from "../ColorModeSwitch";
import { useAuth } from "../hooks/useAuth";
import BizBoardText from "./BizBoardText";
import { Link } from "react-router-dom";



function Navbar() {
  const { user, logout } = useAuth();
  

  const bg = useColorModeValue("gray.50", "gray.800");
  const shadow = useColorModeValue("sm", "md");

  // Removed toggleLanguage function

  return (
    <Box
      as="header"
      bg={bg}
      px={6}
      py={3}
      boxShadow={shadow}
      position="sticky"
      top={0}
      zIndex={999}
    >
      <Flex align="center" gap={6}>
        {/* Left: Logo and Title */}
        <Link to={"/"}>
          <HStack
            spacing={3}
            minW="fit-content"
            transition="opacity 0.1s ease-in-out"
            _hover={{
              opacity: 0.8,
            }}
          >
            <Image src={logo} alt="BizBoard logo" height="60px" />
            <BizBoardText mt={4} mb={2} fontSize="xl" />
          </HStack>
        </Link>

        {/* Center: Search Bar */}
        <InputGroup flex="1" mx={6}>
          <Input
            placeholder={"Search businesses..."}
            variant="filled"
            bg={useColorModeValue("white", "gray.700")}
            _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
            borderRadius="full"
            size="sm"
            pr="2.5rem" // leave space for the icon on the right
          />
          <InputRightElement
            pointerEvents="none"
            top="55%"
            transform="translateY(-55%)"
          >
            <SearchIcon color="gray.400" />
          </InputRightElement>
        </InputGroup>

        {/* Right: Auth Buttons */}
        <HStack spacing={3} minW="fit-content">
          {user ? (
            <>
              {user.role === 'business_owner' && (
                <Link to="/my-business">
                  <Button
                    variant="ghost"
                    colorScheme="teal"
                    borderRadius="full"
                    size="sm"
                    _hover={{ bg: "teal.50" }}
                  >
                    {"My Businesses"}
                  </Button>
                </Link>
              )}
              {user && user.role !== 'business_owner' && ( // Show if signed in and not yet a business owner
                <Link to="/create-business">
                  <Button
                    variant="solid"
                    colorScheme="purple"
                    borderRadius="full"
                    size="sm"
                    _hover={{ bg: "purple.600" }}
                  >
                    {"Create Business"}
                  </Button>
                </Link>
              )}
              <Link to="/category-management">
                <Button
                  variant="ghost"
                  colorScheme="teal"
                  borderRadius="full"
                  size="sm"
                  _hover={{ bg: "teal.50" }}
                >
                  {"Manage Categories"}
                </Button>
              </Link>
              <Text fontWeight="medium" fontSize="md">
                {user.displayName || user.email}
              </Text>

              <Button
                variant="outline"
                colorScheme="red"
                borderRadius="full"
                size="sm"
                _hover={{ bg: "red.50", borderColor: "red.400" }}
                onClick={logout}
              >
                {"Logout"}
              </Button>

              <Avatar name={user.displayName || user.email || undefined} size="sm" />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="solid"
                  colorScheme="teal"
                  borderRadius="full"
                  size="sm"
                  _hover={{ bg: "teal.600" }}
                >
                  {"Login"}
                </Button>
              </Link>

              <Link to="/signup">
                <Button
                  variant="outline"
                  colorScheme="teal"
                  borderRadius="full"
                  size="sm"
                  _hover={{ bg: "teal.50", borderColor: "teal.400" }}
                >
                  {"Sign Up"}
                </Button>
              </Link>
            </>
          )}

          
          <ColorModeSwitch />
        </HStack>
      </Flex>
    </Box>
  );
}

export default Navbar;