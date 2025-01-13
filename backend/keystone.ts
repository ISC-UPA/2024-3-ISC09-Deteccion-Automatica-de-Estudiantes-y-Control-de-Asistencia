import { config } from '@keystone-6/core'
import { lists } from './Schema/Schema';

export default config({
  server: {
    cors: {
      origin: ['http://localhost:8081'], // Permite el origen del frontend
      credentials: true, // Si usas cookies o autenticación
    },
  },
  db: {
    provider: 'sqlite',
    url: 'file:./db/classtrack.db',
  },
  lists,
  //session,
});