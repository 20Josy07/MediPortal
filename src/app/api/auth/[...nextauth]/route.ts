
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and refresh_token to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.userId = user.id;

        // Save tokens to Firestore
        const userDocRef = doc(db, 'users', user.id);
        const tokensToSave = {
          access_token: account.access_token,
          ...(account.refresh_token && { refresh_token: account.refresh_token }),
          scope: account.scope,
          token_type: account.token_type,
          expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
        };

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
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      (session.user as any).id = token.userId;
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
