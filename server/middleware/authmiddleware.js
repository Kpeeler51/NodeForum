import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT tokens
export const authenticateToken = (req, res, next) => {
    // Extract the Authorization header
    const authHeader = req.headers['authorization'];

    // Extract the token from the Authorization header
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is provided, return 401 Unauthorized
    if (token == null) {
        console.log('No token provided');
        return res.sendStatus(401);
    }

    try {
        // Verify the token using the JWT_SECRET
        // If verification is successful, it returns the decoded token payload
        const user = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user information to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        
        // If token verification fails, log the error and return 403 Forbidden
        console.error('JWT Verification Error:', err);
        return res.sendStatus(403);
    }
};