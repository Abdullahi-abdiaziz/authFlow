import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import jwt from "jsonwebtoken";

export const GoogleAuthStrategy = (passport) => {
  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        // Extract user info from profile
        const user = {
          email: profile.emails[0].value,
          name: profile.displayName,
          authType: "google",
          avatar: profile.photos[0].value,
        };

        // Generate JWT token
        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        // Pass the user and token explicitly
        return done(null, { user, token });
      }
    )
  );

  // GitHub Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        // Extract user info from profile

        const user = {
          email: profile.emails[0].value,
          name: profile.displayName,
          authType: "google",
          avatar: profile.photos[0].value,
        };

        // Generate JWT token
        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        // Pass the user and token explicitly
        return done(null, { user, token });
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export const GithubAuthStrategy = (passport) => {
  // Google Strategy

  // GitHub Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        // Extract user info from profile
        console.log(
          "Full GitHub profile object:",
          JSON.stringify(profile, null, 2)
        );

        const user = {
          email: profile.username,
          name: profile.displayName || "No name available",
          authType: "github",
          avatar:
            profile.photos && profile.photos.length > 0
              ? profile.photos[0].value
              : "No avatar available",
        };

        // Generate JWT token
        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        // Pass the user and token explicitly
        return done(null, { user, token });
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default { GithubAuthStrategy, GoogleAuthStrategy };

/**
 * Database connected sucessfully cluster0-shard-00-01.ybeba.mongodb.net
Extracting user info from Google profile:  {
  id: '100321946112775104130',
  displayName: 'Abdullahi Abdiaziz',
  name: { familyName: 'Abdiaziz', givenName: 'Abdullahi' },
  emails: [ { value: 'abdullahikawte2019@gmail.com', verified: true } ],
  photos: [
    {
      value: 'https://lh3.googleusercontent.com/a/ACg8ocIhtRmR52N-Kd88S1HRCK0-U5HZUeVjgtUjqaVkRu3HiiD5DKY=s96-c'
    }
  ],
  provider: 'google',
  _raw: '{\n' +
    '  "sub": "100321946112775104130",\n' +
    '  "name": "Abdullahi Abdiaziz",\n' +
    '  "given_name": "Abdullahi",\n' +
    '  "family_name": "Abdiaziz",\n' +
    '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocIhtRmR52N-Kd88S1HRCK0-U5HZUeVjgtUjqaVkRu3HiiD5DKY\\u003ds96-c",\n' +
    '  "email": "abdullahikawte2019@gmail.com",\n' +
    '  "email_verified": true\n' +
    '}',
  _json: {
    sub: '100321946112775104130',
    name: 'Abdullahi Abdiaziz',
    given_name: 'Abdullahi',
    family_name: 'Abdiaziz',
    picture: 'https://lh3.googleusercontent.com/a/ACg8ocIhtRmR52N-Kd88S1HRCK0-U5HZUeVjgtUjqaVkRu3HiiD5DKY=s96-c',
    email: 'abdullahikawte2019@gmail.com',
    email_verified: true
  }
 */
