import { Box, Text, HStack, Icon, VStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import type { Review } from '../types/types';
import { formatFirebaseTimestamp } from '../utils/dateUtils';


interface ReviewCardProps {
  review: Review;
  isCurrentUserReview?: boolean; // New prop
}

const ReviewCard = ({ review, isCurrentUserReview }: ReviewCardProps) => {
  
  const renderStars = (rating: number) => {
    return (
      <HStack spacing={0.5}>
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            as={StarIcon}
            color={i < rating ? 'teal.400' : 'gray.300'}
            boxSize={4}
          />
        ))}
      </HStack>
    );
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" boxShadow={isCurrentUserReview ? "xl" : "sm"} mb={4} bg={isCurrentUserReview ? "teal.50" : "white"}>
      <HStack justifyContent="space-between" mb={2}>
        <Text fontWeight="bold">{review.userName}</Text>
        <Text fontSize="sm" color="gray.500">
          {formatFirebaseTimestamp(review.createdAt)}
        </Text>
      </HStack>
      <VStack align="flex-start" spacing={2}>
        {renderStars(review.rating)}
        <Text>{review.comment}</Text>
      </VStack>
    </Box>
  );
};

export default ReviewCard;