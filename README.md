<img src="images/logo.png" height=72>

# NDOP Front End Code

This is the source code repository for the front end portion of the National Data Opt-out Service.

## Building the code

To build the NDOP front end code locally

- clone the repository 
```
git clone https://github.com/nhsconnect/ndop-front-end.git
```

## First time setup
First time setup of the local demo is as follows:
```
cd client
npm install && npx webpack
```

- Open the index.html for the desired screen or hard refresh the page if you're already viewing the html in you browser of choice.

### Prerequisites for Node Lambdas
1. Ensure you have an installation of Node and NPM that matches the lambda runtime environment.
  1. For Node, this is currently 6.10.0
  2. To get a specific non-latest version of Node we use node version manager (nvm)
  3. See set-up instructions below:

```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
nvm install ${NODEJS_VERSION} --latest-npm
```

*Note*
If you get an `nvm: command not found` error, re-open your terminal or source your `.bashrc` file.

For React, we require Babel in order to transpile ES6 JS code to ES5 code (for example, JSX components)

2. Globally install the Babel CLI

```
npm install -g babel-cli
```

### Manually creating Webpack bundles locally
For a faster feedback loop during development, it is possible to use Webpack to create JS bundles of our React code locally and then to upload them directly to AWS S3.
To do this:

1. Navigate to the client directory within ndop-front-end, update npm, install the necessary dependencies and build the JS bundles

```
cd client
npm update && npm install && npx webpack
```

2. The output of the above should state whether or not the JS bundles have been built successfully, but you can check this by navigating to `static-resources/js/app` and listing all the files within this directory