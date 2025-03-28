import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';


const httpLink = createHttpLink({
  uri: 'https://classtrack-api-alumnos-bqh8a0fnbpefhhgq.mexicocentral-01.azurewebsites.net/api/graphql', // Asegúrate de que esta URL sea correcta
});

const authLink = setContext((_, { headers }) => {
  // Obtén el token de autenticación si es necesario
  const token = AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;