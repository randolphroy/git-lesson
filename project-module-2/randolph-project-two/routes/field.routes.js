const router = require("express").Router();
const Fields = require('../models/field.model');


router.get('/fields', (req, res, next) => {

    Fields.find()
    .then (allFields => { 
      console.log (allFields);
      res.render('fields/fields.hbs', { allFields });
    })
    .catch (err => {
      console.log(err);
    });
});

router.get('/fields/create', (req, res, next) => {
  res.redirect('fields/create.hbs');
});


module.exports = router;