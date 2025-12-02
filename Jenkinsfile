pipeline {
    agent any

    environment {
        // Load credentials
        DOCKERHUB_CREDS = credentials('dockerhub-creds')      // Jenkins ID for Docker Hub
        WEATHER_API_KEY = credentials('weather-api-key')       // Jenkins ID for Weather API Key
        IMAGE_NAME = "your-dockerhub-username/weather-app"     // <-- Replace with your Docker repo name
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out source..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing npm packages..."
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                echo "Building React production build..."
                
                // Inject API key into your environment build
                sh """
                echo 'Creating .env file for React...'
                echo 'VITE_WEATHER_API_KEY=$WEATHER_API_KEY' > .env
                npm run build
                """
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                    docker build -t ${IMAGE_NAME}:latest .
                    """
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                sh """
                echo "Logging into Docker Hub..."
                echo ${DOCKERHUB_CREDS_PSW} | docker login -u ${DOCKERHUB_CREDS_USR} --password-stdin
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh """
                docker push ${IMAGE_NAME}:latest
                """
            }
        }
    }

    post {
        success {
            echo "Build & Push succeeded!"
        }
        failure {
            echo "Build failed!"
        }
    }
}
