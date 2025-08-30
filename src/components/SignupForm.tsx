import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack } from '@chakra-ui/react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';


const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, displayName }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Sign up successful!");
        setEmail('');
        setPassword('');
        setDisplayName('');
      } else {
        setMessage(data.message || "Sign up failed.");
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      setMessage("Network error. Please try again later.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setMessage("Google sign up successful!");
    } catch (error: unknown) {
      console.error('Error during Google sign up:', error);
      setMessage((error as Error).message || "Google sign up failed.");
    }
  };

  return (
    <Box p={4} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={4}>{"Sign Up"}</Heading>
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
          <FormControl id="displayName">
            <FormLabel>{"Display Name (Optional)"}</FormLabel>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            {"Sign Up with Email"}
          </Button>
          <Button onClick={handleGoogleSignup} colorScheme="red" width="full">
            {"Sign Up with Google"}
          </Button>
        </VStack>
        {message && <Text mt={4} color={message.includes("Sign up successful!") || message.includes("Google sign up successful!") ? 'green.500' : 'red.500'}>{message}</Text>}
      </form>
    </Box>
  );
};

export default SignupForm;
