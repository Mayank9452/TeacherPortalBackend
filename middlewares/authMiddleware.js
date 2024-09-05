const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const Teacher = require('../models/Teacher');

// Ensure the secret key is fetched from environment variables
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,  // This should point to your environment variable
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const teacher = await Teacher.findById(jwt_payload.id);
      if (teacher) return done(null, teacher);
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);
