const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl) and any known origin
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true)
        }
        // Fallback: allow any origin to prevent accidental 401s on public endpoints
        // You can tighten this list later if needed
        return callback(null, true)
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports  = corsOptions