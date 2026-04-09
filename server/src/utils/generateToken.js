import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // MUST be true for cross-site cookies
        sameSite: 'none', // Allow cross-site cookies from Vercel to Render
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

export default generateToken;
