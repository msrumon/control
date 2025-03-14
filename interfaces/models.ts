export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  secret?: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Uri {
  id: string;
  link: string;
  client_id: string;
  created_at: string;
  updated_at: string;
}

export interface Code {
  id: string;
  code: string;
  uri_id: string;
  user_id: string;
  scopes: string;
  state?: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}
