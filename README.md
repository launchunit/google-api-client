# google-api-client
Nodejs client for google OAuth2 based APIs

Google OAuth2 will work for GoogleDrive, GMail, Contacts and many other Google APIs.

----


## Preparation
----------

Register your application with [Google's API console](https://console.developers.google.com/apis/)
- go to *Services* and enable the API you want to use
- go to *Credentials* and create a oAtuh 2.0 Client ID
- take the strings labeled *Client-ID* and *Client-Secret*


## Usage

```js
// Create a google client instance
const opts = {
  id: 'test-id',
  secret: 'test-secret',
  redirect_uri: 'http://test.com' (Optional)
};

const client = require('google-api')(opts);

// Get access token from either authCode or refresh token
client.getAccessToken({
  authCode: 'some-code',
})
.then(function(res) {
  console.log(res);
})
.catch(function(e) {
  console.log(e);
});

// Get access token from either authCode or refresh token
client.getAccessToken({
  token: 'some-token',
})
.then(function(res) {
  console.log(res);
})
.catch(function(e) {
  console.log(e);
});

// Get contacts
client.getContacts('some-token')
.then(function(res) {
  // Array of contacts [{ email, first_name, last_name }]-->
  console.log(res);
})
.catch(function(e) {
  console.log(e);
});
```

#### Run Tests
```bash
$ npm test
```
