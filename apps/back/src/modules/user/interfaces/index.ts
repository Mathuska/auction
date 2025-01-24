import { UserRole } from 'src/core/enums/UserRole';

export interface UserInterface {
  id: string;

  email: string;

  password: string;

  first_name: string;

  balance: number;

  last_name: string;

  role: UserRole;

  created_at: Date;

  updated_at: Date;

  deleted_at: Date;
}

export interface RegisterResponse {
  user: UserInterface;
  tokens: { refreshToken: string; accessToken: string };
}
