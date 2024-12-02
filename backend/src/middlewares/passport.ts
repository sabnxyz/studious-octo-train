import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Express } from "express";
import { DataSource } from "typeorm";
import { SessionEntity, UserEntity } from "../entity";
import session from "express-session";
import { TypeormStore } from "connect-typeorm";

export const Passport = (app: Express, datasource: DataSource) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production" ? true : false, // Set to true if using HTTPS
        httpOnly: true,
        sameSite: "lax", // or 'none' if using HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
      store: new TypeormStore({
        cleanupLimit: 2,
        ttl: 24 * 60 * 60,
      }).connect(datasource.getRepository(SessionEntity)),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_AUTH_CLIENT_ID,
        clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/api/auth/github/callback",
      },
      function (
        accessToken: string,
        refreshToken: string | undefined,
        profile: Record<string, any>,
        done: Function
      ) {
        process.nextTick(async function () {
          const userRepository = datasource.getRepository(UserEntity);

          let user = await userRepository.findOne({
            where: {
              github_id: profile.id,
            },
          });

          if (!user) {
            user = await userRepository.save({
              github_id: profile.id,
              name: profile.username,
              profile_image: profile._json.avatar_url,
              email: profile._json.email,
            });
          }

          return done(null, {
            id: user.id,
            name: profile.username,
            profile_image: profile._json.avatar_url,
            email: profile._json.email,
            github_id: profile.id,
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  return passport;
};
