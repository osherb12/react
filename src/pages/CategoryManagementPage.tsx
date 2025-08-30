import { Box, Heading, VStack, Text, useToast, Flex, Spacer, IconButton, Input, Card, CardHeader, CardBody, SimpleGrid, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useColorModeValue } from '@chakra-ui/react';
import AddCategoryForm from '../components/AddCategoryForm';
import { useEffect, useState } from 'react';
import apiClient from '../services/api-client';
import type { Category, SubCategory } from '../types/types';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';


const CategoryManagementPage = () => {
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [isEditingMainCategory, setIsEditingMainCategory] = useState(false);
  const [editingParentId, setEditingParentId] = useState<string | undefined>(undefined);

  const categoryBg = useColorModeValue('gray.50', 'gray.700');
  const subcategoryBg = useColorModeValue('gray.100', 'gray.600');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.500');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<Category[]>('/categories');
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (category: Category | SubCategory, isMain: boolean, parentId?: string) => {
    setEditingId(category.id || null);
    setEditingName(category.name);
    setIsEditingMainCategory(isMain);
    setEditingParentId(parentId);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingParentId(undefined);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      let url = '';
      if (isEditingMainCategory) {
        url = `/categories/${editingId}`;
      } else {
        url = `/categories/${editingParentId}/subcategories/${editingId}`;
      }
      console.log('Attempting to update category with URL:', url);
      console.log('Sending data:', { name: editingName });
      await apiClient.put(url, { name: editingName });
      toast({
        title: "Updated successfully.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setEditingId(null);
      setEditingName('');
      setEditingParentId(undefined);
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error('Error updating category:', err);
      toast({
        title: "Error updating.",
        description: "Failed to update category.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: string, isMain: boolean, parentId?: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${isMain ? "category" : "subcategory"}?`)) {
      return;
    }

    try {
      let url = '';
      if (isMain) {
        url = `/categories/${id}`;
      }
      else {
        url = `/categories/${parentId}/subcategories/${id}`;
      }
      await apiClient.delete(url);
      toast({
        title: 'Deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error('Error deleting category:', err);
      toast({
        title: 'Error deleting.',
        description: 'Failed to delete category.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="xl">{"Loading categories..."}</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="xl" color="red.500">{"Failed to load categories."}</Text>
      </Box>
    );
  }

  return (
    <Box p={8} maxWidth="1200px" mx="auto">
      <Heading as="h1" size="xl" mb={8} textAlign="center">{"Category Management Dashboard"}</Heading>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
        <Card p={6} shadow="lg" borderRadius="lg">
          <CardHeader>
            <Heading as="h2" size="lg" mb={4}>{"Add New Category"}</Heading>
          </CardHeader>
          <CardBody>
            <AddCategoryForm onCategoryAdded={fetchCategories} />
          </CardBody>
        </Card>

        <Card p={6} shadow="lg" borderRadius="lg">
          <CardHeader>
            <Heading as="h2" size="lg" mb={4}>{"Existing Categories"}</Heading>
          </CardHeader>
          <CardBody>
            {categories.length === 0 ? (
              <Text fontSize="lg" textAlign="center" py={10}>{"No categories found."}</Text>
            ) : (
              <Accordion allowMultiple>
                {categories.map(category => (
                  <AccordionItem key={category.id} mb={4} border="1px" borderColor="gray.200" _dark={{ borderColor: 'gray.600' }} borderRadius="md" bg={categoryBg}>
                    <h2>
                      <AccordionButton _expanded={{ bg: 'teal.500', color: 'white' }} borderRadius="md" py={3}>
                        <Flex flex="1" align="center">
                          {editingId === category.id && isEditingMainCategory ? (
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              size="md"
                              ms={2}
                              flex="1"
                              onClick={(e) => e.stopPropagation()} // Prevent accordion from toggling
                            />
                          ) : (
                            <Text fontWeight="bold" fontSize="lg" flex="1">{category.name}</Text>
                          )}
                          <Spacer />
                          {editingId === category.id && isEditingMainCategory ? (
                            <Flex>
                              <IconButton
                                aria-label={"Save Category"}
                                icon={<CheckIcon />}
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }}
                                colorScheme="green"
                                ms={2}
                              />
                              <IconButton
                                aria-label={"Cancel Edit"}
                                icon={<CloseIcon />}
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                                colorScheme="red"
                              />
                            </Flex>
                          ) : (
                            <Flex>
                              <IconButton
                                aria-label={"Edit Category"}
                                icon={<EditIcon />}
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleEditClick(category, true); }}
                                ms={2}
                              />
                              <IconButton
                                aria-label={"Delete Category"}
                                icon={<DeleteIcon />}
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleDelete(category.id!, true); }}
                                colorScheme="red"
                              />
                            </Flex>
                          )}
                        </Flex>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <AccordionIcon />
                        )}
                      </AccordionButton>
                    </h2>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <AccordionPanel pb={4} bg={subcategoryBg} borderBottomRadius="md">
                        <VStack align="stretch" spacing={2} ps={4}>
                          {category.subcategories.map(sub => (
                            <Flex key={sub.id} align="center" py={1} px={2} borderRadius="md" _hover={{ bg: hoverBgColor }}>
                              {editingId === sub.id && !isEditingMainCategory ? (
                                <Input
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  size="sm"
                                  ms={2}
                                  flex="1"
                                />
                              ) : (
                                <Text fontSize="md" flex="1">- {sub.name}</Text>
                              )}
                              <Spacer />
                              {editingId === sub.id && !isEditingMainCategory ? (
                                <Flex>
                                  <IconButton
                                    aria-label={"Save Subcategory"}
                                    icon={<CheckIcon />}
                                    size="xs"
                                    onClick={handleSaveEdit}
                                    colorScheme="green"
                                    ms={2}
                                  />
                                  <IconButton
                                    aria-label={"Cancel Subcategory Edit"}
                                    icon={<CloseIcon />}
                                    size="xs"
                                    onClick={handleCancelEdit}
                                    colorScheme="red"
                                  />
                                </Flex>
                              ) : (
                                <Flex>
                                  <IconButton
                                    aria-label={"Edit Subcategory"}
                                    icon={<EditIcon />}
                                    size="xs"
                                    onClick={() => handleEditClick(sub, false, category.id)}
                                    ms={2}
                                  />
                                  <IconButton
                                    aria-label={"Delete Subcategory"}
                                    icon={<DeleteIcon />}
                                    size="xs"
                                    onClick={() => handleDelete(sub.id!, false, category.id)}
                                    colorScheme="red"
                                  />
                                </Flex>
                              )}
                            </Flex>
                          ))}
                        </VStack>
                      </AccordionPanel>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default CategoryManagementPage;
