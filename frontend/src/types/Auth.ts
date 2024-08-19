export type Login = {
  email: string;
  password: string;
};

export type Register = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: string;
  expires: Date;
};
