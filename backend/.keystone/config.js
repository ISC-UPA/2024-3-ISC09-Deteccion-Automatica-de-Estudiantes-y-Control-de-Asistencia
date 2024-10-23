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
    fullName: (0, import_fields.text)({ validation: { isRequired: true } }),
    email: (0, import_fields.text)({ validation: { isRequired: true } }),
    phoneNumber: (0, import_fields.text)({ validation: { isRequired: true } }),
    userRole: (0, import_fields.select)({
      options: [
        { label: "Admin", value: "admin" },
        { label: "Docent", value: "Docent" },
        { label: "Student", value: "Student" }
      ],
      defaultValue: "Student"
    }),
    profilePicture: (0, import_fields.text)(),
    accountStatus: (0, import_fields.select)({
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Suspended", value: "suspended" }
      ],
      defaultValue: "active"
    }),
    adAuthenticationStatus: (0, import_fields.checkbox)()
  }
};

// Schema/Autentication.ts
var import_access2 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var authentication = {
  access: import_access2.allowAll,
  fields: {
    tokenId: (0, import_fields2.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
    associatedUser: (0, import_fields2.relationship)({ ref: "User" }),
    expirationDate: (0, import_fields2.timestamp)(),
    authenticationType: (0, import_fields2.select)({
      options: [
        { label: "JWT", value: "jwt" },
        { label: "Azure AD", value: "azure_ad" }
      ]
    }),
    adAuthenticationToken: (0, import_fields2.text)(),
    refreshToken: (0, import_fields2.text)()
  }
};

// Schema/AzureADIntegration.ts
var import_access3 = require("@keystone-6/core/access");
var import_fields3 = require("@keystone-6/core/fields");
var azureADIntegration = {
  access: import_access3.allowAll,
  fields: {
    adUserId: (0, import_fields3.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
    adTenantId: (0, import_fields3.text)({ validation: { isRequired: true } }),
    roleMapping: (0, import_fields3.text)(),
    accessTokenValidity: (0, import_fields3.checkbox)(),
    loginHistory: (0, import_fields3.text)()
  }
};

// Schema/Student.ts
var import_access4 = require("@keystone-6/core/access");
var import_fields4 = require("@keystone-6/core/fields");
var student = {
  access: import_access4.allowAll,
  fields: {
    name: (0, import_fields4.text)({ validation: { isRequired: true } }),
    email: (0, import_fields4.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
    street: (0, import_fields4.text)({ validation: { isRequired: true } }),
    number: (0, import_fields4.text)({ validation: { isRequired: true } })
  }
};

// Schema/Schema.ts
var lists = {
  User: user,
  Authentication: authentication,
  AzureADIntegration: azureADIntegration,
  Student: student
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
