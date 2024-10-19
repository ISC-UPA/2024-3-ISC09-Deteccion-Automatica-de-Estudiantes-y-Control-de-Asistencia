import { type Lists } from '.keystone/types';
import { user } from './User';
import { authentication } from './Autentication';
import { azureADIntegration } from './AzureADIntegration';
import { student } from './Student';

export const lists = {
    User: user,
    Authentication: authentication,
    AzureADIntegration: azureADIntegration,
    Student: student,
}