import { integer, timestamp, text, select, relationship } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const accessRecord = {
  access: allowAll,
  fields: {
    title: text({
      validation: { isRequired: true },
      isIndexed: 'unique', // Establece el campo como único en la base de datos
    }),
    accessType: select({
      options: [
        { label: 'Residente', value: 'resident' },
        { label: 'Visitante', value: 'visitor' },
        { label: 'Proveedor de servicios', value: 'service_provider' },
      ],
      validation: { isRequired: true }, // Campo requerido
    }),
    entryDateTime: timestamp({
      validation: { isRequired: true },
      defaultValue: { kind: 'now' }, // Establece la fecha y hora actuales por defecto
    }),
    exitDateTime: timestamp(), // Puede ser NULL, así que no se establece un valor por defecto
    personAccessing: relationship({
      ref: 'User', // Referencia a la tabla User
      many: false,
    }),
    // El campo authorizedBy ha sido eliminado como mencionaste.
  },
};
