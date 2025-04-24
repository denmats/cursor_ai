import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { supabase } from '../../../../lib/supabaseClient'; // Import the Supabase client

const authOptions = {
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
            .select('github_id')
            .eq('github_id', profile.id)
            .maybeSingle(); // Use maybeSingle to return null if not found, instead of error

          if (fetchError) {
            console.error("Error fetching user from Supabase:", fetchError);
            return false; // Prevent sign-in on database error
          }

          // If user doesn't exist, create them
          if (!existingUser) {
            const newUser = {
              github_id: profile.id, // Use profile.id for GitHub ID
              name: user.name, // Use user.name from NextAuth
              email: user.email, // Use user.email from NextAuth
              image: user.image, // Use user.image from NextAuth
              // Add any other fields from profile or user as needed
            };

            const { error: insertError } = await supabase
              .from('users')
              .insert(newUser);

            if (insertError) {
              console.error("Error inserting user into Supabase:", insertError);
              return false; // Prevent sign-in if insert fails
            }
            console.log("New user created in Supabase:", newUser.email);
          } else {
            console.log("User already exists in Supabase:", user.email);
            // Optionally: Update existing user data here if needed
          }
        } catch (err) {
          console.error("Unexpected error during Supabase user check/insert:", err);
          return false; // Prevent sign-in on unexpected error
        }
      }

      // Return true to allow the sign-in process to continue
      // for GitHub provider after checks/inserts, or for other providers.
      return true;
    }
    // You can add other callbacks like jwt, session here if needed
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 