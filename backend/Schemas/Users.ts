import { allowAll } from '@keystone-6/core/access';
import { text, select, checkbox } from '@keystone-6/core/fields';

export const user = {
  access: allowAll,
  fields: {
    fullName: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true } }),
    phoneNumber: text({ validation: { isRequired: true } }),
    userRole: select({
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Administrative', value: 'Administrative' },
        { label: 'Docent', value: 'Docent' },
        { label: 'Student', value: 'Student' },
      ],
      defaultValue: 'resident',
    }),
    profilePicture: text(),
    accountStatus: select({
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
      defaultValue: 'active',
    }),
    adAuthenticationStatus: checkbox(),
  },
};
