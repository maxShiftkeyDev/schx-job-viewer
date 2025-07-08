# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD of the SAM application.

## SAM Deploy to Dev Workflow

The `sam-deploy.yml` workflow automatically validates, builds, and deploys the SAM application when code is merged into the `dev` branch.

### What it does:

1. **Triggers on**:

   - Push to `dev` branch
   - Pull requests to `dev` branch

2. **Validation Phase**:

   - Validates SAM template syntax
   - Runs tests (if available)
   - Installs dependencies

3. **Build Phase**:

   - Builds SAM application with parallel processing
   - Creates deployment artifacts

4. **Deploy Phase** (only on push to dev):
   - Deploys to AWS using SAM
   - Creates/updates CloudFormation stack: `schx-job-viewer-dev`

### Required GitHub Secrets

You need to configure these secrets in your GitHub repository settings:

- `AWS_ACCESS_KEY_ID`: AWS access key with permissions to deploy SAM applications
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key

### AWS Permissions Required

The AWS credentials need permissions for:

- CloudFormation (create/update stacks)
- S3 (for SAM artifacts)
- Lambda (create/update functions)
- API Gateway (create/update APIs)
- DynamoDB (create/update tables)
- IAM (create/update roles)

### Environment Variables

- `AWS_REGION`: Set to `us-east-1` (modify as needed)
- `STACK_NAME`: Set to `schx-job-viewer-dev`

### Customization

To modify the workflow:

1. Change the AWS region in the `env` section
2. Update the stack name if needed
3. Add additional validation steps
4. Modify deployment parameters in the `sam deploy` command

### Troubleshooting

- Check the Actions tab in GitHub for detailed logs
- Ensure AWS credentials have proper permissions
- Verify the SAM template is valid locally first
