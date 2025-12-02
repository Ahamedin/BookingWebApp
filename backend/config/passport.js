import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import prisma from "../utilities/connectpsql.js";

dotenv.config();

const ADMIN_GOOGLE_ID = "116032232040156384457";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      
    },
   
    async function(accessToken, refreshToken, profile, done) {
      console.log(profile)
       try {

        const email = profile.emails[0].value;
        const googleid = profile.id;
        const photo = profile.photos?.[0]?.value
        
        if (!email) {
          console.error("Google profile did not return an email.");
          return done(new Error("Email not found in Google profile"), null);
        }

        let users = await prisma.users.findUnique({ where: { googleid } });

        if (!users) {
          users = await prisma.users.create({
            data: {
              email,
              password: "",
              googleid
            },
          });
        }

        const isAdmin = googleid === ADMIN_GOOGLE_ID;

        return done(null, {...users, photo ,isAdmin} );

       } catch (error) {
          console.error("Error in store DB", error);
          return done(error, null);
       }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  try {
    const dbUser = await prisma.users.findUnique({
      where: { googleid: user.googleid }
    });

    if (!dbUser) return done(null, null);

    // Attach dynamic fields (NOT stored in DB)
    dbUser.photo = user.photo;
    dbUser.isAdmin = user.isAdmin;

    done(null, dbUser);

  } catch (err) {
    done(err, null);
  }
});

export default passport;
