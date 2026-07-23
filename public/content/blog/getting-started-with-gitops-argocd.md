---
title: "Getting Started with GitOps Using Argo CD"
description: "Learn how to implement GitOps workflows with Argo CD to automate your Kubernetes deployments"
date: "2025-07-20"
tags: ["GitOps", "Argo CD", "Kubernetes", "DevOps"]
author: "Edi Riyanto"
read_time: "8 min read"
published: true
---

# Getting Started with GitOps Using Argo CD

GitOps is a modern approach to continuous delivery that uses Git as the single source of truth for declarative infrastructure and applications. In this article, we'll explore how to implement GitOps using Argo CD.

## What is GitOps?

GitOps is a set of practices that use Git repositories as the single source of truth for declarative infrastructure and applications. With GitOps, all your configuration lives in Git, making it easy to:

- **Track changes** — Every change is versioned and auditable
- **Roll back** — Revert to any previous state with a single command
- **Collaborate** — Use pull requests for infrastructure changes
- **Automate** — Changes to Git automatically trigger deployments

## Why Argo CD?

Argo CD is a declarative, GitOps-native continuous delivery tool for Kubernetes. It follows the GitOps pattern by using Git repositories as the source of truth for defining the desired application state.

### Key Features of Argo CD

- **Automated deployment** — Monitors Git and automatically syncs changes to Kubernetes
- **Multi-cluster support** — Manage applications across multiple clusters
- **Rollback** — One-click rollback to any previous version
- **Visual UI** — See your application status at a glance
- **SSO integration** — Supports OAuth2, OIDC, LDAP, and more

## Prerequisites

Before we begin, make sure you have:

- A running Kubernetes cluster (EKS, GKE, or local with kind/minikube)
- `kubectl` configured to access your cluster
- A Git repository for your application manifests
- Helm or Kustomize (optional but recommended)

## Installing Argo CD

```bash
# Create a new namespace for Argo CD
kubectl create namespace argocd

# Install Argo CD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access the Argo CD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

## Connecting Your Repository

Once Argo CD is running, connect your Git repository:

1. Open the Argo CD UI at `https://localhost:8080`
2. Login with the default username: `admin`
3. Get the password: `kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d`
4. Go to **Settings → Repositories → Connect Repo**
5. Enter your repository URL

## Creating Your First Application

Create an Application manifest:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/yourusername/your-repo.git
    targetRevision: HEAD
    path: manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: my-app
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

Apply it:

```bash
kubectl apply -f application.yaml
```

## Conclusion

GitOps with Argo CD provides a powerful, declarative way to manage your Kubernetes applications. By keeping everything in Git, you gain version control, auditability, and easy rollbacks.

In the next article, we'll dive deeper into advanced Argo CD patterns including ApplicationSets, multi-cluster deployments, and secrets management.

---

*Have questions? Feel free to reach out on LinkedIn or GitHub!*
