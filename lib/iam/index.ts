import { ITaggable, NestedStackProps, TagManager } from "aws-cdk-lib";
import { Construct } from 'constructs';
import * as iam from "aws-cdk-lib/aws-iam";

export interface LambdaRoleProps extends NestedStackProps {
  lambdaName: string,
}

export class LambdaRole extends Construct implements ITaggable {

  public readonly tags: TagManager;
  public role: iam.IRole;

  constructor(scope: Construct, id: string, props: LambdaRoleProps) {
    super(scope, id);

    this.role = new iam.Role(this, `${props.lambdaName}-execution-role`, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    this.role.grant(
      new iam.ServicePrincipal("lambda.amazonaws.com"),
      "sts:AssumeRole"
    );
    // these two only required if your function lives in a VPC
    this.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaBasicExecutionRole"
      )
    );
    this.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaVPCAccessExecutionRole"
      )
    );

  }
}


