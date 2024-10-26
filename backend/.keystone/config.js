var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core = require("@keystone-6/core");

// Schema/User.ts
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var user = {
  access: import_access.allowAll,
  fields: {
    name: (0, import_fields.text)({ validation: { isRequired: true } }),
    // Nombre del usuario
    email: (0, import_fields.text)({
      validation: { isRequired: true },
      isIndexed: "unique"
      // Para establecer el campo como único en la base de datos
    }),
    password: (0, import_fields.password)({ validation: { isRequired: true } }),
    // Contraseña
    role: (0, import_fields.select)({
      options: [
        { label: "Estudiante", value: "student" },
        { label: "Profesor", value: "teacher" },
        { label: "Administrador", value: "administrator" }
      ],
      defaultValue: "student",
      validation: { isRequired: true }
    }),
    studentID: (0, import_fields.text)(),
    // Solo para estudiantes, se puede dejar vacío
    imageURL: (0, import_fields.text)(),
    // URL de la imagen de perfil del usuario
    embeddings: (0, import_fields.text)()
    // Representación de la imagen en texto para comparación facial
  }
};

// Schema/Autentication.ts
var import_fields2 = require("@keystone-6/core/fields");
var import_access2 = require("@keystone-6/core/access");
var authentication = {
  access: import_access2.allowAll,
  fields: {
    tokenId: (0, import_fields2.text)({
      isIndexed: "unique",
      // Establece el campo como único
      validation: { isRequired: true }
      // Campo requerido
    }),
    associatedUser: (0, import_fields2.relationship)({
      ref: "User",
      // Referencia a la lista de usuarios
      many: false
      // Relación uno a uno
    }),
    expirationDate: (0, import_fields2.timestamp)({
      // No se establece un valor por defecto
    }),
    authenticationType: (0, import_fields2.select)({
      options: [
        { label: "JWT", value: "jwt" },
        { label: "Azure AD", value: "azure_ad" }
      ],
      validation: { isRequired: true }
      // Campo requerido
    }),
    adAuthenticationToken: (0, import_fields2.text)(),
    // Token de autenticación de Azure AD
    refreshToken: (0, import_fields2.text)()
    // Token de actualización
  }
};

// Schema/AzureADIntegration.ts
var import_fields3 = require("@keystone-6/core/fields");
var import_access3 = require("@keystone-6/core/access");
var azureADIntegration = {
  access: import_access3.allowAll,
  fields: {
    adUserId: (0, import_fields3.text)({
      isIndexed: "unique",
      // Establece el campo como único
      validation: { isRequired: true }
      // Campo requerido
    }),
    adTenantId: (0, import_fields3.text)({
      validation: { isRequired: true }
      // Campo requerido
    }),
    roleMapping: (0, import_fields3.text)(),
    // Mapeo de roles
    accessTokenValidity: (0, import_fields3.select)({
      options: [
        { label: "V\xE1lido", value: "true" },
        { label: "Inv\xE1lido", value: "false" }
      ],
      defaultValue: "true",
      ui: { displayMode: "segmented-control" }
    }),
    // Validez del token de acceso
    loginHistory: (0, import_fields3.text)(),
    // Historial de inicio de sesión
    user: (0, import_fields3.relationship)({
      ref: "User",
      // Referencia a la lista de usuarios
      many: false
    })
  }
};

// Schema/RecognitionLog.ts
var import_fields4 = require("@keystone-6/core/fields");
var import_access4 = require("@keystone-6/core/access");
var recognitionLog = {
  access: import_access4.allowAll,
  fields: {
    timestamp: (0, import_fields4.timestamp)({
      validation: { isRequired: true },
      defaultValue: { kind: "now" }
      // Configura la fecha actual por defecto
    }),
    success: (0, import_fields4.select)({
      options: [
        { label: "\xC9xito", value: "1" },
        { label: "Fallo", value: "0" }
      ],
      defaultValue: "0",
      ui: { displayMode: "segmented-control" }
    }),
    confidence: (0, import_fields4.float)({
      validation: { isRequired: true }
    }),
    imageURL: (0, import_fields4.text)(),
    // URL de la imagen capturada por la cámara
    errorDetails: (0, import_fields4.text)(),
    // Detalles del error en caso de falla
    user: (0, import_fields4.relationship)({
      ref: "User",
      // Referencia a la tabla user
      many: false,
      ui: { displayMode: "select" }
    })
  }
};

// Schema/Class.ts
var import_fields5 = require("@keystone-6/core/fields");
var import_access5 = require("@keystone-6/core/access");
var classSchema = {
  access: import_access5.allowAll,
  fields: {
    name: (0, import_fields5.text)({
      validation: { isRequired: true },
      ui: { displayMode: "input" }
    }),
    // Nombre de la clase
    description: (0, import_fields5.text)(),
    // Descripción de la clase
    schedule: (0, import_fields5.text)({ validation: { length: { max: 50 } } }),
    // Horario de la clase
    teacher: (0, import_fields5.relationship)({
      ref: "User",
      // Referencia a la tabla User
      many: false,
      ui: { displayMode: "select" }
    })
  }
};

// Schema/Attendance.ts
var import_fields6 = require("@keystone-6/core/fields");
var import_access6 = require("@keystone-6/core/access");
var attendance = {
  access: import_access6.allowAll,
  fields: {
    date: (0, import_fields6.timestamp)({
      validation: { isRequired: true },
      defaultValue: { kind: "now" }
      // Configura la fecha actual por defecto
    }),
    recognized: (0, import_fields6.select)({
      options: [
        { label: "Reconocido", value: "1" },
        { label: "No Reconocido", value: "0" }
      ],
      defaultValue: "0",
      ui: { displayMode: "segmented-control" }
    }),
    confidenceScore: (0, import_fields6.float)({
      validation: { isRequired: true }
    }),
    imageCapturedURL: (0, import_fields6.text)(),
    // URL de la imagen capturada
    user: (0, import_fields6.relationship)({
      ref: "User",
      // Referencia a la tabla User
      many: false,
      ui: { displayMode: "select" }
    }),
    class: (0, import_fields6.relationship)({
      ref: "Class",
      // Referencia a la tabla Class
      many: false,
      ui: { displayMode: "select" }
    })
  }
};

// Schema/FaceComparison.ts
var import_fields7 = require("@keystone-6/core/fields");
var import_access7 = require("@keystone-6/core/access");
var faceComparison = {
  access: import_access7.allowAll,
  fields: {
    comparisonDate: (0, import_fields7.timestamp)({
      defaultValue: { kind: "now" },
      // Fecha de comparación por defecto
      validation: { isRequired: true }
    }),
    imageCapturedURL: (0, import_fields7.text)(),
    // URL de la imagen capturada
    confidenceScore: (0, import_fields7.float)({
      validation: { isRequired: true }
      // Nivel de confianza
    }),
    comparisonResult: (0, import_fields7.select)({
      options: [
        { label: "Coincide", value: "1" },
        { label: "No coincide", value: "0" }
      ],
      defaultValue: "0",
      ui: { displayMode: "segmented-control" }
    }),
    attendance: (0, import_fields7.relationship)({
      ref: "Attendance",
      // Referencia a la lista de Attendance
      many: false
    })
  }
};

// Schema/AccessRecord.ts
var import_fields8 = require("@keystone-6/core/fields");
var import_access8 = require("@keystone-6/core/access");
var accessRecord = {
  access: import_access8.allowAll,
  fields: {
    title: (0, import_fields8.text)({
      validation: { isRequired: true },
      isIndexed: "unique"
      // Establece el campo como único en la base de datos
    }),
    accessType: (0, import_fields8.select)({
      options: [
        { label: "Residente", value: "resident" },
        { label: "Visitante", value: "visitor" },
        { label: "Proveedor de servicios", value: "service_provider" }
      ],
      validation: { isRequired: true }
      // Campo requerido
    }),
    entryDateTime: (0, import_fields8.timestamp)({
      validation: { isRequired: true },
      defaultValue: { kind: "now" }
      // Establece la fecha y hora actuales por defecto
    }),
    exitDateTime: (0, import_fields8.timestamp)(),
    // Puede ser NULL, así que no se establece un valor por defecto
    personAccessing: (0, import_fields8.relationship)({
      ref: "User",
      // Referencia a la tabla User
      many: false
    })
    // El campo authorizedBy ha sido eliminado como mencionaste.
  }
};

// Schema/Schema.ts
var lists = {
  User: user,
  Authentication: authentication,
  AzureADIntegration: azureADIntegration,
  RecognitionLog: recognitionLog,
  Class: classSchema,
  Attendance: attendance,
  FaceComparison: faceComparison,
  AccessRecord: accessRecord
};

// keystone.ts
var keystone_default = (0, import_core.config)({
  db: {
    provider: "sqlite",
    url: "file:./db/classtrack.db"
  },
  lists
  //session,
});
//# sourceMappingURL=config.js.map
