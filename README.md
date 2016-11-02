[![Snyk logo](https://snyk.io/style/asset/logo/snyk-print.svg)](https://snyk.io)

[![Build Status](https://travis-ci.org/Snyk/serverless-snyk.svg?branch=master)](https://travis-ci.org/Snyk/serverless-snyk)
[![Known Vulnerabilities](https://snyk.io/test/github/snyk/serverless-snyk/badge.svg)](https://snyk.io/test/github/snyk/serverless-snyk)

***

# Serverless Snyk Plugin

Around 14% of npm packages carry a known vulnerability, and new vulnerabilities are being [discovered every day](https://snyk.io/vuln). The Serverless Snyk plugin helps you keep your application secure by allowing you to check the Node.js dependencies in your [Serverless](https://github.com/serverless/serverless) app for known vulnerabilities using [Snyk](https://snyk.io).

For Serverless v1 only.

## How do I use it?

1. Fix any existing vulnerable packages using [Snyk's GitHub integration](https://snyk.io/docs/github/) or [Snyk wizard](https://snyk.io/docs/using-snyk/#wizard).

2. Install the Serverless Snyk plugin using npm

   `npm install serverless-snyk --save`

   You should now have Serverless Snyk installed and ready to go. You can confirm that the plugin has been installed by running `serverless` from your command line. You should see the Snyk plugin in the list of installed plugins. 

3. Add the plugin to your Serverless config

   Next, you'll need to add the plugin to your `serverless.yml` file:

   ```yml
   plugins:
      - serverless-snyk
   ```

4. Optional: Get a Snyk API Key

   To avoid running into API rate limits and to enable [continuous monitoring](#continuous-monitoring), you'll need to [sign up for a Snyk account](https://snyk.io/auth/github) (if you don't have one already) and copy the API token from your dashboard. Detailed instructions on how to include the API token in your configuration are included in the [setting an API key](#setting-an-api-key) section below.

That's it! Now when you deploy, the Serverless Snyk plugin will scan your application for known vulnerabilities.


## Configuring

### Setting an API key
To ensure you don't run into any API rate limits, or to enable continuous monitoring of the state of your application's security, you'll need to include a valid API token in your application.

You can do this by [signing up for an account](https://snyk.io/auth/github) (if you don't have one already) and copying the API token from your dashboard. 

Since the Serverless framework does not currently support environment variables, Serverless Snyk uses [dotenv](https://github.com/motdotla/dotenv) to store your token. You'll want to create a `.env` file in the root of your project, and then set a `snykAuth` variable with the value you copied from your dashboard:

```
snykAuth=YOUR_API_TOKEN
```

### Deploying even if vulnerabilities are discovered
By default, Serverless Snyk will stop serverless from deploying if Snyk detects any vulnerabilities in your dependencies. Each vulnerability will also be outputted, and you'll be prompted to run `snyk wizard` to address the issues. 

If you would like serverless to deploy your application even if Snyk finds known vulnerabilities, you can accomplish this by using a custom variable in your `serverless.yml` file.

```yml
custom:
  snyk:
    breakOnVuln: false
```

Snyk will still run and report any vulnerabilities, but the deploy will now continue on successfully.

### Continuous monitoring
Snyk can take a snapshot of the current state of your dependencies each time you deploy, and proactively you of any newly discovered vulnerabilities that may impact them.

**This feature requires an API token.** If you've included the the API token as [described above](#setting-an-api-key), the plugin will monitor your application by default.

There may be cases where you want to be authenticated to avoid API limits, but you don't want to monitor your application. You can turn off monitoring in the `serverless.yml` file:

```yml
custom:
  snyk:
    monitor: false
```

### License

MIT