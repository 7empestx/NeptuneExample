import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'; // Import EC2 for VPC
import * as neptune from '@aws-cdk/aws-neptune-alpha';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a new VPC
    const vpc = new ec2.Vpc(this, 'MyVPC', {
      maxAzs: 2, // Default is all AZs in the region
      subnetConfiguration: [{
        cidrMask: 24,
        name: 'PublicSubnet',
        subnetType: ec2.SubnetType.PUBLIC,
      }, {
        cidrMask: 24,
        name: 'PrivateSubnet',
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
      }]
    });

    // Create Neptune cluster
    const cluster = new neptune.DatabaseCluster(this, 'NeptuneCluster', {
      instanceType: neptune.InstanceType.T3_MEDIUM,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      vpc: vpc, // Use the created VPC
    });
  }
}
