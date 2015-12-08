
const test = require('ava');

// Init Things
var client, TOKEN;
const authCode = '';


test.before(t => {
  const opts = {
    id: process.env.ID || '',
    secret: process.env.SECRET || ''
  };

  client = require('../')(opts);
});


test.serial('Getting Token From authCode (Token Incorrect)', t => {

  return client.getAccessToken({
    authCode: authCode + Date.now()
  })
  .then(function(res) {
    t.ok(typeof res === 'object')
    t.ok(res.isValid === false);
    t.is(res.token, undefined);
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});

test.serial('Getting Token From authCode', t => {

  return client.getAccessToken({
    authCode: authCode
  })
  .then(function(res) {
    t.ok(typeof res === 'object')
    t.ok(res.isValid === true);
    t.ok(res.token);

    // Assign token for other tests
    TOKEN = res.token;
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});

test.serial('Getting Token From authCode (Token used)', t => {

  return client.getAccessToken({
    authCode: authCode
  })
  .then(function(res) {
    t.ok(typeof res === 'object')
    t.ok(res.isValid === false);
    t.is(res.token, undefined);
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});

test.serial('Refresh Token From Token', t => {

  return client.getAccessToken({
    token: TOKEN
  })
  .then(function(res) {
    t.ok(typeof res === 'object')
    t.ok(res.isValid === true);
    t.ok(res.token);

    // Assign token for other tests
    TOKEN = res.token;
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});

test.serial('Refresh Token From Refresh Token', t => {

  return client.getAccessToken({
    token: TOKEN
  })
  .then(function(res) {
    t.ok(typeof res === 'object')
    t.ok(res.isValid === true);
    t.ok(res.token);

    // Assign token for other tests
    TOKEN = res.token;
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});

test.serial('Refresh Token (Token Incorrect)', t => {

  return client.getAccessToken({
    token: TOKEN + Date.now()
  })
  .then(function(res) {
    t.ok(typeof res === 'object')
    t.ok(res.isValid === false);
    t.is(res.token, undefined);
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});

test('Get Contacts (Token Incorrect)', t => {

  return client.getContacts(TOKEN + Date.now())
  .then(function(res) {
    t.is(res, undefined);
  })
  .catch(function(e) {
    t.ok(e instanceof Error, e);
  });
});

test('Get Contacts', t => {

  return client.getContacts(TOKEN)
  .then(function(res) {
    t.ok(typeof res === 'object')
    t.ok(Array.isArray(res));
    t.ok(res.length, res);
  })
  .catch(function(e) {
    console.log(e);
    t.is(e, undefined);
  });
});
