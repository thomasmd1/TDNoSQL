var router = require('express').Router();
var Person = require('../models/Person');

// Permet de créer une route qui map l'url "/" en GET
router.get('/', function(req, res) {
    // Permet de retrouver des résultats sur un modèle
    Person.find({}).then(function(persons) {
        // Permet d'afficher une vue et de lui passer des paramètres
        res.render('home.ejs', { persons: persons});
    });

});

// Permet de créer une route qui map l'url "/hello" en GET
router.get('/hello', function(req, res) {
    var p = new Person({
        firstname: 'Ted',
        lastname: 'Mosby',
        age: 10
    });

    // Permet d'insérer une nouvelle donnée
    p.save().then(function(personSaved){
        res.render('hello.ejs', personSaved);
    });
});

router.get('/add', function(req, res) {
    res.render('add.ejs');
});

router.post('/add', function(req, res) {
    res.redirect('/add');
});

router.get('/stats', function(req, res){
  Person.find({
    $and:[
     {age: {$gt: 20, $lt: 40}},
     { gender: 'male'},
      $or: [
        { company: 'Facebook'},
        { company: 'Instagram'} ]
    ]}).then(function(personTest){
    res.render('stats.ejs', { personTest: personTest});
  });
});

module.exports = router;
