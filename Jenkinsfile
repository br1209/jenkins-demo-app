pipeline {
    agent none

    environment {
        APP_NAME  = 'jenkins-demo-app'
        VERSION   = "1.0.${BUILD_NUMBER}"
        IMAGE_TAG = "bhargava209/${APP_NAME}:branch-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            agent any
            steps {
                echo "Branch: ${env.BRANCH_NAME}"
                echo "Building: ${IMAGE_TAG}"
            }
        }

        stage('Unit Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo "Running unit tests..."
                sh 'node app.test.js'
                echo "Unit tests passed"
            }
        }

        stage('Build Docker Image') {
            agent any
            steps {
                echo "Building image: ${IMAGE_TAG}"
                sh "docker build -t ${IMAGE_TAG} ."
                echo "Image built successfully"
            }
        }

        stage('Push to Registry') {
            agent any
            when {
                branch 'develop'
            }
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'USER',
                        passwordVariable: 'PASS'
                    )
                ]) {
                    sh "echo $PASS | docker login -u $USER --password-stdin"
                    sh "docker push ${IMAGE_TAG}"
                    sh "docker logout"
                    echo "Image pushed: ${IMAGE_TAG}"
                }
            }
        }

        stage('Trigger INT') {
            agent any
            when {
                branch 'develop'
            }
            steps {
                echo "Branch build passed. Triggering INT pipeline..."
                build job: 'myapp-int',
                      parameters: [
                          string(name: 'IMAGE_TAG',
                                 value: "${IMAGE_TAG}"),
                          string(name: 'BRANCH_BUILD_NUMBER',
                                 value: "${BUILD_NUMBER}")
                      ],
                      wait: true,
                      propagate: true
            }
        }
    }

    post {
        success {
            echo "BRANCH BUILD PASSED: ${IMAGE_TAG}"
        }
        failure {
            echo "BRANCH BUILD FAILED: ${IMAGE_TAG}"
        }
        always {
            cleanWs()
        }
    }
}