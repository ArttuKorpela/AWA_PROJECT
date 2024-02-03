const dotenv = require('dotenv');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const passport = require('passport');



dotenv.config();
const secret_key = process.env.SECRET;
if (!secret_key) {
    console.error("Fatal Error: SECRET is not set in .env file.");
    process.exit(1);
}

const passport_options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
}

passport.use(new JwtStrategy(passport_options, (jwt_payload, done) => {
    return done(null,{data: jwt_payload});
}))

module.exports = passport;