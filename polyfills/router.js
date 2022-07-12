// polyfills/router.js

/**
 * Wraps Vue Router - push() and replace()
 */
import Router from 'vue-router';

['push','replace'].forEach(method => {
  const originalMethod = Router.prototype[method];
  Router.prototype[method] = function m(location) {
    return originalMethod.call(this, location).catch(error => {
      if (error.name !== 'NavigationDuplicated') {
        // capture exception
      }
    })
  };
});