# AWS Integration Setup for GitHub Actions

This document explains how to set up the AWS integration for GitHub Actions in the CineLinker project.

## Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### AWS Credentials (Common for all environments)

- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
- `AWS_REGION`: The AWS region to deploy to (e.g., `us-west-2`)

### Development Environment Secrets

#### For Server Deployment (ECR)

- `DEV_ECR_REPOSITORY`: The name of your ECR repository (e.g., `cinelinker-server`)

#### For Web Deployment (AWS Amplify)

- `DEV_AMPLIFY_APP_ID`: The ID of your Amplify app (e.g., `d1234abcdef`)
- `DEV_AMPLIFY_BRANCH`: The branch name in Amplify (e.g., `develop`)

### Production Environment Secrets

If you want to set up production deployment, you'll need to add similar secrets with a `PROD_` prefix.

## AWS Resources Setup

Before you can use the deployment scripts, you need to set up the following AWS resources:

### For Server Deployment

1. **Create an ECR Repository**:
   ```bash
   aws ecr create-repository --repository-name cinelinker-server --region us-west-2
   ```

   This will create a repository to store your Docker images. Note the repository URI in the output, which will be in the format `123456789012.dkr.ecr.us-west-2.amazonaws.com/cinelinker-server`.

### For Web Deployment (AWS Amplify)

1. **Create an Amplify App**:
   You can create an Amplify app through the AWS Console or using the AWS CLI:
   ```bash
   aws amplify create-app --name cinelinker --platform WEB --region us-west-2
   ```

2. **Create a Branch**:
   ```bash
   aws amplify create-branch --app-id YOUR_APP_ID --branch-name develop --region us-west-2
   ```

## IAM User Setup

Create an IAM user with programmatic access and attach the following policies:

1. For ECR access:
   - `AmazonECR-FullAccess`

2. For AWS Amplify access:
   - `AmplifyFullAccess`

Alternatively, you can create a custom policy with more restricted permissions for better security:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "amplify:CreateDeployment",
        "amplify:StartDeployment",
        "amplify:GetApp",
        "amplify:GetBranch",
        "amplify:GetJob",
        "amplify:ListJobs",
        "amplify:UploadDeployment"
      ],
      "Resource": "*"
    }
  ]
}
```

## Adding Secrets to GitHub

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click on "New repository secret"
4. Add each of the secrets listed above

## Testing the Workflow

After setting up all the required secrets and AWS resources, you can test the workflow by:

1. Making a change to your code
2. Pushing it to a feature branch
3. The workflow should automatically run and deploy your changes to the development environment

You can also manually trigger the workflow from the GitHub Actions tab.
