import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as r53 from "aws-cdk-lib/aws-route53";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";


export interface HzLookUpProps extends cdk.NestedStackProps {
  domainName: string,
}

export class HostedZoneLookupStack extends cdk.NestedStack {
  public readonly hz: r53.IHostedZone;

  constructor(scope: Construct, id: string, props: HzLookUpProps) {
    super(scope, id, props);
    this.hz = r53.HostedZone.fromLookup(this, `Zone-${props.domainName}`, { domainName: props.domainName });
  }
}

export interface LookUpProps extends cdk.NestedStackProps {
  vpcId: string,
  sgId: string,
  domainname: string,
  subdomain: string,
}

// Provides lookups from an existing environment, nested so the underlying
// lookups can be updated 
export class ResourceLookupStack extends cdk.NestedStack {

  // Export the results
  public readonly vpc: ec2.IVpc;
  public readonly sg: ec2.ISecurityGroup;
  public readonly hz: r53.IHostedZone;
  public readonly vol: ec2.IVolume;

  // TODO::Make a real props object to make this not hardcoded
  constructor(scope: Construct, id: string, props?: LookUpProps) {
    super(scope, id, props);

    if (props === undefined) {
      console.log("TODO");
      return
    }

    // Expects you to know VPC name
    // Could also do an Fn.Import
    this.vpc = ec2.Vpc.fromLookup(this, props.vpcId, {
      vpcId: props?.vpcId
    });

    this.sg = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      `vpc-security-group-${this.vpc.vpcId}`,
      props.sgId
    );

    this.vol = new ec2.Volume(this, `${props.domainname}-vol`, {
      availabilityZone: 'us-east-2a',
      size: cdk.Size.gibibytes(20),
    });
    cdk.Tags.of(this.vol).add("game", `pz-${props.subdomain}-vol`);
    cdk.Tags.of(this.vol).add("Name", `pz-${props.subdomain}-vol`);


    // This method is preferred because using the `fromHostedZone` lookup
    // causes you to lose the zone name, which is used downstream
    this.hz = r53.HostedZone.fromLookup(this, `Zone-${props.domainname}`, { domainName: props.domainname });
    // this.hz = r53.HostedZone.fromHostedZoneId(this, `${props.subdomain}-hz`, props.hostedZoneID)
    // this.hz = r53.HostedZone.fromHostedZoneAttributes(
    //   this,
    //   `${props.hostedZoneName}.com-${props.hostedZoneID}`,
    //   { zoneName: props.hostedZoneName, hostedZoneId: props.hostedZoneID }
    // );
  }

}
