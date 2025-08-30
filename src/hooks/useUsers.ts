import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api-client';
import { type User } from '../types/types';

const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () =>
      apiClient
        .get('/users')
        .then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useUsers;