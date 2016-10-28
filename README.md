# Serverless Snyk Plugin

## What is it?
The Serverless Snyk plugin allows you to check the Node.js dependencies in your [Serverless](https://github.com/serverless/serverless) app for known vulnerabilities using [Snyk](https://snyk.io).

For Serverless v1 only.

## How do I use it?

1. Install using npm

`npm install serverless-snyk --save-dev`

You should now have Serverless Snyk installed and ready to go. You can confirm that the plugin has been installed by running `serverless` from your command line. You should see the Snyk plugin in the list of installed plugins. 

2. Add the plugin to your Serverless config

Next, you'll need to add the plugin to your `serverless.yml` file:

```
plugins:
   - serverless-snyk
```

That's it! Now when you deploy, the Serverless Snyk plugin will scan your application for known vulnerabilities.

### Deploying even if vulnerabilities are discovered
By default, Serverless Snyk will stop serverless from deplying if Snyk detects any vulnerabilities in your dependencies. Each vulnerability will also be outputted, and you'll be prompted to run `snyk wizard` to address the issues. 

If you would like serverless to deploy your application even if Snyk finds known vulnerabilities, you can accomplish this by using a custom variable in your `serverless.yml` file.

```
custom:
  snyk:
    breakOnVuln: false
```

Snyk will still run and report any vulnerabilities, but the deploy will now continue on successfully.

### Continual monitoring
Out of the box Serverless Snyk will help to make sure that there are no known vulnerabilities at the time of deploy. Snyk can also monitor your project and alert you if new vulnerabilities are discovered.

To enable this feature, you'll need to authenticate by [signing up for an account](https://snyk.io/auth/github) (if you don't have one already) and copying the API token from your dashboard. 

Since the Serverless framework does not currently support environment variables, Serverless Snyk uses [dotenv](https://github.com/motdotla/dotenv) to store your token. You'll want to create a `.env` file in the root of your project, and then set a `snykAuth` variable with the value you copied from your dashboard:

```
snykAuth=YOUR_API_TOKEN
```

Now on every successful deploy, Serverless Snyk will take a snapshot of your current dependencies so that they can be monitored to help you quickly identify and address any new security issues that arise.

### License

MIT