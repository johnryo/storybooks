const express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Story = mongoose.model('stories'),
User = mongoose.model('users'),
{ensureAuthenticated, ensureGuest} = require('../helpers/auth');

// Stories Index
router.get('/', (req, res) => {
  Story.find({status:'public'})
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });      
    });
});

// Show Single Story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .populate('user')
  .then(story => {
    res.render('stories/show', {
      story: story
    });
  });
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// Process Add Story
router.post('/', (req, res) => {
  let allowComments;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }

  // Create Story
  new Story(newStory)
    .save()
    .then(story => {
      res.redirect(`/stories/show/${story.id}`);
    });
});

module.exports = router;