import { Box, Container } from '@chakra-ui/react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <Container maxW="container.lg" py={10}>
      <Box display="flex" justifyContent="center">
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;
