
import { ITaggable, TagManager, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { Vpc, IVpc, NatProvider, SecurityGroup, InstanceType } from "aws-cdk-lib/aws-ec2";
import { Construct } from 'constructs';
// import * as s3 from "aws-cdk-lib/aws-s3";

export interface VpcProps {
  project_name: string;
  cidrRange?: string;
  natInstanceType?: string;
  azs?: number;
}

// cidrRange: "192.168.0.0/16", azs: 1

export class SimpleVpc extends Construct implements ITaggable {

  public readonly tags: TagManager;
  public vpc: IVpc;

  constructor(scope: Construct, id: string, props: VpcProps) {
    super(scope, id);

    if (props.natInstanceType === undefined) {
      props.natInstanceType = "t2.micro";
    }

    props.azs === undefined ? props.azs = 1 : null;
    props.natInstanceType === undefined ? props.azs = 1 : null;
    props.cidrRange === undefined ? props.cidrRange = "192.168.0.0/16" : null;

    // Configure the `natGatewayProvider` when defining a Vpc
    const natGatewayProvider = NatProvider.instance({
      instanceType: new InstanceType(props.natInstanceType),
    });

    // The code that defines your stack goes here
    this.vpc = new Vpc(this, `base-vpc-${props.project_name}`, {
      cidr: props.cidrRange,
      maxAzs: props.azs,
      natGatewayProvider: natGatewayProvider,
    });

    const vpcSG = new SecurityGroup(this, 'SG', { vpc: this.vpc });
    this.vpc = this.vpc;

    new CfnOutput(this, `${props.project_name}-sg-id`, {
      value: vpcSG.securityGroupId,
      description: 'The core vpc security group ID',
      exportName: `core-vpc-${props.project_name}-sg-id`,
    });
    new CfnOutput(this, `${props.project_name}-vpc-id`, {
      value: this.vpc.vpcId,
      description: 'The core vpc ID',
      exportName: `core-vpc-${props.project_name}-vpc-id`,
    });

  }
}
