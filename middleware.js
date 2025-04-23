import { withAuth } from "next-auth/middleware"

// More on how NextAuth.js middleware works:
// https://next-auth.js.org/configuration/nextjs#middleware

// withAuth will automatically redirect users to the sign-in page
// if they are not authenticated when trying to access routes
// matched by the `config.matcher` below.
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // You can add custom logic here if needed based on the request or token.
    // For example, role-based access control.
    // console.log(req.nextauth.token)
  },
  {
    callbacks: {
      // This callback determines if the user is authorized.
      // Returning true allows the request to proceed.
      authorized: ({ token }) => !!token, // User is authorized if a token exists
    },
    // You can specify a custom login page if you have one
    // pages: {
    //   signIn: '/auth/signin',
    // }
  }
)

// This config specifies which routes the middleware should run on.
export const config = {
  matcher: [
    "/dashboards/:path*", // Protect the /dashboards route and any sub-paths
  ],
} 