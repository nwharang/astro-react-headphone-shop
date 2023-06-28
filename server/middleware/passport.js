/* eslint-disable no-undef */
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import bcrypt from "bcrypt";
import expressSession from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { z } from "zod";
import PrismaAdapter from "../model/user.js";
import prisma from "../utils/connectDB.js";
import { reCaptchaVerify } from "../utils/reCaptchaVerify.js";

export const Passport = (app) => {
  app.use(
    expressSession({
      cookie: {
        // Sessions expire should after 30 days of being idle by default
        maxAge: 24 * 60 * 60 * 1000, // ms // for testing purposes
      },
      secret: ["secretstuff", "notsosecretstuff"],
      resave: true,
      saveUninitialized: false,
      rolling: true,
      store: new PrismaSessionStore(prisma, {
        checkPeriod: 24 * 60 * 60 * 1000, //ms
        dbRecordIdIsSessionId: false,
        dbRecordIdFunction: undefined,
      }),
    })
  );

  // Define Local credentials
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const userSchema = z.object({
          email: z.string().email(),
          password: z
            .string()
            .regex(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-=\[\]])[A-Za-z\d@$!%*?&-=\[\]]{8,32}$/
            ),
        });
        try {
          userSchema.parse({ email, password });
          if (req.body.gReCaptchaToken != "Tester") {
            let verifyToken = await reCaptchaVerify(req.body.gReCaptchaToken);
            if (verifyToken.status != "success" || req.user) {
              return done(null, false);
            }
          }
          let user = await PrismaAdapter(prisma).getUserByEmail(email);
          if (user) {
            // Return acount in user that has credentials provider
            let credentials = user.accounts.find(
              (account) => account.provider === "credential"
            );
            // If no credentials found just return null , this will reduce the time spend on hash
            if (credentials?.password)
              if (await bcrypt.compare(password, credentials.password))
                return done(null, user.id);
            return done(null, false);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(null, false);
        }
      }
    )
  );
  // Define Google credentials
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"],
        state: true,
      },
      async (accessToken, refreshToken, profile, cb) => {
        // find the user by profile id from google account
        let found = false;
        let user = await PrismaAdapter(prisma).getUserByAccount({
          provider: "google",
          providerAccountId: profile.id,
        });
        // found user with google account
        if (user) found = true;
        // if user not found and user credentials found , create a new one account with type & provider "google"
        if (!user)
          user = await PrismaAdapter(prisma).getUserByEmail(
            profile.emails[0].value
          );

        try {
          // handle found credentials user account but not have google account
          if (user && !found)
            await PrismaAdapter(prisma).updateUser({
              id: user.id,
              accounts: {
                create: {
                  type: "oauth",
                  provider: profile.provider,
                  providerAccountId: profile.id,
                  access_token: accessToken,
                  refresh_token: refreshToken,
                },
              },
            });
          // handle not found google account and credentials
          if (!user) {
            user = await PrismaAdapter(prisma).createUser({
              email: profile.emails[0].value,
              name: profile.displayName,
              image: profile.photos[0].value,
              accounts: {
                create: {
                  type: "oauth",
                  provider: profile.provider,
                  providerAccountId: profile.id,
                  access_token: accessToken,
                  refresh_token: refreshToken,
                },
              },
            });
            return cb(null, user.id);
          } else {
            return cb(null, user.id);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  // https://stackoverflow.com/a/27637668/19764071
  passport.serializeUser(function (user, done) {
    process.nextTick(function () {
      done(null, user);
    });
  });

  passport.deserializeUser(function (user, done) {
    process.nextTick(function () {
      // <==== Passport doc use nextTick , don't know what it does
      done(null, user);
    });
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.get(
    "/login/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    })
  );
  app.post("/login", passport.authenticate("local"), function (req, res) {
    res.status(200).send({
      error: false,
      message: "success",
    });
  });

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );
  app.post("/logout", async (req, res, next) => {
    await req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
};
// https://www.youtube.com/watch?v=KMtPfRYWmjU&t=16s check it out
