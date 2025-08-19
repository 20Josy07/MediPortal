
import { google } from 'googleapis';
import { db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const getGoogleAuthUrl = (state?: string) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
    state: state, // Pass the 'from' path in the state parameter
  });
};

export const getTokens = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const getCalendarService = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();

    if (!userData || !userData.googleTokens) {
        throw new Error('User not authenticated with Google or tokens are missing.');
    }

    oauth2Client.setCredentials(userData.googleTokens);

    // Check if the token is expired and refresh it if necessary
    if (userData.googleTokens.expiry_date && userData.googleTokens.expiry_date < Date.now()) {
        console.log('Access token expired, refreshing...');
        try {
            const { credentials } = await oauth2Client.refreshAccessToken();
            // Update the new tokens in Firestore
            await updateDoc(userDocRef, {
                googleTokens: credentials,
            });
            oauth2Client.setCredentials(credentials);
            console.log('Tokens refreshed and updated successfully.');
        } catch (error) {
            console.error('Error refreshing access token:', error);
            throw new Error('Could not refresh access token. Please re-authenticate.');
        }
    }

    return google.calendar({ version: 'v3', auth: oauth2Client });
};
