

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  useToast,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/api-client';


interface ReviewFormProps {
  businessId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm = ({ businessId, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuth();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit a review.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a star rating.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please write a comment for your review.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      await apiClient.post('/reviews', {
        businessId,
        userId: user.uid,
        userName: user.displayName || user.email, // Use display name or email
        rating,
        comment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Review submitted successfully!",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setRating(0);
      setComment('');
      onReviewSubmitted(); // Notify parent component to refresh reviews
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error submitting review",
        description: "Failed to submit review. Please try again.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="sm" mt={6}>
      <VStack spacing={4} align="stretch">
        <FormControl id="rating" isRequired>
          <FormLabel>{"Your Rating"}</FormLabel>
          <HStack spacing={1}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton
                key={star}
                aria-label={`${star} stars`}
                icon={<StarIcon />}
                color={star <= rating ? 'teal.400' : 'gray.300'}
                onClick={() => setRating(star)}
                variant="ghost"
                size="lg"
              />
            ))}
          </HStack>
        </FormControl>

        <FormControl id="comment" isRequired>
          <FormLabel>{"Your Comment"}</FormLabel>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={"Share your experience..."}
            rows={4}
          />
        </FormControl>

        <Button
          colorScheme="teal"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText={"Submitting..."}
          alignSelf="end"
        >
          {"Submit Review"}
        </Button>
      </VStack>
    </Box>
  );
};

export default ReviewForm;