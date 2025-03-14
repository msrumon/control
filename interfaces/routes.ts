export interface GetSigninRoute {
  Querystring: { readonly next: string };
}

export interface PostSigninRoute extends GetSigninRoute {
  Body: {
    readonly _csrf: string;
    readonly username: string;
    readonly password: string;
  };
}

export interface GetAuthorizeRoute {
  Querystring: {
    readonly response_type: string;
    readonly client_id: string;
    readonly redirect_uri: string;
    readonly scope: string;
    readonly state?: string;
  };
}

export interface PostAuthorizeRoute extends GetAuthorizeRoute {
  Body: { readonly _csrf: string; readonly consent: 'no' | 'yes' };
}

export interface AuthGenericRoute {
  Header: { readonly Authorization: string };
}

export interface PostTokenRoute {
  Body: {
    readonly code: string;
    readonly client_id: string;
    readonly redirect_uri: string;
    readonly state?: string;
  };
}

export interface PostIntrospectRoute extends AuthGenericRoute {
  Body: { readonly token: string };
}
