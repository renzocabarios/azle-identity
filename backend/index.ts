import { $query, $update, Opt, Record, Vec, Principal } from 'azle';

type User = Record<{
  id: string;
  principal: Principal;
  username: string;
  deleted: boolean;
}>;

type Db = {
  users: {
    [id: string]: User;
  };
};

let db: Db = {
  users: {},
};

$query;
export function getUserById(id: string): Opt<User> {
  const userOrUndefined = db.users[id];

  if (!userOrUndefined || userOrUndefined.deleted) return Opt.None;

  return Opt.Some(userOrUndefined);
}

$query;
export function getAllUsers(): Vec<User> {
  const temp = Object.values(db.users).filter((e: any) => !e.deleted);
  return temp;
}

$update;
export function createUser(principal: Principal, username: string): User {
  const id = Object.keys(db.users).length.toString();

  const user = {
    id,
    username,
    principal,
    deleted: false,
  };

  db.users[id] = user;

  return user;
}

$update;
export function updateUserById(id: string, username: string): Opt<User> {
  const user = db.users[id];

  if (!user || user.deleted) return Opt.None;

  user.username = username;
  return Opt.Some(user);
}

$update;
export function deleteUserById(id: string): Opt<User> {
  const user = db.users[id];
  if (!user || user.deleted) return Opt.None;

  user.deleted = true;
  return Opt.Some(user);
}
