
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export const dynamic = "force-dynamic";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, user }) {
      // On initial sign-in, persist the OAuth tokens.
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.userId = user.id;

        const userDocRef = doc(db, 'users', user.id);
        const tokensToSave: any = {
          access_token: account.access_token,
          scope: account.scope,
          token_type: account.token_type,
          expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
        };

        // The refresh_token is only sent on the first authorization.
        // We only want to save it if it exists to avoid overwriting it with undefined.
        if (account.refresh_token) {
          tokensToSave.refresh_token = account.refresh_token;
        }

        const docSnap = await getDoc(userDocRef);
        if(!docSnap.exists()) {
            await setDoc(userDocRef, {
                fullName: user.name,
                email: user.email,
                photoURL: user.image,
                googleTokens: tokensToSave,
                createdAt: serverTimestamp(),
            }, { merge: true });
        } else {
             await setDoc(userDocRef, {
                googleTokens: tokensToSave,
            }, { merge: true });
        }
      }
      
      // Return the token, which will be used in the session callback
      return token;
    },
    async session({ session, token }) {
      // Pass safe properties to the client-side session object
      if (session.user) {
        (session.user as any).id = token.userId;
      }
      (session as any).accessToken = token.accessToken;
      
      return session;
    },
  },
});

export { handler as GET, handler as POST };
