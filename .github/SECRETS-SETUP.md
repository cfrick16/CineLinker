# Setting Up GitHub Secrets for AWS Integration

This guide explains how to add the required secrets to your GitHub repository for the AWS integration.

## Required Secrets

You need to add the following secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
- `AWS_REGION`: The AWS region to deploy to (e.g., `us-west-2`)
- `DEV_ECR_REPOSITORY`: The name of your ECR repository (e.g., `cinelinker-server`)
- `DEV_AMPLIFY_APP_ID`: The ID of your Amplify app (e.g., `d1234abcdef`)
- `DEV_AMPLIFY_BRANCH`: The branch name in Amplify (e.g., `develop`)

## Step-by-Step Instructions

1. **Navigate to your GitHub repository**

2. **Go to the repository settings**
   - Click on the "Settings" tab at the top of your repository page

3. **Access the Secrets and variables section**
   - In the left sidebar, click on "Secrets and variables"
   - Select "Actions" from the dropdown menu

4. **Add a new repository secret**
   - Click on the "New repository secret" button
   - Enter the name of the secret (e.g., `AWS_ACCESS_KEY_ID`)
   - Enter the value of the secret
   - Click "Add secret"

5. **Repeat for all required secrets**
   - Repeat step 4 for each of the required secrets listed above

## Visual Guide

Here's what the process looks like:

1. Go to your repository and click on "Settings":
   ```
   https://github.com/username/cinelinker/settings
   ```

2. In the left sidebar, click on "Secrets and variables" > "Actions":
   ```
   https://github.com/username/cinelinker/settings/secrets/actions
   ```

3. Click on "New repository secret":
   ```
   Name: AWS_ACCESS_KEY_ID
   Secret: AKIAIOSFODNN7EXAMPLE
   ```

4. Click "Add secret" and repeat for all required secrets.

## Obtaining the Secret Values

### AWS Credentials

1. **AWS Access Key ID and Secret Access Key**
   - Log in to the AWS Management Console
   - Click on your username in the top right corner
   - Select "Security credentials"
   - Under "Access keys", click "Create access key"
   - Save the Access key ID and Secret access key

2. **AWS Region**
   - Use the region where your AWS resources are located (e.g., `us-west-2`)

### ECR Repository

1. **ECR Repository Name**
   - This is the name you gave to your ECR repository when you created it
   - You can find it in the ECR console: https://console.aws.amazon.com/ecr/repositories

### Amplify App

1. **Amplify App ID**
   - Go to the AWS Amplify Console: https://console.aws.amazon.com/amplify/home
   - Click on your app
   - The App ID is in the URL: `https://console.aws.amazon.com/amplify/home?region=us-west-2#/d1234abcdef/...`
   - In this example, `d1234abcdef` is the App ID

2. **Amplify Branch**
   - This is the name of the branch you want to deploy to (e.g., `develop`)
   - You can find it in the Amplify Console under your app's branches
