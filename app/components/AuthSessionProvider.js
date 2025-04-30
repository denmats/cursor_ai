'use client'; // This directive marks it as a Client Component

import { SessionProvider } from 'next-auth/react';

// Define a type for the props if using TypeScript, otherwise just use props
// type Props = {
//   children?: React.ReactNode;
// };

// export default function AuthSessionProvider({ children }: Props) {
export default function AuthSessionProvider({ children }) { // Simpler JS version
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
