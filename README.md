# 🚀 CI/CD Automation with Jenkins & GitHub Actions

## 📌 Overview

This project demonstrates a complete **CI/CD implementation using both Jenkins and GitHub Actions**, integrated with **SonarQube, Docker, Docker Hub, GitOps, Argo CD, and AWS EC2**.

The goal of the project is to automate the software delivery process from **source-code changes to container image creation and deployment**, while also providing failure notifications through email.

---

## 🏗️ Technologies Used

* **Git / GitHub** – Source Code Management
* **Jenkins** – CI/CD automation
* **GitHub Actions** – CI/CD automation
* **SonarQube** – Code quality and static analysis
* **Docker** – Application containerization
* **Docker Hub** – Container image registry
* **GitOps Repository** – Kubernetes deployment manifests
* **Argo CD** – GitOps-based continuous delivery
* **AWS EC2** – Application deployment environment
* **Email Notification** – Pipeline failure notification

---

# 🔄 CI/CD Architecture

```text
                         ┌──────────────────┐
                         │      GitHub      │
                         │  Source Code     │
                         └────────┬─────────┘
                                  │
                     Code Push / Pull Request
                                  │
                  ┌───────────────┴────────────────┐
                  │                                │
                  ▼                                ▼
          ┌───────────────┐                ┌────────────────┐
          │    Jenkins    │                │ GitHub Actions │
          └───────┬───────┘                └───────┬────────┘
                  │                                │
                  ▼                                ▼
          ┌───────────────┐                ┌────────────────┐
          │   SonarQube   │                │ Build & Test   │
          │ Code Analysis │                └───────┬────────┘
          └───────┬───────┘                        │
                  │                                ▼
                  ▼                         ┌────────────────┐
          ┌───────────────┐                 │ Docker Build   │
          │ Docker Build  │                 └───────┬────────┘
          └───────┬───────┘                         │
                  │                                ▼
                  ▼                         ┌────────────────┐
          ┌───────────────┐                 │   Docker Hub   │
          │   Docker Hub  │                 └───────┬────────┘
          └───────┬───────┘                         │
                  │                                ▼
                  │                         ┌────────────────┐
                  │                         │ GitOps Repo    │
                  │                         │ Update Image   │
                  │                         │ Manifest       │
                  │                         └───────┬────────┘
                  │                                │
                  │                                ▼
                  │                         ┌────────────────┐
                  │                         │    Argo CD     │
                  │                         │ GitOps Deploy  │
                  │                         └────────────────┘
                  │
                  │
                  │                  GitHub Actions Deployment
                  │                                │
                  │                                ▼
                  │                         ┌────────────────┐
                  │                         │    AWS EC2     │
                  │                         │ Docker Pull    │
                  │                         └───────┬────────┘
                  │                                │
                  │                                ▼
                  │                         ┌────────────────┐
                  │                         │ Docker         │
                  │                         │ Container      │
                  │                         └────────────────┘


              Any Pipeline Failure
                       │
                       ▼
                ┌──────────────┐
                │ Email Alert  │
                └──────────────┘
```

---

# 🔵 Jenkins CI/CD Pipeline

The Jenkins pipeline automates the application build and containerization process.

### Pipeline Flow

```text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
Jenkins
    │
    ├── Checkout Source Code
    │
    ├── Build Application
    │
    ├── Run Tests
    │
    ├── SonarQube Analysis
    │
    ├── Build Docker Image
    │
    ├── Push Image to Docker Hub
    │
    └── Update GitOps Manifest
              │
              ▼
       GitOps Repository
              │
              ▼
          Argo CD
```

### Jenkins Responsibilities

* Checkout source code from GitHub
* Build the application
* Run application tests
* Perform code-quality analysis using SonarQube
* Build the Docker image
* Push the Docker image to Docker Hub
* Update the Docker image tag in the GitOps repository
* Allow Argo CD to deploy the updated manifest
* Send email notifications when the pipeline fails

---

# 🟢 GitHub Actions CI/CD Pipeline

A second CI/CD implementation was created using GitHub Actions.

### Pipeline Flow

```text
GitHub Push
     │
     ▼
GitHub Actions
     │
     ▼
Build & Test
     │
     ▼
Build Docker Image
     │
     ▼
Push to Docker Hub
     │
     ▼
Update GitOps Repository
     │
     ▼
Update deployment.yml
     │
     ▼
Deploy to AWS EC2
     │
     ▼
Docker Pull
     │
     ▼
Stop Old Container
     │
     ▼
Run New Container
```

---

## 🐳 Docker Image

The application is packaged into a Docker image and pushed to Docker Hub.

Example:

```text
suryabhaskarvempala/ultimate-cicd:<BUILD_NUMBER>
```

A unique image tag is generated for each pipeline execution.

For GitHub Actions, the image tag is generated using:

```yaml
${{ github.run_number }}
```

This allows different pipeline runs to produce different Docker image versions.

---

# 📦 GitOps Repository

The CI/CD pipeline updates the Kubernetes deployment manifest stored in a separate GitOps repository.

Example:

```text
Ultimate-GitOps
│
└── manifests
    └── deployment.yml
```

The image reference inside the manifest is automatically updated.

Example:

```yaml
containers:
  - name: application
    image: suryabhaskarvempala/ultimate-cicd:5
```

On the next pipeline execution:

```yaml
image: suryabhaskarvempala/ultimate-cicd:6
```

This creates a Git-based record of deployment changes.

---

# 🔄 Argo CD

Argo CD follows the GitOps repository and uses the Kubernetes manifests stored there as the desired state.

```text
GitHub Actions / Jenkins
          │
          ▼
   Update GitOps Repo
          │
          ▼
   deployment.yml
          │
          ▼
       Argo CD
          │
          ▼
     Kubernetes
```

Whenever the deployment manifest changes, Argo CD can detect the difference between the Git repository and the Kubernetes cluster and synchronize the application.

---

# ☁️ AWS EC2 Deployment

The GitHub Actions pipeline also implements direct deployment to an AWS EC2 instance.

The deployment process connects to the EC2 server through SSH.

```text
GitHub Actions
      │
      │ SSH
      ▼
   AWS EC2
      │
      ├── Check Docker
      │
      ├── Install Docker if required
      │
      ├── Pull latest Docker image
      │
      ├── Stop existing container
      │
      ├── Remove existing container
      │
      └── Start new container
```

Example deployment command:

```bash
sudo docker pull $DOCKER_IMAGE

sudo docker stop node-app || true

sudo docker rm node-app || true

sudo docker run -d \
  --name node-app \
  -p 8080:3000 \
  "$DOCKER_IMAGE"
```

Here:

```text
8080 → EC2 host port
3000 → Application container port
```

The application can therefore be accessed through:

```text
http://<EC2-PUBLIC-IP>:8080
```

---

# 📧 Failure Notification

Failure handling was implemented for the CI/CD pipelines.

If a pipeline stage fails, an email notification is sent containing information such as:

* Repository
* Branch
* Commit
* Workflow
* Build/Run number
* GitHub Actions workflow URL

The notification allows the developer/team to quickly identify that the deployment pipeline has failed and investigate the failed stage.

---

# 🔐 Secrets Management

Sensitive credentials are stored as CI/CD secrets rather than being hard-coded in pipeline files.

Examples include:

```text
DOCKER_USERNAME
DOCKER_PASSWORD
GITOPS_TOKEN
EC2_HOST
EC2_SSH_KEY
MAIL_USERNAME
MAIL_PASSWORD
```

These credentials are consumed by Jenkins or GitHub Actions during the pipeline execution.

---

# 🎯 Key Implementation

This project demonstrates two different CI/CD approaches:

### Jenkins

```text
GitHub
   ↓
Jenkins
   ↓
Build & Test
   ↓
SonarQube
   ↓
Docker Build
   ↓
Docker Hub
   ↓
GitOps Repository
   ↓
Argo CD
   ↓
Kubernetes
```

### GitHub Actions

```text
GitHub
   ↓
GitHub Actions
   ↓
Build & Test
   ↓
Docker Build
   ↓
Docker Hub
   ↓
GitOps Repository
   ↓
Argo CD

        +

GitHub Actions
   ↓
SSH
   ↓
AWS EC2
   ↓
Docker Pull
   ↓
Run Container
```

---

# 🚀 Project Outcome

The project provides hands-on implementation of a modern CI/CD workflow covering:

* Source-code management
* Automated builds
* Automated testing
* Static code analysis
* Docker containerization
* Container image versioning
* Docker Hub image publishing
* GitOps manifest automation
* Argo CD integration
* AWS EC2 deployment
* SSH-based deployment
* Pipeline failure notifications
* Jenkins and GitHub Actions implementations

The project demonstrates how the same application delivery process can be automated using **Jenkins as well as GitHub Actions**, while integrating containerization, GitOps, cloud deployment, and automated failure handling.
