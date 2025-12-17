import { i } from '@instantdb/react';

const _schema = i.schema({
  entities: {
    users: i.entity({
      username: i.string().unique().indexed(),
      pin: i.string(),
      displayName: i.string(),
      avatarColor: i.string(),
      isAdmin: i.boolean(),
      createdAt: i.number(),
    }),
    groups: i.entity({
      name: i.string(),
      description: i.string(),
      currency: i.string(),
      emoji: i.string(),
      createdAt: i.number(),
    }),
    expenses: i.entity({
      description: i.string(),
      amount: i.number(),
      category: i.string(),
      splitType: i.string(), // 'equal' | 'exact' | 'percentage'
      splitDetails: i.json(), // { [userId]: amount | percentage }
      date: i.number(),
      createdAt: i.number(),
    }),
    settlements: i.entity({
      amount: i.number(),
      date: i.number(),
      note: i.string(),
      createdAt: i.number(),
    }),
  },
  links: {
    // Group members
    groupMembers: {
      forward: { on: 'groups', has: 'many', label: 'members' },
      reverse: { on: 'users', has: 'many', label: 'memberGroups' },
    },
    // Group creator
    groupCreator: {
      forward: { on: 'groups', has: 'one', label: 'createdBy' },
      reverse: { on: 'users', has: 'many', label: 'createdGroups' },
    },
    // Expense belongs to group
    expenseGroup: {
      forward: { on: 'expenses', has: 'one', label: 'group' },
      reverse: { on: 'groups', has: 'many', label: 'expenses' },
    },
    // Who paid for the expense
    expensePaidBy: {
      forward: { on: 'expenses', has: 'one', label: 'paidBy' },
      reverse: { on: 'users', has: 'many', label: 'paidExpenses' },
    },
    // Who is involved in the expense split
    expenseSplitWith: {
      forward: { on: 'expenses', has: 'many', label: 'splitWith' },
      reverse: { on: 'users', has: 'many', label: 'splitExpenses' },
    },
    // Settlement from user
    settlementFrom: {
      forward: { on: 'settlements', has: 'one', label: 'fromUser' },
      reverse: { on: 'users', has: 'many', label: 'settlementsPaid' },
    },
    // Settlement to user
    settlementTo: {
      forward: { on: 'settlements', has: 'one', label: 'toUser' },
      reverse: { on: 'users', has: 'many', label: 'settlementsReceived' },
    },
    // Settlement belongs to group
    settlementGroup: {
      forward: { on: 'settlements', has: 'one', label: 'group' },
      reverse: { on: 'groups', has: 'many', label: 'settlements' },
    },
  },
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
