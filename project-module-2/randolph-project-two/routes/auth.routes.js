const router = require('express').Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');

//GET home page


router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs');
});

router.post('/signup', (req, res, next) => {
  // console.log("The form data: ", req.body);
 
  const { username, email, password } = req.body;
 
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      console.log(`Password hash: ${hashedPassword}`);
      return User.create ({
        username,
        email,
        password: hashedPassword
      })
    })
    .then(createdUser => {
        console.log('Newly created user: ', createdUser);
        res.redirect('/dashboard');
    })
    .catch(error => next(error));
}); 

router.get('/login', (req, res, next) => {
  res.render('auth/login.hbs');
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
 
/*   if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  } */
 
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect ('/dashboard');     
      } else {
        //res.render('auth/login', { errorMessage: 'Incorrect password.' });
        res.send('try again')
      }
    })
    .catch(error => next(error));
});

/* router.get('/userProfile', (req, res) => {
  res.render('users/dashboard', { userInSession: req.session.currentUser });
});
 */
router.get('/dashboard', (req, res) => res.render('users/dashboard', { userInSession: req.session.currentUser }));

module.exports = router;