#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status.

echo "Starting build and deployment script..."

# Verify that AWS CLI is installed
if ! command -v aws &> /dev/null
then
    echo "AWS CLI could not be found. Please install it to proceed."
    exit 1
fi

# Verify that CDK CLI is installed
if ! command -v cdk &> /dev/null
then
    echo "AWS CDK CLI could not be found. Please install it to proceed."
    exit 1
fi

echo "Synthesizing the CDK application..."
cd cdk
cdk synth
echo "CDK application synthesized successfully."

echo "Deploying the CDK stack..."
cdk deploy --require-approval never
echo "CDK stack deployed successfully."

echo "Build and deployment script completed."
