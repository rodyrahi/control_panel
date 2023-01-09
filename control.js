const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {NodeSSH} = require('node-ssh')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());






app.post('/restart_app', function(req, res) {
  const appName = req.body.appName;
  const password = req.body.password;

  const sshClient = new NodeSSH();

  sshClient.connect({
    host: '165.232.151.6',
    username: 'root',
    password: password
  }).then(() => {
    sshClient.execCommand(`pm2 restart ${appName}`).then(output => {
      sshClient.dispose();
      res.send(output.stdout);
    });
  });
});

app.post('/stop_app', function(req, res) {
  const appName = req.body.appName;
  const password = req.body.password;

  const sshClient = new NodeSSH();

  sshClient.connect({
    host: '165.232.151.6',
    username: 'root',
    password: password
  }).then(() => {
    sshClient.execCommand(`pm2 stop ${appName}`).then(output => {
      sshClient.dispose();
      res.send(output.stdout);
    });
  });
});

app.post('/delete_app', function(req, res) {
  const appName = req.body.appName;
  const password = req.body.password;

  const sshClient = new NodeSSH();

  sshClient.connect({
    host: '165.232.151.6',
    username: 'root',
    password: password
  }).then(() => {
    sshClient.execCommand(`pm2 delete ${appName}`).then(output => {
      sshClient.dispose();
      res.send(output.stdout);
    });
  });
});

app.post('/restart_mysql', function(req, res) {
  const sshClient = new NodeSSH();
  const password = req.body.password;

  sshClient.connect({
    host: '165.232.151.6',
    username: 'root',
    password: password
  }).then(() => {
    sshClient.execCommand(`systemctl restart mysql.service`).then(output => {
      sshClient.dispose();
      res.send(output.stdout);
    });
  });
});

app.post('/git_pull', function(req, res) {
  const appName = req.body.appName;
  const password = req.body.password;

  const sshClient = new NodeSSH();

  sshClient.connect({
    host: '165.232.151.6',
    username: 'root',
    password: password
  }).then(() => {
    // Run all commands in sequence
    return sshClient.execCommand(`cd app/whatsappapi && git pull && pm2 delete ${appName}`)
  }).then(output => {
    // Dispose of the SSH client and send the command output as the response
    sshClient.dispose();
    res.send(output.stdout);
  }).catch(err => {
    // If there was an error, log it and send a generic error response
    console.error(err);
    res.send('An error occurred');
  });
});

app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  
    res.render('index');   
  });



app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
