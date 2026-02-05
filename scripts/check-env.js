import "dotenv/config";

const requiredEnvVars = [
  "DATABASE_URL",

  "S3_ENDPOINT",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
  "S3_BUCKET_NAME",

  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",

  "APP_SECRET",
  "RSA_PUBKEY_B64",
  "RSA_PRIVKEY_B64",

  "TEXTURE_DOMAIN",
  "TEXTURE_PREFIX",
  "SITE_DOMAIN",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("The following environment variables are missing:");
  missingVars.forEach((varName) => console.error(`- ${varName}`));
  process.exit(1);
} else {
  console.log("Env check passed !");
}
