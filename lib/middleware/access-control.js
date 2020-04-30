'use strict';

// Hard coded capabilities here (lazy)
let roles = {
  user: ['read'],
  editor: ['read', 'create', 'update'],
  admin: ['read', 'create', 'update', 'delete'],
};

const caps = (capabilities) => {
  return (req, res, next) => {
    capabilities.forEach((capability) => {
      if (!roles[req.user.role].includes(capability)) {
        return next({
          status: 403,
          message: 'You lack the permissions to view this page.',
        });
      }
    });
    return next();
  };
};

module.exports = caps;
