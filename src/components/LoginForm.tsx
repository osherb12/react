import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Using message for both success and error
  const navigate = useNavigate();
  const { login } = useAuth();
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    try {
      await login(email, password);
      setMessage("Login successful!");
      navigate('/'); // Redirect to home page on successful login
    } catch (err: unknown) {
      setMessage((err instanceof Error ? err.message : "Login failed."));
    }
  };

  const handleGoogleLogin = async () => {
    setMessage('');
    try {
      await signInWithPopup(auth, googleProvider);
      setMessage("Google login successful!");
      navigate('/'); // Redirect to home page on successful Google login
    } catch (error: unknown) {
      setMessage((error as Error).message || "Google login failed.");
    }
  };

  return (
    <Box p={4} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={4}>{"Login"}</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={3}>
          <FormControl id="email" isRequired>
            <FormLabel>{"Email Address"}</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>{"Password"}</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            {"Login with Email"}
          </Button>
          <Button onClick={handleGoogleLogin} colorScheme="red" width="full">
            {"Login with Google"}
          </Button>
        </VStack>
        {message && <Text mt={4} color={message.includes("Login successful!") || message.includes("Google login successful!") ? 'green.500' : 'red.500'}>{message}</Text>}
      </form>
    </Box>
  );
};

export default LoginForm;
