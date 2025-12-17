import { init, id, tx, type InstaQLEntity } from '@instantdb/react';
import schema, { type AppSchema } from '../../instant.schema';

const APP_ID = '1c8c6446-39cc-429c-83c9-0d1b76fd06ca';

export const db = init<AppSchema>({ appId: APP_ID, schema, devtool: false });

export { id, tx };

// Type exports for entities
export type User = InstaQLEntity<AppSchema, 'users'>;
export type Group = InstaQLEntity<AppSchema, 'groups'>;
export type Expense = InstaQLEntity<AppSchema, 'expenses'>;
export type Settlement = InstaQLEntity<AppSchema, 'settlements'>;
