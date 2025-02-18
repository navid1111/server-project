import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import User from '../models/user';
dotenv.config();
// Your GitHub OAuth app credentials
const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID as string;
const GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_SECRET as string;
const CALLBACK_URL = 'http://localhost:8000/auth/github/callback';

// Passport serialization
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// GitHub strategy configuration
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      scope: ['read:org', 'repo'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      cb: (error: any, user?: any) => void,
    ) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // Create new user if doesn't exist
          user = await User.create({
            githubId: profile.id,
            displayName: profile.displayName,
            username: profile.username,
            profileUrl: profile.profileUrl,
            photos: profile.photos,
            email: profile.emails?.[0]?.value,
            provider: 'github',
          });
        }

        return cb(null, user);
      } catch (err) {
        return cb(err, null);
      }
    },
  ),
);

export default passport;
