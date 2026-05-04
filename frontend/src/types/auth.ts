export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at?: string;
  };
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
