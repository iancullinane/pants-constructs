
import { ITaggable, TagManager, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from 'constructs';
import * as s3 from "aws-cdk-lib/aws-s3";

export interface S3BucketProps {
  bucketName: string;
  destroyOnDelete?: string;
}

export class AllPurposeBucket extends Construct implements ITaggable {

  public readonly tags: TagManager;
  public bucket: s3.IBucket;

  constructor(scope: Construct, id: string, props: S3BucketProps) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, `bucket-${props.bucketName}`, {
      bucketName: props.bucketName,
    });

    (props.destroyOnDelete === "yes"
      ? this.bucket.applyRemovalPolicy(RemovalPolicy.DESTROY)
      : null);


  }
}
