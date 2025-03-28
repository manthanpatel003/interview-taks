interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  hashedPassword: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IApiResponse {
  message: string;
  user: User;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
export interface IRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
