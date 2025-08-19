
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
      // Este es el flujo para el inicio de sesión inicial.
      // Se persiste el token de acceso y el refresh token en el token JWT.
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.userId = user.id;

        // Guarda o actualiza los tokens en Firestore
        const userDocRef = doc(db, 'users', user.id);
        const tokensToSave = {
          access_token: account.access_token,
          // Solo actualiza el refresh_token si se proporciona uno nuevo
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
        return token;
      }
      
      // En las siguientes llamadas (para obtener la sesión), el token ya existe
      // y no es necesario modificarlo. Simplemente lo devolvemos.
      // Si no hacemos esto, devolvemos un objeto vacío y rompemos la sesión.
      return token;
    },
    async session({ session, token }) {
      // Pasa las propiedades del token JWT al objeto de sesión del cliente.
      // Nunca expongas el refreshToken al cliente.
      (session.user as any).id = token.userId;
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
