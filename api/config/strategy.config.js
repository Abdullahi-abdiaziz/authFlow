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
  // passport.use(
  //   new GoogleStrategy(
  //     {
  //       clientID: process.env.GOOGLE_CLIENT_ID,
  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //       callbackURL: "/api/auth/google/callback",
  //     },
  //     (accessToken, refreshToken, profile, done) => {
  //       // Extract user info from profile

  //       const user = {
  //         email: profile.emails[0].value,
  //         name: profile.displayName,
  //         authType: "google",
  //         avatar: profile.photos[0].value,
  //       };

  //       // Generate JWT token
  //       const token = jwt.sign({ user }, process.env.JWT_SECRET, {
  //         expiresIn: "7d",
  //       });

  //       // Pass the user and token explicitly
  //       return done(null, { user, token });
  //     }
  //   )
  // );
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
