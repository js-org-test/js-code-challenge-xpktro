const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.get('/', (request, response) => {
  response.sendFile('/public/index.html');
});
app.use((request, response) => {
  response.status(404).end('<h1>404');
});
const port = process.env.PORT || 5000;
app.listen(port, () => {

  console.log(`listening on ${port}`);
});
