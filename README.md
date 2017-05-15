# Web-based Circuit Simulator

With inspiration, I want to learn how to develop a circuit simulator. Through documenting the process, I hope that it could serve as a useful and clear guideline on how to develop a circuit sim, too. This should not be confused with my past personal project - 'Sirkit Circuit Simulator'.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You'll need the following installed on your machine to run this project.
- Node.js [[https://nodejs.org/en/](https://nodejs.org/en/)]
- Node Package Manager (from Node.js' installer)

Test that you can access Node and npm from your command prompt:
```
node --version
```
```
npm --version
```

Should there be an error saying either or both of them not recognised as a command, do check your Environment Variable's PATH to ensure that the locations of Node.js and NPM are present there. Refer to [this](http://stackoverflow.com/questions/23412938/node-is-not-recognized-as-an-internal-or-an-external-command-operable-program) for Node, and [this](http://stackoverflow.com/questions/20992723/npm-is-not-recognized-as-internal-or-external-command-operable-program-or-bat) for NPM.

### Installing

1. Pull / Download the project into your machine
2. Open command prompt on the project's directory
3. Download and install the dependencies of this project by running `npm install` in the command prompt
4. Done! Hopefully nothing has crashed and burn at this point.


## Running the tests

* Run `npm run live-test` in the command prompt and it should start up a chrome browser that is used to run the tests (might take a minute or two)
* Tests are automatically run on code changes
* Click on the 'DEBUG' button on the top right to view the test report (needs page refresh to see changes)

To end the test, press `CTRL-C` in your command prompt to end the session. 


## Authors

* **Seck Wei Lim** - [Github](https://github.com/seckwei)

## Acknowledgments

* Thom Wright - open source Javascript circuit simulator [[link](https://github.com/circuitsim/circuit-simulator)]
