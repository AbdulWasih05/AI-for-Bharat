/**
 * Setup Rekognition Face Collection for Nirman Mitra
 * Run once: node scripts/setup-rekognition.js
 *
 * Creates the 'nirman-mitra-workers' collection in ap-south-1.
 * Safe to re-run — skips if collection already exists.
 */

import {
  RekognitionClient,
  CreateCollectionCommand,
  DescribeCollectionCommand,
} from '@aws-sdk/client-rekognition';

const REGION = process.env.AWS_REGION || 'ap-south-1';
const COLLECTION_ID = process.env.REKOGNITION_COLLECTION_ID || 'nirman-mitra-workers';

const client = new RekognitionClient({ region: REGION });

async function main() {
  console.log(`Setting up Rekognition collection: ${COLLECTION_ID} in ${REGION}\n`);

  // Check if collection already exists
  try {
    const desc = await client.send(
      new DescribeCollectionCommand({ CollectionId: COLLECTION_ID }),
    );
    console.log(`Collection already exists!`);
    console.log(`  Face count: ${desc.FaceCount}`);
    console.log(`  Model version: ${desc.FaceModelVersion}`);
    console.log(`  Created: ${desc.CreationTimestamp}`);
    console.log(`\nNo action needed.`);
    return;
  } catch (err) {
    if (err.name !== 'ResourceNotFoundException') {
      throw err;
    }
  }

  // Create collection
  const result = await client.send(
    new CreateCollectionCommand({ CollectionId: COLLECTION_ID }),
  );

  console.log(`Collection created successfully!`);
  console.log(`  Collection ARN: ${result.CollectionArn}`);
  console.log(`  Face model version: ${result.FaceModelVersion}`);
  console.log(`  Status code: ${result.StatusCode}`);
  console.log(`\nFace enrollment will now work during worker registration.`);
}

main().catch((err) => {
  console.error('Failed to setup Rekognition collection:', err.message);
  process.exit(1);
});
