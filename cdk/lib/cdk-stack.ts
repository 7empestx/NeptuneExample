import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2"; // Import EC2 for VPC
import * as neptune from "@aws-cdk/aws-neptune-alpha";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a new VPC
    const vpc = new ec2.Vpc(this, "MyVPC", {
      maxAzs: 2, // Default is all AZs in the region
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "PublicSubnet",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "PrivateSubnet",
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        },
      ],
    });

    // Assuming `vpc` is your VPC object
    // Create a security group for the bastion host that allows SSH access
    const bastionSecurityGroup = new ec2.SecurityGroup(
      this,
      "BastionSecurityGroup",
      {
        vpc,
        description: "Allow ssh access to ec2 instances",
        allowAllOutbound: true, // Can be set to false if you know the specific outbound ports needed
      },
    );
    bastionSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH access from anywhere",
    );

    // Create the bastion host EC2 instance
    const bastionHost = new ec2.Instance(this, "BastionHost", {
      vpc,
      instanceType: new ec2.InstanceType("t3.micro"), // or any suitable instance type
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      securityGroup: bastionSecurityGroup,
      keyName: "your-key-pair-name", // Ensure you have this key pair created in your AWS account
    });

    console.log(`Bastion Host Public IP: ${bastionHost.instancePublicIp}`);

    // Create Neptune cluster
    const cluster = new neptune.DatabaseCluster(this, "NeptuneCluster", {
      instanceType: neptune.InstanceType.T3_MEDIUM,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      vpc: vpc, // Use the created VPC
    });
  }
}
