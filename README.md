# Jenkins Scripts
This is a collection of Node scripts that are used in our Continuous Integration Processes.
## isRequired.js
This is run if the PR being built is a package. It ensures that the package is found in the composer.lock of whichever site is being built. That reduces the amount of Selenium Tests we run and so speeds up our CI progress.
## modifyComposer.js
This runs for both packages and sites. It modifies the composer.json file to include any dependencies that are specified in the body of the PR. It also checks to see if tests should be cancelled due to the no tests flag.


For more details on both of these scripts, and the Jenkins process, see the [Continuous Integration Page](https://wiki.silverorange.com/Developers/Continuous%20Integration) on the wiki
