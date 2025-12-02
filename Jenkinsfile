pipeline {
    agent {
        docker {
            image 'node:18'
            args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-cred')
        WEATHER_API_KEY = credentials('weather-api-key')
        IMAGE_NAME = "naveensmb/weather-app"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh """
                echo "VITE_WEATHER_API_KEY=$WEATHER_API_KEY" > .env
                npm run build
                """
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Push Image') {
            steps {
                sh """
                echo ${DOCKERHUB_CREDS_PSW} | docker login -u ${DOCKERHUB_CREDS_USR} --password-stdin
                docker push ${IMAGE_NAME}:latest
                """
            }
        }
    }
}
