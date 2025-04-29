import GithubProvider from "next-auth/providers/github";
import { supabase } from './supabaseClient'; // Assuming supabaseClient is in lib

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
  secret: process.env.NEXTAUTH_SECRET, // Use the secret from .env.local
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // We only care about the GitHub provider for this logic
      if (account?.provider === 'github') {
        if (!profile?.id) {
          console.error("GitHub profile ID missing in callback");
          return false; // Prevent sign-in if ID is missing
        }

        try {
          // Check if user already exists based on GitHub ID
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id, github_id')
            .eq('github_id', profile.id)
            .maybeSingle(); // Use maybeSingle to return null if not found, instead of error

          if (fetchError) {
            console.error("Error fetching user from Supabase:", fetchError);
            return false; // Prevent sign-in on database error
          }

          // If user doesn't exist, create them
          if (!existingUser) {
            const { data: newUserInsert, error: insertError } = await supabase
              .from('users')
              .insert({
                github_id: profile.id,
                name: user.name,
                email: user.email,
                image: user.image,
              })
              .select('id') // Select the new user's ID
              .single(); // Get the newly inserted user object including ID

            if (insertError || !newUserInsert) {
              console.error("Error inserting user into Supabase:", insertError);
              return false; // Prevent sign-in if insert fails
            }
            // Attach the database ID to the user object for the session callback
            user.id = newUserInsert.id;
            console.log("New user created with DB ID:", user.id);
          } else {
            // Attach the existing database ID to the user object
            user.id = existingUser.id;
            console.log("Existing user found with DB ID:", user.id);
          }
        } catch (err) {
          console.error("Unexpected error during Supabase user check/insert:", err);
          return false; // Prevent sign-in on unexpected error
        }
      }

      // Return true to allow the sign-in process to continue
      // for GitHub provider after checks/inserts, or for other providers.
      return true;
    },

    // Add the jwt callback to include the DB ID in the token
    async jwt({ token, user, account, profile }) {
      // On initial sign in, persist the user ID obtained from the signIn callback
      if (account && user && user.id) {
        token.id = user.id;
        console.log("JWT callback: Attaching user ID to token:", token.id);
      }
      return token;
    },

    // **** ADD THIS SESSION CALLBACK ****
    async session({ session, token }) {
      // Send properties to the client (NextAuth.js session)
      // WARNING: Only expose necessary information client-side
      if (token && session.user) {
        session.user.id = token.id; // Add the user ID from the JWT token to the session object
        console.log("Session callback: Attaching user ID to session:", session.user.id);
      } else {
        console.log("Session callback: Token or session.user missing.");
      }
      return session; // Return the modified session object
    }
  }
};
