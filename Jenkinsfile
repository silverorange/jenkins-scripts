pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        echo 'Building dependencies...'
        sh 'rm -rf node_modules/'
        sh 'yarn install --mutex network'
      }
    }

    stage('Lint') {
      steps {
        echo 'Linting...'
        sh 'yarn lint'
      }
    }

    stage('Unit Tests') {
      steps {
        echo 'Running unit tests...'
        sh 'yarn test'
      }
    }
  }
}
