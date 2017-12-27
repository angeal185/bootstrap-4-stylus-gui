const express = require('express'),
fs = require('fs'),
router = express.Router(),
os = require('os'),
chalk = require('chalk'),
config = require('../config/config'),
data = require('../config/data');
const { exec } = require('child_process');

function logRes(i){
	console.log('task: '+chalk.magenta('['+i+']'),chalk.green(`[Success]`));
}
function apiRes(i){
	console.log('API: '+chalk.blue('['+i+']'),chalk.green(`[connected]`));
}

//page
router.get('/', function(req, res) {
  res.render('index', {
    title: 'dash',
    config:config,
	links: data.links
  });
});

//API
router.get('/config', function(req, res) {
  res.json(config);
  apiRes('config');
});

router.get('/status', function(req, res) {
  res.json({
		platform: os.platform(),
		prelease: os.release(),
		ptype: os.type(),
		arch: os.arch(),
		cpu: os.cpus(),
		cpuUsage:process.cpuUsage(),
		freemem: os.freemem(),
		totalmem: os.totalmem(),
		nodemem:process.memoryUsage().rss,
		hostname: os.hostname(),
		loadavg: os.loadavg(),
		nodev:process.versions,
		uptime:process.uptime(),
		cwd:process.cwd()
	});
	apiRes('status');
	
});


router.post('/task01', function(req, res) {

  exec(config.bootstrap, (err, stdout, stderr) => {
      if (err) {
          console.log(chalk.red(`[stylus]: ${stderr}`));
      } else {
          console.log(chalk.magenta(`[stylus]`),chalk.green(`[Success]`),chalk.yellow(`: ${stdout}`));
      }
      return;
  });

    res.redirect('/');
});

router.post('/task02', function(req, res) {

  exec(config.bootstrapMin, (err, stdout, stderr) => {
      if (err) {
          console.log(chalk.red(`[stylus]: ${stderr}`));
      } else {
          console.log(chalk.magenta(`[stylus]`),chalk.green(`[Success]`),chalk.yellow(`: ${stdout}`));
      }
      return;
  });

    res.redirect('/');
});

router.post('/task03', function(req, res) {

  exec(config.bootstrapSource, (err, stdout, stderr) => {
      if (err) {
          console.log(chalk.red(`[stylus]: ${stderr}`));
      } else {
          console.log(chalk.magenta(`[stylus]`),chalk.green(`[Success]`),chalk.yellow(`: ${stdout}`));
      }
      return;
  });

    res.redirect('/');
});

router.post('/task04', function(req, res) {

  exec(config.bootstrapMinSource, (err, stdout, stderr) => {
      if (err) {
          console.log(chalk.red(`[stylus]: ${stderr}`));
      } else {
          console.log(chalk.magenta(`[stylus]`),chalk.green(`[Success]`),chalk.yellow(`: ${stdout}`));
      }
      return;
  });

    res.redirect('/');
});

router.post('/task01', function(req, res) {

  exec("stylus ./stylus/bootstrap.styl -o ./dist/", (err, stdout, stderr) => {
      if (err) {
          console.log(chalk.red(`[stylus]: ${stderr}`));
      } else {
          console.log(chalk.magenta(`[stylus]`),chalk.green(`[Success]`),chalk.yellow(`: ${stdout}`));
      }
      return;
  });

    res.redirect('/');
});



router.post('/updateImports', function(req, res) {
let toUpdate = req.body.imports; 
fs.writeFile(config.includes, toUpdate, 'utf8'),
      function(err) {
        if (err) throw err;
      };
  res.redirect('/');
  logRes('Update:Includes');
});

router.post('/updateConfig', function(req, res) {
let toUpdate = req.body.confData; 
fs.writeFile('./app/app/config/config.json', toUpdate, 'utf8'),
      function(err) {
        if (err) throw err;
      };
  res.redirect('/');
  logRes('Update:Config');
});

router.post('/updateOps', function(req, res) {
let toUpdate = req.body.outData2; 
fs.writeFile(config.options, toUpdate, 'utf8'),
      function(err) {
        if (err) throw err;
      };
  res.redirect('/');
  logRes('Update:Options');
});

router.post('/updateDefaultOps', function(req, res) {
let toUpdate = req.body.outData3; 
fs.writeFile(config.defaultOptions, toUpdate, 'utf8'),
      function(err) {
        if (err) throw err;
      };
  res.redirect('/');
  logRes('Update:DefaultOptions');
});

module.exports = router;