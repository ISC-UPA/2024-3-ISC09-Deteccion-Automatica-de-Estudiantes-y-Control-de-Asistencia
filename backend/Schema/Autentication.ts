import { text, relationship, timestamp, select } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const authentication = {
  access: allowAll,
  fields: {
    tokenId: text({
      isIndexed: 'unique', // Establece el campo como único
      validation: { isRequired: true }, // Campo requerido
    }),
    associatedUser: relationship({
      ref: 'User', // Referencia a la lista de usuarios
      many: false, // Relación uno a uno
    }),
    expirationDate: timestamp({
      // No se establece un valor por defecto
    }),
    authenticationType: select({
      options: [
        { label: 'JWT', value: 'jwt' },
        { label: 'Azure AD', value: 'azure_ad' },
      ],
      validation: { isRequired: true }, // Campo requerido
    }),
    adAuthenticationToken: text(), // Token de autenticación de Azure AD
    refreshToken: text(), // Token de actualización
  },
};
