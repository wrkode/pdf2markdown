# Publishing PDF2Markdown to GitHub Container Registry (GHCR)

This guide explains how to build and publish the PDF2Markdown containers to GitHub Container Registry.

## Prerequisites

1. GitHub account
2. Docker installed
3. GitHub Personal Access Token (PAT) with appropriate permissions

## Step 1: Create a Personal Access Token (PAT)

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Click "Generate new token (classic)"
3. Select at minimum these scopes: 
   - `read:packages`
   - `write:packages`
   - `delete:packages`
4. Copy the token for use in the next steps

## Step 2: Login to GitHub Container Registry

```bash
# Login to GitHub Container Registry
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

Replace `YOUR_GITHUB_TOKEN` with your PAT and `YOUR_GITHUB_USERNAME` with your GitHub username.

## Step 3: Build the Containers

From the project root directory:

```bash
# Build backend container
docker build -t ghcr.io/YOUR_USERNAME/pdf2markdown/pdf2markdown-backend:latest ./backend

# Build frontend container
docker build -t ghcr.io/YOUR_USERNAME/pdf2markdown/pdf2markdown-frontend:latest ./frontend
```

## Step 4: Push Containers to GHCR

```bash
# Push backend container
docker push ghcr.io/YOUR_USERNAME/pdf2markdown/pdf2markdown-backend:latest

# Push frontend container
docker push ghcr.io/YOUR_USERNAME/pdf2markdown/pdf2markdown-frontend:latest
```

## Step 5: Update Kubernetes Manifests

Update your Kubernetes manifests in the `k8s` directory to use the GHCR images:

```bash
# Edit backend-deployment.yaml
sed -i 's|image: pdf2markdown-backend:latest|image: ghcr.io/YOUR_USERNAME/pdf2markdown/pdf2markdown-backend:latest|g' k8s/backend-deployment.yaml

# Edit frontend-deployment.yaml
sed -i 's|image: pdf2markdown-frontend:latest|image: ghcr.io/YOUR_USERNAME/pdf2markdown/pdf2markdown-frontend:latest|g' k8s/frontend-deployment.yaml
```

## Step 6: Make Your Packages Public (Optional)

By default, packages on GHCR are private. To make them public:

1. Go to GitHub > Your Profile > Packages
2. Click on your package
3. Go to Package Settings
4. Under "Change Package Visibility", select "Public"

## Step 7: Deploy to Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/
```

## Setting Up GitHub Actions for Automated Builds (Optional)

Create a file at `.github/workflows/docker-publish.yml` with the following content:

```yaml
name: Docker

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata for backend
        id: meta-backend
        uses: docker/metadata-action@v4
        with:
          images: ghcr.io/${{ github.repository }}-backend

      - name: Build and push backend image
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: ${{ steps.meta-backend.outputs.tags }}
          labels: ${{ steps.meta-backend.outputs.labels }}

      - name: Extract metadata for frontend
        id: meta-frontend
        uses: docker/metadata-action@v4
        with:
          images: ghcr.io/${{ github.repository }}-frontend

      - name: Build and push frontend image
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          tags: ${{ steps.meta-frontend.outputs.tags }}
          labels: ${{ steps.meta-frontend.outputs.labels }}
```

This will automatically build and push your containers whenever you push to the main branch. 