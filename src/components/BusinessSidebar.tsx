import {
  Box,
  Heading,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useColorModeValue,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import apiClient from "../services/api-client";
import type { Category, SubCategory } from "../types/types";


interface BusinessSidebarProps {
  onFilterChange: (filters: { mainCategoryId: string; subCategoryId: string; keyword: string }) => void;
  currentFilters: { mainCategoryId: string; subCategoryId: string; keyword: string };
}

function BusinessSidebar({ onFilterChange, currentFilters }: BusinessSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<Category | undefined>(undefined);
  const [keyword, setKeyword] = useState(currentFilters.keyword);

  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headerColor = useColorModeValue("blue.600", "blue.300");
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<Category[]>('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Set selectedMainCategory based on currentFilters when categories are loaded
    if (categories.length > 0 && currentFilters.mainCategoryId) {
      const mainCat = categories.find(cat => cat.id === currentFilters.mainCategoryId);
      setSelectedMainCategory(mainCat);
    } else if (!currentFilters.mainCategoryId) {
      setSelectedMainCategory(undefined); // Clear selected main category if filter is cleared
    }
  }, [categories, currentFilters.mainCategoryId]);

  const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const mainCat = categories.find(cat => cat.id === id);
    setSelectedMainCategory(mainCat);
    onFilterChange({
      ...currentFilters,
      mainCategoryId: id,
      subCategoryId: '', // Reset subcategory when main category changes
    });
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    onFilterChange({
      ...currentFilters,
      subCategoryId: id,
    });
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const applyFilters = () => {
    onFilterChange({
      ...currentFilters,
      keyword: keyword,
    });
  };

  const clearFilters = () => {
    setKeyword('');
    setSelectedMainCategory(undefined);
    onFilterChange({
      mainCategoryId: '',
      subCategoryId: '',
      keyword: '',
    });
  };

  return (
    <Box
      bg={bgColor}
      w="100%"
      p={6}
      borderRadius="xl"
      boxShadow="xl"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Heading as="h2" size="xl" mb={6} color={headerColor} textAlign="center">
        {"Filters"}
      </Heading>

      <VStack spacing={4} align="stretch">
        {/* Keyword Search */}
        <FormControl>
          <FormLabel htmlFor="keyword-search">{"Keyword"}</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input
              id="keyword-search"
              type="text"
              placeholder={"Search by keyword..."}
              value={keyword}
              onChange={handleKeywordChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  applyFilters();
                }
              }}
              borderColor={borderColor}
              color={textColor}
            />
          </InputGroup>
        </FormControl>

        {/* Categories Filter */}
        <Accordion allowMultiple defaultIndex={[0]}>
          <AccordionItem border="none">
            <h2>
              <AccordionButton py={4} _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}>
                <Box as="span" flex="1" textAlign="start" fontWeight="bold" fontSize="lg" color={textColor}>
                  {"Categories"}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <VStack align="start" spacing={3}>
                <FormControl>
                  <FormLabel htmlFor="main-category">{"Main Category"}</FormLabel>
                  <Select
                    id="main-category"
                    placeholder={"Select Main Category"}
                    value={currentFilters.mainCategoryId}
                    onChange={handleMainCategoryChange}
                    borderColor={borderColor}
                    color={textColor}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {selectedMainCategory && selectedMainCategory.subcategories && selectedMainCategory.subcategories.length > 0 && (
                  <FormControl>
                    <FormLabel htmlFor="sub-category">{"Subcategory"}</FormLabel>
                    <Select
                      id="sub-category"
                      placeholder={"Select Subcategory"}
                      value={currentFilters.subCategoryId}
                      onChange={handleSubCategoryChange}
                      borderColor={borderColor}
                      color={textColor}
                    >
                      {selectedMainCategory.subcategories.map((sub: SubCategory) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>

      <VStack mt={8} spacing={4}>
        <Button colorScheme="blue" size="lg" w="100%" boxShadow="md" _hover={{ boxShadow: "lg" }} onClick={applyFilters}>
          {"Apply Filters"}
        </Button>
        <Button variant="outline" size="lg" w="100%" borderColor={borderColor} color={textColor} _hover={{ bg: useColorModeValue("gray.50", "gray.700") }} onClick={clearFilters}>
          {"Clear All"}
        </Button>
      </VStack>
    </Box>
  );
}

export default BusinessSidebar;