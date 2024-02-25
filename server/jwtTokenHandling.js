function decodeToken(token) {
    const payload = token.split('.')[1]; // Get the payload
    const decoded = atob(payload);
    return JSON.parse(decoded);
}

function getHeader(authHeader) {
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token from the Authorization header
        // 'Bearer ' length is 7, so we slice from the 7th character to the end
        return  authHeader.slice(7, authHeader.length);
    } else {
        throw new Error("Error with bearer tokens in matches");
    }
}
module.exports = { decodeToken, getHeader };
