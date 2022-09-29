def DOCKER_REPO="registry.gitlab.famtechvn.net/luxuria/v2/be/chat"
def FT_REGISTRY="https://registry.gitlab.famtechvn.net"
def DOCKER_IMAGE_NAME="luxuria-v2-be-chat"
def GIT_COMMIT_DESC=''
def ENV_CREDENTIAL="luxuria-v2-be-chat.env"
def ENV_CREDENTIAL_STG="stg-luxuria-v2-be-chat.env"

// Define notification build function
def notifyBuild(String buildStatus = 'STARTED', String GIT_COMMIT_DESC) {
    def colorCode = '#FF0000'
    def duration = "after ${currentBuild.durationString.replace(' and counting', '')}"
    def subject = "${env.JOB_NAME} - #${env.BUILD_NUMBER}"

    // Override default values based on build status
    if (buildStatus == 'STARTED') {
        colorCode = 'gray'
        duration = "Started <${env.BUILD_URL}console|:construction:>"
    } else if (buildStatus == 'SUCCESSFUL') {
        colorCode = 'good'
        duration = "Success ${duration} <${env.BUILD_URL}console|:confetti_ball:>"
    } else {
        colorCode = 'danger'
        duration = "Failed ${duration} <${env.BUILD_URL}console|:shit:>"
    }
    
    def summary = "${subject} ${duration} ${GIT_COMMIT_DESC == '' ? '' : '\n'}${GIT_COMMIT_DESC == '' ? '' : GIT_COMMIT_DESC}"
    
    // Send notifications
    slackSend (color: colorCode, message: summary)
}

notifyBuild('STARTED')

pipeline {
    agent any
    stages {
    	stage ('Deploy Staging') {
            when {
                anyOf {
                    environment name: 'GIT_BRANCH', value: 'develop';
                    environment name: 'GIT_BRANCH', value: 'origin/develop'
                }
            }

            environment {
                ENV_FILE = credentials("$ENV_CREDENTIAL_STG")
            }
            steps {
                script {
                    ENV = "staging"
                    GIT_COMMIT_DESC = sh(script: 'git log --format=oneline -n 1', returnStdout: true).trim()
                }

                echo "Deploy to staging environment"
                sh "docker build -t ${DOCKER_IMAGE_NAME}:stg ."
                sh "docker stop ${DOCKER_IMAGE_NAME}-stg || true && docker rm ${DOCKER_IMAGE_NAME}-stg || true"
                sh """
                    docker run -d -p 127.0.0.1:8604:3000 \
                    --env NODE_ENV=${ENV} \
                    --env-file ${ENV_FILE} \
                    --restart always \
                    --link redis-stg:redis \
                    --link rabbitmq-share:rabbitmq \
                    --link logger-stg:logger \
                    --name ${DOCKER_IMAGE_NAME}-stg ${DOCKER_IMAGE_NAME}:stg
                    """
                echo "Finish deploy to staging environment"
            }
        }
    	stage ('Deploy Production') {
            when {
                anyOf {
                    environment name: 'GIT_BRANCH', value: 'master';
                    environment name: 'GIT_BRANCH', value: 'origin/master'
                }
            }

            environment {
                ENV_FILE = credentials("$ENV_CREDENTIAL")
                registryCredential = 'FTRegistryID'
                dockerImage=''
            }
            steps {
                script {
                    ENV = "production"
                    GIT_COMMIT_DESC = sh(script: 'git log --format=oneline -n 1', returnStdout: true).trim()
                    dockerImage = docker.build DOCKER_REPO + ":production-${BUILD_NUMBER}" 
                    docker.withRegistry( FT_REGISTRY, registryCredential ) { 
                        dockerImage.push() 
                    }
                }

                echo "Deploy to production environment"
                //sh "docker build -t $DOCKER_REPO:production-build-${env.BUILD_NUMBER} ."
                //sh "docker push $DOCKER_REPO:production-build-${env.BUILD_NUMBER}"
                //sh "docker run -d -p 8603:3000 --env NODE_ENV=${ENV} --env-file ${ENV_FILE} --restart always ////--name ${DOCKER_IMAGE_NAME}-stg ${DOCKER_IMAGE_NAME}:stg"
                echo "Finish deploy to production environment"
            }
        }
    }
    post {
        success {
            notifyBuild('SUCCESSFUL', GIT_COMMIT_DESC)
        }
        failure {
            notifyBuild('FAILED', GIT_COMMIT_DESC)
        }
    }
}
