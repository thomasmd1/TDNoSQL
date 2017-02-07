var router = require('express').Router();
var fs = require('fs');
var Person = require('../models/Person');

// Permet de créer une route qui map l'url "/" en GET
router.get('/page/:page', function(req, res) {
  if(!req.params.page){
    next()
  }
    Person.find({}).then(function(persons) {
      var currentPage=parseInt(req.params.page);
      var nbPage = persons.length/100;
      var min,limit,pageMin,pageMax;

      pageMin = currentPage-5;
      pageMax= currentPage+5;

      if(currentPage<=0){
        currentPage=1;
      }
      min=currentPage*100-100;
      limit=100;

      Person.find({}).skip(min).limit(limit).then(function(p) {
          // Permet d'afficher une vue et de lui passer des paramètre
          res.render('home.ejs', { persons: p, pages: nbPage, current: currentPage, pmi: pageMin, pma: pageMax});
      });
    });
});

router.get('/', function(req, res) {
  Person.find({}).then(function(persons) {
    var nbPage = persons.length/100;
    var currentPage=parseInt(1);
    var min,limit;

    if(currentPage<=0){
      currentPage=1;
    }
    min=currentPage*100-100;
    limit=100;

    Person.find({}).skip(min).limit(limit).then(function(p) {
      // Permet d'afficher une vue et de lui passer des paramètre
      res.render('home.ejs', { persons: p, pages: nbPage, current: currentPage});
    });
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

router.get('/loadData', function(req, res) {
  fs.readFile('./data/persons.csv', 'utf-8', function(err, data) {
      if (err) throw err;

      var lines = data.trim().split('\n');

      for (var i = 1; i < lines.length; i++) {
        var item = lines[i].split(',');
        var p = new Person({
          firstname: item[0],
          lastname: item[1],
          age: item[3],
          gender: item[2],
          company: item[4],
          departement: item[5],
          email: item[6],
          city: item[7],
          country: item[8],
          ip_address: item[9]
        })

        p.save().then(function(personSaved){
            console.log("Person add" + personSaved);
        });
      }
  });
    //res.render('home.ejs');
    res.redirect('/');
});

router.get('/add', function(req, res) {
    res.render('add.ejs');
});

router.post('/add', function(req, res) {
    var p = new Person({
        firstname: req.body.user.firstname,
        lastname: req.body.user.lastname,
        age: req.body.user.age
    });

    // Insère une personne avec les paramètres du formulaire
    p.save().then(function(personSaved){
        res.render('hello.ejs', personSaved);
    });
});

router.get('/stats', function(req, res){
  var firstFilter;
  Person.find({
      $and: [{"gender": "Male"},{"age": {$gte: 20,$lte: 40}},{$or: [{"company": "Gigazoom"},{"company": "DabZ"}]}]
    }).then(function(personTest){


      Person.find({
        $and: [{"gender": "Female"}, {"company": "Twimbo"}] })
        .sort({"age" : -1}).limit(1).then(function(personTest2){

          res.render('stats.ejs', { personTest: personTest, p2: personTest2});
      });
  });
});


module.exports = router;
