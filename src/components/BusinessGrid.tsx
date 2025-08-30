import { Box, Flex, SimpleGrid, Button, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import BusinessCard from "./BusinessCard";
import { useState, useEffect } from "react";
import type { Business } from "../types/types";

interface BusinessGridProps {
  filters: { mainCategoryId: string; subCategoryId: string; keyword: string };
}

function BusinessGrid({ filters }: BusinessGridProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.mainCategoryId) {
          params.append('mainCategoryId', filters.mainCategoryId);
        }
        if (filters.subCategoryId) {
          params.append('subCategoryId', filters.subCategoryId);
        }
        if (filters.keyword) {
          params.append('keyword', filters.keyword);
        }

        const queryString = params.toString();
        const url = `/api/businesses${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBusinesses(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [filters]); // Re-fetch businesses when filters change

  const totalPages = Math.ceil(businesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBusinesses = businesses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {"Error loading businesses: "}{error}
      </Alert>
    );
  }

  if (businesses.length === 0) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="200px">
        <Text fontSize="xl" color="gray.500">{"No businesses found."}</Text>
      </Flex>
    );
  }

  return (
    <Box>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={6}
        p={6}
      >
        {currentBusinesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business} // Pass the entire business object
          />
        ))}
      </SimpleGrid>
      <Flex justifyContent="center" p={6}>
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            colorScheme={currentPage === i + 1 ? "teal" : "gray"}
            me={1}
          >
            {i + 1}
          </Button>
        ))}
      </Flex>
    </Box>
  );
}

export default BusinessGrid;