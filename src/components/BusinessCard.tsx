import {
  Box,
  Image,
  Avatar,
  Heading,
  Text,
  HStack,
  VStack,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { Business } from "../types/types";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({
  business,
}: BusinessCardProps) {
  const { id, name, description, mainCategoryName, subCategoryName, address, profileImageUrl } = business;
  const image = profileImageUrl || "/src/assets/card.png";
  const avatarText = name.charAt(0).toUpperCase();
  const border = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.800", "gray.200");
  const descriptionColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Link to={`/business/${id}`}>
      <Box
        borderWidth="1px"
        borderColor={border}
        borderRadius="lg"
        overflow="hidden"
        w="100%"
        maxW="250px"
        minH="350px"
        p={4}
        position="relative"
        bg={bgColor}
        boxShadow="md"
        _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
        transition="0.2s ease-in-out"
      >
        {/* Like Button */}
        <IconButton
          aria-label={"Like"}
          icon={<FaRegHeart />}
          size="md"
          variant="ghost"
          colorScheme="red"
          position="absolute"
          top="3"
          insetEnd="3"
          zIndex="1"
        />

        {/* Image */}
        <Image
          src={image}
          alt={name}
          objectFit="cover"
          w="100%"
          h="140px"
          borderRadius="md"
          mb={3}
        />

        {/* Main Content VStack */}
        <VStack spacing={2} align="flex-start" flex="1">
          {/* Company Name and Avatar */}
          <HStack spacing={3} align="center" w="100%">
            <Avatar name={name} size="md" bg="purple.500">
              {avatarText}
            </Avatar>
            <VStack spacing={0} align="flex-start" flex="1">
              <Heading as="h4" size="md" noOfLines={1}>
                <Text color={headingColor} fontWeight="semibold">{name}</Text>
              </Heading>
              {/* Category and Location */}
              <Text fontSize="sm" color={descriptionColor}>
                {mainCategoryName}{subCategoryName ? " / " + subCategoryName : ''} {" | "} {address.city}, {address.country}
              </Text>
            </VStack>
          </HStack>

          {/* Description */}
          <Text fontSize="sm" color={descriptionColor} noOfLines={3} pt={2}>
            {description}
          </Text>

          {/* Price (if applicable, or remove) */}
          {/* <Box w="100%" mt="auto">
            <Text fontSize="lg" color={priceColor} fontWeight="bold" textAlign="right}>
              From ₪{price}
            </Text>
          </Box> */}
        </VStack>
      </Box>
    </Link>
  );
}