import { text, relationship, select } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const azureADIntegration = {
  access: allowAll,
  fields: {
    adUserId: text({
      isIndexed: 'unique', // Establece el campo como único
      validation: { isRequired: true }, // Campo requerido
    }),
    adTenantId: text({
      validation: { isRequired: true }, // Campo requerido
    }),
    roleMapping: text(), // Mapeo de roles
    accessTokenValidity: select({
      options: [
        { label: 'Válido', value: 'true' },
        { label: 'Inválido', value: 'false' },
      ],
      defaultValue: 'true',
      ui: { displayMode: 'segmented-control' },
    }), // Validez del token de acceso
    loginHistory: text(), // Historial de inicio de sesión
    user: relationship({
      ref: 'User', // Referencia a la lista de usuarios
      many: false,
    }),
  },
};
