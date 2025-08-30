import { Box, Container, Heading, useToast } from "@chakra-ui/react";
import BusinessProfileForm from "../components/BusinessProfileForm";
import type { Business } from "../types/types";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api-client";


function CreateBusinessPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  

  const handleSubmit = async (data: Business) => {
    if (!user || !user.uid || !user.getIdToken) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a business profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw new Error("User not authenticated.");
    }

    const businessDataToSave = { ...data, ownerId: user.uid, ownerName: user.displayName || "Unknown" };

    try {
      const response = await apiClient.post<Business>("/businesses", businessDataToSave);
      console.log("Creation successful:", response.data);

      // After successful creation, update user role to business_owner
      const token = await user.getIdToken();
      await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: 'business_owner' }),
      });

      toast({
        title: "Business profile created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/business/${response.data.id}`); // Redirect to the new business page
      return Promise.resolve();
    } catch (error) {
      console.error("Error creating business profile:", error);
      toast({
        title: "Error creating business profile",
        description: (error as Error).message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return Promise.reject(error);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          {"Create Business Profile"}
        </Heading>
        <BusinessProfileForm onSubmit={handleSubmit} />
      </Box>
    </Container>
  );
}

export default CreateBusinessPage;
