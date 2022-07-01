
import { ITaggable, TagManager, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Construct } from 'constructs';
// import { Vpc, IVpc, NatProvider, SecurityGroup, InstanceType } from "aws-cdk-lib/aws-ec2";
// import * as s3 from "aws-cdk-lib/aws-s3";

export interface AcmProps {
  project_name: string;
  tld: string,
}

// cidrRange: "192.168.0.0/16", azs: 1

export class BasicCert extends Construct implements ITaggable {

  public readonly tags: TagManager;
  public readonly cert: acm.ICertificate;
  public readonly tld: route53.IHostedZone;

  constructor(scope: Construct, id: string, props: AcmProps) {
    super(scope, id);

    this.tld = new route53.HostedZone(this, `${props.tld}-tld-hz`, {
      zoneName: props.tld,
    });


    let wildcardUrl = `*.${props.tld}`
    this.cert = new acm.Certificate(this, 'Certificate', {
      domainName: props.tld,
      subjectAlternativeNames: [`*.${props.tld}`],
      validation: acm.CertificateValidation.fromDnsMultiZone({
        tld: this.tld,
        wildcardUrl: this.tld,
      }),
    });
  }
}
