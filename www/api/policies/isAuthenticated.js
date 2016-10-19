module.exports = function (req, res, next) {

    var isAuthenticated = false;

    // If this is a socket.io request then:
    if (req.transport === 'socket.io') {
        // If we find a user in the session then:
        if (req.session &&
            req.session.passport &&
            req.session.passport.user) {

            // The user is authenticated.
            isAuthenticated = true;
        }
    } else {
        isAuthenticated = req.isAuthenticated();
    }

    if (isAuthenticated === true) {
        return next();
    }
    else {
        return res.redirect('/#!/security/login');
    }
};
