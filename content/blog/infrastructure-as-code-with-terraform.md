---
title: "Infrastructure as Code with Terraform: A Practical Guide"
description: "Learn how to manage your cloud infrastructure declaratively using Terraform"
date: "2025-07-18"
tags: ["Terraform", "IaC", "AWS", "DevOps"]
author: "Edi Riyanto"
read_time: "10 min read"
published: true
---

# Infrastructure as Code with Terraform: A Practical Guide

Infrastructure as Code (IaC) is a practice where you manage and provision infrastructure through machine-readable configuration files rather than manual processes. Terraform by HashiCorp is one of the most popular IaC tools, supporting multiple cloud providers.

## Why Terraform?

Terraform uses a declarative approach — you describe the **desired state** of your infrastructure, and Terraform figures out how to achieve it.

### Key Benefits

- **Multi-cloud support** — AWS, GCP, Azure, and 100+ other providers
- **State management** — Tracks actual vs. desired state
- **Plan & apply** — Preview changes before applying them
- **Modular** — Reuse infrastructure components
- **Open source** — Large community and extensive documentation

## Installing Terraform

```bash
# macOS (Homebrew)
brew install terraform

# Linux (binary)
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# Verify
terraform --version
```

## Your First Terraform Configuration

Create a file named `main.tf`:

```hcl
# Configure the AWS provider
provider "aws" {
  region = "ap-southeast-1"
}

# Create an S3 bucket
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-unique-app-storage-bucket"

  tags = {
    Name        = "My App Storage"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

# Enable versioning
resource "aws_s3_bucket_versioning" "my_bucket" {
  bucket = aws_s3_bucket.my_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}
```

## Essential Terraform Commands

```bash
# Initialize the working directory
terraform init

# Format the configuration files
terraform fmt

# Validate the configuration
terraform validate

# Preview the changes
terraform plan -out=tfplan

# Apply the changes
terraform apply tfplan

# Show the current state
terraform show

# List all resources
terraform state list

# Destroy all resources
terraform destroy
```

## Working with Variables

Create a `variables.tf` file:

```hcl
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    ManagedBy = "Terraform"
    Project   = "DevOps"
  }
}
```

Use variables in your configuration:

```hcl
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-app-${var.environment}-bucket"

  tags = merge(var.tags, {
    Environment = var.environment
  })
}
```

Override defaults at apply time:

```bash
terraform apply -var="environment=staging"
```

## Remote State with S3

For team collaboration, use S3 as the backend:

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

The DynamoDB table enables **state locking** — preventing concurrent modifications.

## Modules: Reuse Infrastructure

Create a module at `modules/ec2-instance/main.tf`:

```hcl
variable "instance_type" { type = string }
variable "ami_id"        { type = string }
variable "tags"          { type = map(string) }

resource "aws_instance" "app" {
  ami           = var.ami_id
  instance_type = var.instance_type
  tags          = var.tags
}
```

Use the module:

```hcl
module "web_server" {
  source        = "./modules/ec2-instance"
  instance_type = "t3.medium"
  ami_id        = "ami-0c55b159cbfafe1f0"
  tags = {
    Name = "Web Server"
  }
}
```

## Best Practices

1. **Always run `terraform plan` before `apply`** — Review the execution plan carefully
2. **Use remote state** — Never store state in version control
3. **Enable state locking** — Use DynamoDB or equivalent
4. **Use workspaces** — Separate environments (dev/staging/prod)
5. **Pin provider versions** — Avoid unexpected upgrades
6. **Use `.gitignore`** — Exclude `.tfstate` files and `terraform.d/`

## Conclusion

Terraform transforms how we manage infrastructure. By treating infrastructure as code, you gain version control, reproducibility, and collaboration capabilities that are essential for modern DevOps practices.

In the next article, we'll explore Terraform modules and how to structure a production-grade IaC project.

---

*Questions or feedback? Connect with me on LinkedIn!*
