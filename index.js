
'use strict';

/**
 * Module dependencies.
 * @private
 */
 const _ = require('lodash'),
  got = require('got');


/**
 * Globals
 * @private
 */
var INSTANCE, OPTS;

const ENDPOINTS = {
  token: 'https://www.googleapis.com/oauth2/v3/token',
  contacts: 'https://www.google.com/m8/feeds/contacts/default/thin'
};

// Used by Clients for Auth Dialog
const SCOPES = [
  'https://www.googleapis.com/auth/contacts.readonly'
];


/**
 * @params {String} opts.id (Required)
 * @params {String} opts.secret (Required)
 * @params {String} opts.redirect_uri
 * @public
 */
function Client(opts) {

  if (! (opts && opts.id && opts.secret))
    throw new Error('id and secret is required.');

  opts.redirect_uri = opts.redirect_uri ||
                      'http://localhost:5000';

  OPTS = opts;
  INSTANCE = this;
  return this;
};


Client.prototype = {

  /**
   * @params {String} opts.authCode
   * @params {String} opts.token
   *
   * @public
   */
  getAccessToken: opts => {

    return new Promise((resolve, reject) => {

      if (! (opts.token || opts.authCode)) {
        return reject(new Error('token or authCode is required'));
      }

      if (opts.token) {
        var query = {
          client_id: OPTS.id,
          client_secret: OPTS.secret,
          refresh_token: opts.token,
          grant_type: 'refresh_token'
        };
      }

      else {
        var query = {
          client_id: OPTS.id,
          client_secret: OPTS.secret,
          redirect_uri: OPTS.redirect_uri,
          code: opts.authCode,
          grant_type: 'authorization_code'
        };
      }

      got.post(ENDPOINTS.token, {
        retries: 1,
        json: true,
        body: query,
      }, (err, res) => {

        if (err) {
          if (err.statusCode === 400)
            return resolve({
              isValid: false,
              error: res.error_description
            });

          return reject(err);
        }

        if (res && res.access_token) {
          return resolve({
            token: res.access_token,
            expires: new Date(Date.now() + res.expires_in * 1000),
            isValid: true
          })
        }

        return resolve({ isValid: false });
      });

    });
  },

  /**
   * @params {String} token (Required)
   *
   * @public
   */
  getContacts: function(token) {

    return new Promise((resolve, reject) => {

      if (! token) {
        return reject(new Error('token is required'));
      }

      got(ENDPOINTS.contacts, {
        retries: 1,
        json: true,
        query: {
          alt: 'json',
          'max-results': 100//5000,
        },
        headers: {
          'Gdata-version': '3.0',
          Authorization: `Bearer ${token}`
        }
      }, (err, res, fullRes) => {

        if (fullRes.statusCode === 401) {
          return reject(new Error('Authorization error'));
        }

        if (err) {
          if (err.statusCode === 400)
            return resolve([]);

          return reject(err);
        }

        const Results = [];

        if (res &&
            res.feed &&
            res.feed.entry) {

          _.forEach(res.feed.entry, i => {

            var data = {};

            if (i['gd$name']) {

              if (i['gd$name']['gd$givenName'] &&
                  i['gd$name']['gd$givenName']['$t']) {
                data.first_name = i['gd$name']['gd$givenName']['$t']
              }

              if (i['gd$name']['gd$familyName'] &&
                  i['gd$name']['gd$familyName']['$t']) {
                data.last_name = i['gd$name']['gd$familyName']['$t']
              }
            }

            if (i['gd$email'] &&
                i['gd$email'][0] &&
                i['gd$email'][0].address) {
              data.email = i['gd$email'][0].address;

              Results.push(data);
            };
          });
        }

        return resolve(Results);
      });
    });
  }

};


module.exports = opts => {
  if (INSTANCE) return INSTANCE;
  return new Client(opts);
}
