import { Box, Container } from '@chakra-ui/react';
import SignupForm from '../components/SignupForm';

const SignupPage = () => {
  return (
    <Container maxW="container.lg" py={10}>
      <Box display="flex" justifyContent="center">
        <SignupForm />
      </Box>
    </Container>
  );
};

export default SignupPage;
