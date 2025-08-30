import { Box, Heading, Flex } from "@chakra-ui/react";
import BusinessGrid from "../components/BusinessGrid";
import BusinessSidebar from "../components/BusinessSidebar";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";


const BusinessesPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    mainCategoryId: searchParams.get('mainCategoryId') || '',
    subCategoryId: searchParams.get('subCategoryId') || '',
    keyword: searchParams.get('keyword') || '',
  });
  

  // Update filters when URL search params change
  useEffect(() => {
    setFilters({
      mainCategoryId: searchParams.get('mainCategoryId') || '',
      subCategoryId: searchParams.get('subCategoryId') || '',
      keyword: searchParams.get('keyword') || '',
    });
  }, [searchParams]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={6}>{"All Businesses"}</Heading>
      <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
        <Box flexBasis={{ base: '100%', md: '250px' }} ms={{ base: 0, md: 8 }} mb={{ base: 8, md: 0 }}>
          <BusinessSidebar onFilterChange={handleFilterChange} currentFilters={filters} />
        </Box>
        <Box flex="1">
          <BusinessGrid filters={filters} />
        </Box>
      </Flex>
    </Box>
  );
};

export default BusinessesPage;
