const {
  GetSecretValueCommand,
  SecretsManagerClient,
} = require('@aws-sdk/client-secrets-manager');
const fs = require('fs');

/**
 * If we're running in a deployed, non-development environment,
 * access the keys and values stored in AWS Secrets Manager and assign them to Node env vars.
 */
async function initAWS() {
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `::initAWS: Non-production environment (process.env.NODE_ENV=${process.env.NODE_ENV})`,
    );
    return;
  }

  const secretId = process.env.BRAVER_SECRET_ID;
  const accessKeyId = process.env.AWS_BRAVER_API_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_BRAVER_API_SECRET_KEY;

  const exitWithMissingVariable = (name) => {
    console.error(
      `Unable to fetch AWS secrets due to missing ${name} environment variable`,
    );
    process.exit(1);
  };

  if (!secretId) {
    exitWithMissingVariable('BRAVER_SECRET_ID');
  }

  if (!accessKeyId) {
    exitWithMissingVariable('AWS_BRAVER_API_ACCESS_KEY');
  }

  if (!secretAccessKey) {
    exitWithMissingVariable('AWS_BRAVER_API_SECRET_KEY');
  }

  console.log(`AWS accessKeyId length: ${accessKeyId.length} (should be 20)`);
  console.log(
    `AWS secretAccessKey length: ${secretAccessKey.length} (should be 40)`,
  );

  const client = new SecretsManagerClient({
    region: 'us-west-2',
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  const command = new GetSecretValueCommand({
    SecretId: secretId,
  });

  let secrets;

  try {
    console.log(`Fetching secrets from AWS Secrets Manager (${secretId}) ...`);
    const data = await client.send(command);
    secrets = JSON.parse(data.SecretString);
  } catch (error) {
    console.log('Error accessing AWS Secrets Manager');
    console.error(error);
    process.exit(1);
  }

  writeEnvironmentVariables(secrets);
}

function writeEnvironmentVariables(variables) {
  const fileName = 'environment';
  const env = Object.entries(variables).reduce((env, [name, value]) => {
    // Preserve any newline characters
    value = value.replaceAll('\n', '\\n');
    if (value.includes('"')) {
      return env + `export ${name}='${value}'\n`;
    } else {
      return env + `export ${name}="${value}"\n`;
    }
  }, '');

  try {
    console.log(`Writing secrets from AWS Secrets Manager to ${fileName}`);
    fs.writeFileSync(fileName, env);
  } catch (err) {
    console.error('Error writing secrets to file');
    throw err;
  }
}

void initAWS();
