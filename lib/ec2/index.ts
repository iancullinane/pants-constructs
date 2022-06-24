
import { ITaggable, TagManager, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from 'constructs';
// import * as s3 from "aws-cdk-lib/aws-s3";

export interface ClusterProps {
  project_name: string;
}

// cidrRange: "192.168.0.0/16", azs: 1

export class NomadClusterStack extends Construct implements ITaggable {

  // TODO::Implement launch template
  // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.LaunchTemplate.html

  public readonly tags: TagManager;
  // public vpc: IVpc;

  constructor(scope: Construct, id: string, props: ClusterProps) {
    super(scope, id);

    //   if (props.natInstanceType === undefined) {
    //     props.natInstanceType = "t2.micro";
    //   }

    //   props.azs === undefined ? props.azs = 1 : null;
    //   props.natInstanceType === undefined ? props.azs = 1 : null;
    //   props.cidrRange === undefined ? props.cidrRange = "192.168.0.0/16" : null;

    //   // Configure the `natGatewayProvider` when defining a Vpc
    //   const natGatewayProvider = NatProvider.instance({
    //     instanceType: new InstanceType(props.natInstanceType),
    //   });

    //   // The code that defines your stack goes here
    //   this.vpc = new Vpc(this, `base-vpc-${props.project_name}`, {
    //     cidr: props.cidrRange,
    //     maxAzs: props.azs,
    //     natGatewayProvider: natGatewayProvider,
    //   });

    //   const vpcSG = new SecurityGroup(this, 'SG', { vpc: this.vpc });

    //   new CfnOutput(this, `${props.project_name}-sg-id`, {
    //     value: vpcSG.securityGroupId,
    //     description: 'The core vpc security group ID',
    //     exportName: `core-vpc-${props.project_name}-sg-id`,
    //   });
    //   new CfnOutput(this, `${props.project_name}-vpc-id`, {
    //     value: this.vpc.vpcId,
    //     description: 'The core vpc ID',
    //     exportName: `core-vpc-${props.project_name}-vpc-id`,
    //   });

  }
}
