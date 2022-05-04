// import * as cdk from "aws-cdk-lib";
// import { CfnOutput, ITaggable, TagManager, Tags, Stack } from "aws-cdk-lib";
// import { Construct } from 'constructs';
// import * as route53 from "aws-cdk-lib/aws-route53";
// import * as acm from "aws-cdk-lib/aws-certificatemanager";
// import * as s3 from "aws-cdk-lib/aws-s3";
// import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
// import * as targets from 'aws-cdk-lib/aws-route53-targets';
// import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
// import * as iam from "aws-cdk-lib/aws-iam";
// import * as cloudfront from "aws-cdk-lib/aws-cloudfront";

export { StaticSiteWithCloudfront } from "./s3-site/site-w-cloudfront";

// export class StaticSiteWithCloudfront;

// export interface StaticSiteProps {
//   domainName: string;
//   hostedZoneID: string;
//   siteSubDomain?: string;
//   certArn?: string;
// }


// // Ubuntu 20.04 LTS
// // const amimap: Record<string, string> = {
// //   "us-east-2": "ami-0c15a71461028f685",
// //   "us-east-1": "ami-0f5513ad02f8d23ed",
// // }

// export class StaticSite extends Construct implements ITaggable {

//   public readonly tags: TagManager;

//   constructor(scope: Construct, id: string, props: StaticSiteProps) {
//     super(scope, id);

//     const fqdn = (props.siteSubDomain)
//       ? `${props.siteSubDomain}.${props.domainName}`
//       : `${props.domainName}`;

//     const zone = route53.HostedZone.fromHostedZoneId(this, 'GMCTopLevelZone', props.hostedZoneID);

//     const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'cloudfront-OAI', {
//       comment: `OAI for ${id}`
//     });

//     // An out put value is the same as the old ones, just in code not at the bottom
//     // new cdk.CfnOutput(this, 'Site', { value: 'https://' + fqdn });

//     // Content bucket
//     // This has been divorced from the cdk and is in its own, there is a function
//     // for s3 to auto load a compiled site, maybe use that...
//     const siteBucket = new s3.Bucket(this, 'SiteBucket', {
//       bucketName: fqdn,
//       websiteIndexDocument: 'index.html',
//       websiteErrorDocument: 'error.html',
//       publicReadAccess: false,
//       blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,

//       /**
//        * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
//        * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
//        * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
//        */
//       //  THIS IS HOW TO DESTROY
//       removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code

//       /**
//        * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.  This
//        * setting will enable full cleanup of the demo.
//        */
//       autoDeleteObjects: true, // NOT recommended for production code
//     });
//     // Grant access to cloudfront
//     siteBucket.addToResourcePolicy(new iam.PolicyStatement({
//       actions: ['s3:GetObject'],
//       resources: [siteBucket.arnForObjects('*')],
//       principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
//     }));
//     new cdk.CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

//     const cert = acm.Certificate.fromCertificateArn(this, "cert", props.certArn!);


//     const viewerCertificate = cloudfront.ViewerCertificate.fromAcmCertificate(cert, {
//       sslMethod: cloudfront.SSLMethod.SNI,
//       securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
//       aliases: [fqdn]
//     })

//     // CloudFront distribution
//     const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
//       viewerCertificate,
//       originConfigs: [
//         {
//           s3OriginSource: {
//             s3BucketSource: siteBucket,
//             originAccessIdentity: cloudfrontOAI
//           },
//           behaviors: [{
//             isDefaultBehavior: true,
//             compress: true,
//             allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
//           }],
//         }
//       ]
//     });
//     new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

//     // Route53 alias record for the CloudFront distribution
//     new route53.ARecord(this, 'SiteAliasRecord', {
//       recordName: fqdn,
//       target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
//       zone
//     });

//     // Deploy site contents to S3 bucket
//     new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
//       sources: [s3deploy.Source.asset('./site-contents')],
//       destinationBucket: siteBucket,
//       distribution,
//       distributionPaths: ['/*'],
//     });

//   }
// }
