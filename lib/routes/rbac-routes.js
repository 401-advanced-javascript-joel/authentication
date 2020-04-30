'use strict';

const express = require('express');

const auth = require('../middleware/auth');
const caps = require('../middleware/access-control');

const router = new express.Router();

/**
 * This route is for the public page
 * @route get /public
 * @group roles
 * @returns {object} 200 - This is a public page
 */
router.get('/public', async (req, res, next) => {
  res.send('This is a public page');
});

/**
 * This route is for the private page
 * @route get /private
 * @group roles
 * @returns {object} 200 - This is a private page
 */
router.get('/private', auth, async (req, res, next) => {
  res.send('This is a private page');
});

/**
 * This route is used to read content
 * @route get /readonly
 * @group roles
 * @returns {object} 200 - You can read this content
 */
router.get('/readonly', auth, caps(['read']), async (req, res, next) => {
  res.send('You can read this content');
});

/**
 * This route is used to create content
 * @route post /create
 * @group roles
 * @returns {object} 200 - You can create content
 */
router.post('/create', auth, caps(['create']), async (req, res, next) => {
  res.send('You can create content');
});

/**
 * This route is used to update content
 * @route put /update
 * @group roles
 * @returns {object} 200 - You can update content
 */
router.put('/update', auth, caps(['update']), async (req, res, next) => {
  res.send('You can update content');
});

/**
 * This route is used to delete content
 * @route delete /delete
 * @group roles
 * @returns {object} 200 - You can delete content
 */
router.delete('/delete', auth, caps(['delete']), async (req, res, next) => {
  res.send('You can delete content');
});

/**
 * This route is used by a super user!
 * @route get /public
 * @group roles
 * @returns {object} 200 - You’re a super user!
 */
router.get(
  '/everything',
  auth,
  caps(['read', 'create', 'update', 'delete']),
  async (req, res, next) => {
    res.send('You’re a super user!');
  },
);

module.exports = router;
