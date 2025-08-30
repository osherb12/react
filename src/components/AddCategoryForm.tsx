import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  Select,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import type { Category } from '../types/types';


interface AddCategoryFormProps {
  onCategoryAdded: () => void;
}

const AddCategoryForm = ({ onCategoryAdded }: AddCategoryFormProps) => {
  const [categoryName, setCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const toast = useToast();
  const { user } = useAuth();
  

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error fetching categories",
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.getIdToken) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a category.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!categoryName.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name cannot be empty.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = await user.getIdToken();
      const body: { name: string; parentId?: string } = { name: categoryName.trim() };
      if (parentCategory) {
        body.parentId = parentCategory;
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add category');
      }

      toast({
        title: "Category added successfully",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setCategoryName(''); // Clear the input
      setParentCategory(''); // Clear parent selection
      onCategoryAdded(); // Notify parent to refresh
      fetchCategories(); // Re-fetch categories to update the dropdown with the new category/subcategory

    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error adding category",
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl id="categoryName" isRequired>
          <FormLabel mb={1}>{"Category Name"}</FormLabel>
          <Input
            name="categoryName"
            placeholder={"Enter category name"}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            size="md"
          />
        </FormControl>

        <FormControl id="parentCategory">
          <FormLabel mb={1}>{"Parent Category"}</FormLabel>
          <Select
            placeholder={"Select Parent Category (Optional)"}
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
            size="md"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="teal" size="md" width="full" mt={4}>
          {"Add Category"}
        </Button>
      </VStack>
    </form>
  );
};

export default AddCategoryForm;
