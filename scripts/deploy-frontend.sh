#!/usr/bin/env bash
# deploy-frontend.sh — Build and deploy admin dashboard to S3 static website
# Usage: ./scripts/deploy-frontend.sh <stack-name> [region]
set -euo pipefail

STACK_NAME="${1:?Usage: deploy-frontend.sh <stack-name> [region]}"
REGION="${2:-ap-south-1}"

echo "==> Fetching stack outputs from ${STACK_NAME}..."
API_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text)

BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" \
  --output text)

SITE_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendUrl'].OutputValue" \
  --output text)

echo "   API_URL  = ${API_URL}"
echo "   BUCKET   = ${BUCKET}"
echo "   SITE_URL = ${SITE_URL}"

echo "==> Building frontend..."
cd "$(dirname "$0")/../admin-dashboard"
VITE_API_URL="$API_URL" npm run build

echo "==> Syncing to S3..."
aws s3 sync dist/ "s3://${BUCKET}" --delete --region "$REGION"

echo ""
echo "==> Dashboard deployed!"
echo "    ${SITE_URL}"
