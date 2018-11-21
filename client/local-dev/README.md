# Local React Playground

The purpose of this project is to allow you to test React changes which live in `client` by building bundles locally in the same way as our CodeBuild jobs. React components are mounted onto a DOM for a tight feedback loop as follows:

```
ndop-front-end/client
npx webpack
```
* Open the index.html for the desired screen or hard refresh the page if you're already viewing the html in you browser of choice.


## First time setup
First time setup of the local demo is as follows:
```
cd ~ndop-front-end/client
npm install && npx webpack
```
