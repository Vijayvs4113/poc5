pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'vijayvs6383/product-catalogue'
        IMAGE_TAG = "${BUILD_NUMBER}"
        KUBECONFIG = "/var/jenkins_home/.kube/config-jenkins"
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out Product Catalogue source code...'
                checkout scm
            }
        }
        stage('Validate') {
            steps {
                echo 'Validating project files...'
                sh '''
                    test -f index.html
                    test -f style.css
                    test -f app.js
                    test -f Dockerfile
                    test -f nginx.conf
                    test -f Jenkinsfile
                    test -f k8s/configmap.yml
                    test -f k8s/deployment.yml
                    test -f k8s/service.yml
                '''
                echo 'Validation successful.'
            }
        }
        stage('Docker Build') {
            steps {
                echo "Building Docker image ${DOCKER_IMAGE}:${IMAGE_TAG}..."
                sh """
                    docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                    docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }
        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                            -u "$DOCKER_USERNAME" \
                            --password-stdin
                    '''
                }
            }
        }
        stage('Docker Push') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                sh """
                    docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                    docker push ${DOCKER_IMAGE}:latest
                """
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying Product Catalogue to Kubernetes...'
                sh '''
                    kubectl apply -f k8s/configmap.yml
                    kubectl apply -f k8s/deployment.yml
                    kubectl apply -f k8s/service.yml
                '''
            }
        }
        stage('Verify Kubernetes Deployment') {
            steps {
                echo 'Verifying Kubernetes resources...'

                sh '''
                    kubectl get configmap product-catalogue-config
                    kubectl get deployment product-catalogue
                    kubectl get pods -l app=product-catalogue
                    kubectl get service product-catalogue-service
                '''
            }
        }
    }
    post {
        success {
            echo 'Product Catalogue POC pipeline completed successfully!'
        }

        failure {
            echo 'Product Catalogue POC pipeline failed.'
        }
    }
}
