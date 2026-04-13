pipeline {
    agent none

    environment {
        APP_NAME = 'jenkins-demo-app'
        VERSION  = "1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            agent any
            steps {
                echo "Branch: ${env.BRANCH_NAME}"
                echo "Building: ${APP_NAME} version: ${VERSION}"
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo "Running tests on branch: ${env.BRANCH_NAME}"
                sh 'node app.test.js'
            }
        }

        stage('Build Docker Image') {
            agent any
            steps {
                echo "Building Docker image..."
                sh "docker build -t ${APP_NAME}:${VERSION} ."
                echo "Image built: ${APP_NAME}:${VERSION}"
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            agent any
            steps {
                echo "DEPLOYING TO PRODUCTION"
                echo "Branch: ${env.BRANCH_NAME}"
                sh "docker stop ${APP_NAME}-prod || true"
                sh "docker rm ${APP_NAME}-prod || true"
                sh "docker run -d --name ${APP_NAME}-prod -p 3000:3000 -e APP_VERSION=${VERSION} -e ENVIRONMENT=production ${APP_NAME}:${VERSION}"
                echo "Production deployment complete on port 3000"
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            agent any
            steps {
                echo "DEPLOYING TO STAGING"
                echo "Branch: ${env.BRANCH_NAME}"
                sh "docker stop ${APP_NAME}-staging || true"
                sh "docker rm ${APP_NAME}-staging || true"
                sh "docker run -d --name ${APP_NAME}-staging -p 3001:3000 -e APP_VERSION=${VERSION} -e ENVIRONMENT=staging ${APP_NAME}:${VERSION}"
                echo "Staging deployment complete on port 3001"
            }
        }

        stage('Feature Branch') {
            when {
                not { branch 'main' }
                not { branch 'develop' }
            }
            agent any
            steps {
                echo "FEATURE BRANCH: ${env.BRANCH_NAME}"
                echo "Tests passed - no deployment for feature branches"
                echo "Merge to develop when ready"
            }
        }
    }

    post {
        success {
            echo "PIPELINE PASSED on branch: ${env.BRANCH_NAME}"
        }
        failure {
            echo "PIPELINE FAILED on branch: ${env.BRANCH_NAME}"
        }
        always {
            echo "Finished pipeline for: ${env.BRANCH_NAME}"
        }
    }
}
