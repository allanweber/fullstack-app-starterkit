export type Login = {
  email: string;
  password: string;
};

export type Register = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: UserResponse;
  token: string;
};

export type UserResponse = {
  name: string;
  image: string;
};
