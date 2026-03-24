import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const handler = NextAuth({
  providers: [
    // --- Email/Password login ---
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.detail || "Login failed");
          }

          // Return user object — this gets stored in the JWT token
          return {
            id: data.userId,
            name: data.fullname,
            email: credentials.email,
            role: data.role,
          };
        } catch (err) {
          throw new Error(err.message || "Invalid credentials");
        }
      },
    }),

    // --- Google OAuth ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,  // 7 days — user stays logged in for a week
  },

  callbacks: {
    // Called after login — persist extra fields into the JWT
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role || "farmer";
      }

      // For Google OAuth — sync with backend to get/create user record
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${API_URL}/auth/oauth-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: token.email,
              fullname: token.name,
              provider: "google",
            }),
          });
          const data = await res.json();
          if (res.ok) {
            token.userId = data.userId;
            token.role = data.role || "farmer";
          }
        } catch (err) {
          console.error("[NextAuth] OAuth backend sync failed:", err);
        }
      }

      return token;
    },

    // Called on every session check — expose fields to the client
    async session({ session, token }) {
      session.user.id = token.userId;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/signin",       // Custom sign-in page
    error: "/signin",        // Redirect auth errors to sign-in
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };