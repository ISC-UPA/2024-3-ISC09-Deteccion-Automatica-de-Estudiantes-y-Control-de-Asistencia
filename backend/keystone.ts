import { config, list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text } from '@keystone-6/core/fields';
export default config({
  db: {
    provider: 'sqlite',
    url: 'file:./db/ClassAtendant.db',
  },
  lists: {
    Personal: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      mayor: text({ validation: { isRequired: true } }),
      quarer: text({ validation: { isRequired: true } }),
      },
    }),
  },
});
