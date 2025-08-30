import { Box, Container, Text } from '@chakra-ui/react';
import BusinessProfileForm from '../components/BusinessProfileForm';
import type { Business } from '../types/types';
import { useEffect, useState } from 'react';
import apiClient from '../services/api-client';
import { useParams, useNavigate } from 'react-router-dom';


const EditBusinessPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialBusinessData, setInitialBusinessData] = useState<Business | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (id) {
      apiClient.get<Business>(`/businesses/${id}`)
        .then(response => {
          setInitialBusinessData(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching business:', err);
          setError("Failed to load business data.");
          setLoading(false);
        });
    } else {
      setError("No business ID provided.");
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (data: Business) => {
    if (!id) {
      console.error("No business ID for update.");
      throw new Error("Cannot update business without an ID.");
    }

    try {
      const response = await apiClient.put<Business>(`/businesses/${id}`, data);
      console.log("Update successful:", response);
      navigate('/my-business'); // Redirect to my businesses page after successful update
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating business profile:', error);
      return Promise.reject(error);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <Text>{"Loading business data..."}</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={10}>
        <Text color="red.500">{error}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Box display="flex" justifyContent="center">
        {initialBusinessData ? (
          <BusinessProfileForm initialData={initialBusinessData} onSubmit={handleSubmit} />
        ) : (
          <Text>{"Business not found or could not be loaded."}</Text>
        )}
      </Box>
    </Container>
  );
};

export default EditBusinessPage;