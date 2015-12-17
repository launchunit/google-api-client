
const app = require('express')()
app.set('views', __dirname);
app.set('view engine', 'jade');

app.use('/', (req,res) => {
  return res.render('index');
});

app.listen(3000, ()=> {
  console.log('Google Client Server Listening..');
});
