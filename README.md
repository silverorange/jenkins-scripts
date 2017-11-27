Jenkins Scripts
===============
This is a collection of Node scripts that are used in our continuous
integration processes.

is-composer-package-required
----------------------------
This is run if the PR being built is a package. It ensures that the package is
found in the `composer.lock` of whichever site is being built. This reduces the
number of Selenium Tests we run.

modify-composer
---------------
This runs for both packages and sites. It modifies the `composer.json` file to
include any dependencies that are specified in the body of the PR. It also
checks to see if tests should be cancelled due to the no-tests flag.

modify-react-homepage
---------------------
This is used when building react sites for staging. Building these requires setting a homepage field in their package.json. Since this varies between environments, it is useful to have a script that can modify this beforehand.

For more details on both of these scripts, and the Jenkins process, see the
[continuous integration](https://wiki.silverorange.com/Developers/Continuous%20Integration)
documentation on the silverorange wiki.
