module.exports = function(app, passport) {

// normal routes ===============================================================


    // PROFILE SECTION =========================
    //app.get('/profile', isLoggedIn, function(req, res) {
        //res.render('profile.ejs', {
            //user : req.user
        //});
    //});

    //// LOGOUT ==============================
    //app.get('/logout', function(req, res) {
        //req.logout();
        //res.redirect('/');
    //});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

// locally --------------------------------
    // LOGIN ===============================
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // SIGNUP =================================
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // show the home page (will also have our login links)
    app.get('*', function(req, res) {
        res.sendfile('./dist/index.html');
    });



};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
