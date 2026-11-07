import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '@/lib/keycloak';

export interface AuthUserInfo {
  id?: number;
  username: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isAdmin: boolean;
  user: AuthUserInfo | null;
  token?: string;
  login: (options?: { redirectUri?: string }) => Promise<void>;
  register: (options?: { redirectUri?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUserInfo | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        if (!isMounted) return;
        setIsAuthenticated(authenticated);

        if (authenticated && keycloak.tokenParsed) {
          const parsed = keycloak.tokenParsed;
          const realmRoles: string[] = parsed.realm_access?.roles || [];
          const hasAdminRole = realmRoles.includes('ADMIN');
          setIsAdmin(hasAdminRole);

          const userInfo: AuthUserInfo = {
            username: (parsed.preferred_username as string) || '',
            email: parsed.email as string | undefined,
            name: (parsed.name as string) || (parsed.preferred_username as string) || '',
            firstName: parsed.given_name as string | undefined,
            lastName: parsed.family_name as string | undefined,
            roles: realmRoles,
          };
          setUser(userInfo);
        } else {
          setIsAdmin(false);
          setUser(null);
        }
        setIsInitialized(true);
      })
      .catch((error) => {
        console.error('Failed to initialize Keycloak', error);
        if (isMounted) {
          setIsInitialized(true);
        }
      });

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => {
        console.warn('Token expired and refresh failed');
      });
    };

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (options?: { redirectUri?: string }) => {
    const redirect = options?.redirectUri || window.location.href;
    await keycloak.login({ redirectUri: redirect });
  };

  const register = async (options?: { redirectUri?: string }) => {
    const redirect = options?.redirectUri || window.location.href;
    await keycloak.register({ redirectUri: redirect });
  };

  const logout = async () => {
    await keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        isAdmin,
        user,
        token: keycloak.token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

