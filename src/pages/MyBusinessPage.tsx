import { Container, Heading, Text, Button, SimpleGrid, Card, CardBody, Stack, CardFooter } from '@chakra-ui/react';
import type { Business } from '../types/types';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import apiClient from '../services/api-client';
import { Link as RouterLink } from 'react-router-dom';


const MyBusinessPage = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (user) {
      setLoading(true);
      apiClient.get<Business[]>(`/businesses?ownerId=${user.uid}`)
        .then(response => {
          setBusinesses(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching businesses:', err);
          setError('Failed to load businesses.');
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError('Please log in to view your businesses.');
    }
  }, [user]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <Text>{"Loading businesses..."}</Text>
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
      <Heading as="h1" size="xl" mb={6}>{"My Businesses"}</Heading>
      <Button as={RouterLink} to="/create-business" colorScheme="teal" mb={6}>
        {"Create New Business"}
      </Button>

      {businesses.length === 0 ? (
        <Text>{"You don't have any businesses yet. Create one to get started!"}</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {businesses.map(business => (
            <Card key={business.id} maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
              <CardBody>
                <Stack spacing="3">
                  <Heading size="md">{business.name}</Heading>
                  <Text>{business.description}</Text>
                  <Text color="blue.600" fontSize="2xl">
                    {business.mainCategoryName}
                  </Text>
                </Stack>
              </CardBody>
              <CardFooter>
                <Button as={RouterLink} to={`/edit-business/${business.id}`} variant="solid" colorScheme="blue">
                  {"Edit Business"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default MyBusinessPage;