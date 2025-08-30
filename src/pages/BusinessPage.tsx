import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Image,
  VStack,
  HStack,
  Badge,
  Divider,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import type { Business, Review } from '../types/types';
import { formatFirebaseTimestamp } from '../utils/dateUtils';
import apiClient from '../services/api-client';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../hooks/useAuth'; // Import useAuth hook


const BusinessPage = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [currentGalleryImageIndex, setCurrentGalleryImageIndex] = useState(0);
  

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      const response = await apiClient.get<Review[]>(`/reviews/${id}`);
      setReviews(response.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  }, [id]);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) {
        setError("Business ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/businesses/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch business details.");
        }
        const data: Business = await response.json();
        setBusiness(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
    fetchReviews(); // Fetch reviews when business data is fetched
  }, [id, fetchReviews]);


  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>{"Loading business details..."}</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert status="error">
          <AlertIcon />
          {"Error: "}{error}
        </Alert>
      </Box>
    );
  }

  if (!business) {
    return (
      <Box p={4}>
        <Alert status="info">
          <AlertIcon />
          {"Business not found."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={8} maxWidth="1200px" margin="auto" borderWidth={1} borderRadius="lg" boxShadow="lg">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl">{business.name}</Heading>
        <Text fontSize="lg" color="gray.600">{business.description}</Text>

        {business.profileImageUrl && (
          <Box mb={6}>
            <Image
              src={business.profileImageUrl}
              alt={`${business.name} profile image`}
              borderRadius="md"
              objectFit="cover"
              maxH="400px"
              width="100%"
            />
          </Box>
        )}

        {business.images && business.images.length > 0 && (
          <Box position="relative" width="100%" mb={6}>
            <Flex align="center" justify="center">
              <IconButton
                aria-label={"Previous image"}
                icon={<ChevronLeftIcon />}
                onClick={() => setCurrentGalleryImageIndex(prev => (prev === 0 ? business.images!.length - 1 : prev - 1))}
                isDisabled={business.images.length <= 1}
                position="absolute"
                left="2"
                zIndex="1"
              />
              <Image
                src={business.images[currentGalleryImageIndex]}
                alt={`${business.name} gallery image ${currentGalleryImageIndex + 1}`}
                borderRadius="md"
                objectFit="cover"
                maxH="400px"
                width="100%"
              />
              <IconButton
                aria-label={"Next image"}
                icon={<ChevronRightIcon />}
                onClick={() => setCurrentGalleryImageIndex(prev => (prev === business.images!.length - 1 ? 0 : prev + 1))}
                isDisabled={business.images.length <= 1}
                position="absolute"
                right="2"
                zIndex="1"
              />
            </Flex>
            <Text textAlign="center" mt={2} fontSize="sm" color="gray.500">
              {currentGalleryImageIndex + 1} / {business.images.length}
            </Text>
          </Box>
        )}

        <HStack spacing={4} wrap="wrap">
          <Badge colorScheme="purple" fontSize="md" p={2} borderRadius="md">
            {"Main Category: "}{business.mainCategoryName}
          </Badge>
          {business.subCategoryName && (
            <Badge colorScheme="teal" fontSize="md" p={2} borderRadius="md">
              {"Subcategory: "}{business.subCategoryName}
            </Badge>
          )}
          {business.yearsOfExperience && (
            <Badge colorScheme="blue" fontSize="md" p={2} borderRadius="md">
              {"Experience: "}{business.yearsOfExperience}{" years"}
            </Badge>
          )}
          <Badge colorScheme="green" fontSize="md" p={2} borderRadius="md">
            {"Status: "}{business.status}
          </Badge>
        </HStack>

        <Divider />

        <Heading as="h2" size="md" mt={4}>{"Contact Information"}</Heading>
        <VStack align="start" spacing={1}>
          {business.contact?.email && <Text>{"Email: "}{business.contact.email}</Text>}
          {business.contact?.phone && <Text>{"Phone: "}{business.contact.phone}</Text>}
          {business.contact?.website && <Text>{"Website: "}<a href={business.contact.website} target="_blank" rel="noopener noreferrer">{business.contact.website}</a></Text>}
        </VStack>

        <Heading as="h2" size="md" mt={4}>{"Address"}</Heading>
        <VStack align="start" spacing={1}>
          {business.address?.street && <Text>{business.address.street}</Text>}
          {business.address?.city && <Text>{business.address.city}, {business.address.state} {business.address.zipCode}</Text>}
          {business.address?.country && <Text>{business.address.country}</Text>}
        </VStack>

        {business.hoursOfOperation && Object.keys(business.hoursOfOperation).length > 0 && (
          <>
            <Heading as="h2" size="md" mt={4}>{"Hours of Operation"}</Heading>
            <VStack align="start" spacing={1}>
              {Object.entries(business.hoursOfOperation).map(([day, hours]) => (
                <Text key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}: {hours}</Text>
              ))}
            </VStack>
          </>
        )}

        <Text fontSize="sm" color="gray.500" mt={8}>
          {"Created: "}{formatFirebaseTimestamp(business.createdAt)} | {"Updated: "}{formatFirebaseTimestamp(business.updatedAt)}
        </Text>

        <Divider />

        <Heading as="h2" size="md" mt={6}>{"Reviews"}</Heading>
        {business.id && user && !reviews.some(review => review.userId === user.uid) && (
          <ReviewForm businessId={business.id} onReviewSubmitted={fetchReviews} />
        )}

        <VStack spacing={4} align="stretch" mt={4}>
          {reviews.length === 0 ? (
            <Text>{"No reviews yet."}</Text>
          ) : (
            <>
              {user && reviews.filter(review => review.userId === user.uid).map((review: Review) => (
                <ReviewCard key={review.id} review={review} isCurrentUserReview={true} />
              ))}
              {reviews.filter(review => !user || review.userId !== user.uid).map((review: Review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default BusinessPage;
