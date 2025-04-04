import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '../service/firebaseconfig';
import { onAuthStateChanged } from 'firebase/auth';

// Protected routes that require authentication
const protectedRoutes = [
  '/settings',
  "/success",
  "/summary",
  "/voicesummary",
  "/freevoicesummary"
];

// Public routes that authenticated users shouldn't see
const publicOnlyRoutes = [
  '/login',
  '/signup',
];

export function withPublicRouteProtection(Component) {
  return function WithPublicRouteProtection(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        
        if (currentUser) {
          router.push('/');
          // Optional: Use router.refresh() if you need to refresh the page data
          router.refresh();
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return !user ? <Component {...props} /> : null;
  };
}

export function withPrivateRouteProtection(Component) {
  return function WithPrivateRouteProtection(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        
        if (!currentUser) {
          router.push('/login');
          router.refresh();
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return user ? <Component {...props} /> : null;
  };
}

// Custom hook to check if current route is protected
export function useRouteProtection() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      
      if (user && publicOnlyRoutes.includes(pathname)) {
        router.push('/');
        router.refresh();
      } else if (!user && protectedRoutes.includes(pathname)) {
        router.push('/login');
        router.refresh();
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return { loading };
}