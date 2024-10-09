import { config, list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text } from '@keystone-6/core/fields';
export default config({
  db: {
    provider: 'sqlite',
    url: 'file:./db/deteccionestudiantes.db',
  },
  lists: {
    Resident: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      street: text({ validation: { isRequired: true } }),
      number: text({ validation: { isRequired: true } }),
      },
    }),
  },
});
