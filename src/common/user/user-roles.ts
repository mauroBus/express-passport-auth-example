
export type UserRolesType = 'admin' | 'user'

export const UserRoles: {
  [K in UserRolesType]: UserRolesType
} = {
  admin: 'admin',
  user: 'user',
}
