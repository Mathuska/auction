import { UserRole } from 'src/core/enums/UserRole';
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'user_view',
  expression: `
    SELECT DISTINCT ON (data->>'id') 
        data->>'id' AS id,
        data->>'email' AS email,
        data->>'password' AS password,
        data->>'first_name' AS first_name,
        data->>'last_name' AS last_name,
        data->>'balance' AS balance,
        data->>'role' AS role,
        data->>'updated_at' AS updated_at,
        data->>'created_at' AS created_at,
        data->>'deleted_at' AS deleted_at
    FROM events
    WHERE aggregation_type = 'user'
    ORDER BY data->>'id', data->>'updated_at' DESC;
  `,
})
export class UserView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  password: string;

  @ViewColumn()
  first_name: string;

  @ViewColumn()
  last_name: string;

  @ViewColumn()
  balance: number;

  @ViewColumn()
  role: UserRole;

  @ViewColumn()
  created_at: Date;

  @ViewColumn()
  updated_at: Date;

  @ViewColumn()
  deleted_at: Date;
}
