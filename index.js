'use strict';

const fs = require('fs');
const snyk = require('snyk/lib');
const chalk = require('chalk');
const BbPromise = require('bluebird');
const execSync = require('child_process').execSync;
require('dotenv').config({silent: true});

class ServerlessSnyk {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.snyk = snyk;
    this.snykCLI = 'node ./node_modules/snyk/cli';

    /* Defaults to be overriden in serverless.yml file */
    this.breakOnVuln = true;
    this.snykAuth = false;
    this.monitor = true;
    this.authenticated = false;

    /* Pull in any custom snyk related variables */
    var customs = this.serverless.service.custom;
    if (customs && customs.snyk) {
      for (var prop in customs.snyk) {
        this[prop] = customs.snyk[prop];
      }
    }

    this.commands = {
        snyk: {
          usage: 'Checks dependencies for known vulnerabilities using Snyk.io.',
          lifecycleEvents: [
              'testVulnerabilities',
          ],
        },
      };

    this.hooks = {
        'before:deploy:createDeploymentArtifacts': () => BbPromise.bind(this)
          .then(this.auth)
          .then(this.protect)
          .then(this.test)
          .then(this.takeSnapshot),
      };
  }
  auth() {
    if (process.env.snykAuth) {
      var cmd = this.snykCLI + ' auth -api ' + process.env.snykAuth;
      try {
        var auth = execSync(cmd);
        this.serverless.cli.log(
          auth.toString().replace(new RegExp('\r?\n','g'), '')
        );
        this.authenticated = true;
      } catch (error) {
        if (error.stderr) {
          throw new this.serverless.classes.Error(error.stdout.toString());
        } else {
          throw error;
        }
      }
    }
  }
  takeSnapshot() {
    if (this.monitor && this.authenticated) {
      try {
        var monitor = execSync(this.snykCLI + ' monitor');
        var output = monitor.toString().split('\n\n');
        for (var i = 0; i < output.length; i++) {
          if (output[i] != '\n') {
            this.serverless.cli.log(output[i].replace('\n', ' '));
          }
        }
      } catch (error) {
        if (error.stderr) {
          throw new this.serverless.classes.Error(error.stdout.toString());
        } else {
          throw error;
        }
      }
    }
  }
  test() {
    this.serverless.cli.log('Querying vulnerabilities database...');
    var self = this;
    return this.snyk.test('./').then(function (res) {
      if (res.ok) {
        self.serverless.cli.log('Snyk tested ' + res.dependencyCount
          + ' dependencies for known vulnerabilities, '
          + ' found 0 vulnerabilities, 0 vulnerable paths.')
      } else {
        res.vulnerabilities.forEach(function (vuln) {
          var res = '';
          var name = vuln.name + '@' + vuln.version;
          var severity = vuln.severity[0].toUpperCase()
            + vuln.severity.slice(1);
          res += chalk.red('✗ ' + severity + ' severity vulnerability found on '
              + name);

          self.serverless.cli.consoleLog(res);
        });
        var msg = 'Snyk tested ' + res.dependencyCount
          + ' dependencies for known vulnerabilities,'
          + ' found ' + res.uniqueCount + ' vulnerabilities, '
          + res.summary + '. ';
        msg += ' Run `snyk wizard` to resolve these issues';
        if (self.breakOnVuln) {
          throw new self.serverless.classes.Error(msg);
        } else {
          self.serverless.cli.log(msg);
        }
      }
    });
  }

  protect() {
    var path = process.cwd();
    var self = this;

    fs.exists(path + '/.snyk', function (exists) {
      if (exists) {
        try {
          var protect = execSync(self.snykCLI + ' protect');
          self.serverless.cli.log(
            protect.toString().replace(new RegExp('\r?\n','g'), '')
          );
        } catch (error) {
          if (error.stderr) {
            throw new self.serverless.classes.Error(error.stdout.toString());
          } else {
            throw error;
          }
        }
      } else {
        self.serverless.cli.log(
          'No Snyk protect policy was found. Skipping updates and patches.');
        self.serverless.cli.log(
          'Try running `snyk wizard` to define a Snyk policy.');
      }
    });
  }
}

module.exports = ServerlessSnyk;