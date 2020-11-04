import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import s3deploy = require('@aws-cdk/aws-s3-deployment');

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    //s3 bucket
    const pocS3Bucket = new s3.Bucket(this, 'PocS3Bucket', {
      websiteIndexDocument: 'index.html',
     publicReadAccess : true
    });

    // s3 Deployment
    new s3deploy.BucketDeployment(this, 'pocS3BucketDeploy',{
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: pocS3Bucket,
    })

    //Cloudfront (cdn of AWS)
    new cloudfront.CloudFrontWebDistribution(this, 'CFDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
          s3BucketSource: pocS3Bucket
          },
          behaviors : [ {isDefaultBehavior: true}]
        }
      ]
    });

  }
}
