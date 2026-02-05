# Prosopon

<i>Prosopon is a lightweight Minecraft identity manager</i>

![GitHub Release](https://img.shields.io/github/v/release/ravachol-yang/prosopon)
![GitHub License](https://img.shields.io/github/license/ravachol-yang/prosopon)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/ravachol-yang/prosopon/ci.yml)

## Getting Started

Prosopon is a Minecraft identity manager with multiprofile, texture (both skin and cape) management and Yggdrasil api compatibility based on Next.js.

It's designed for small community and fast, serverless deployment

## Configuration

Requirements:

- a PostgreSQL database
- an S3-compatible object storage (Remember to configure CORS policy)
- an Upstash Redis storage
- an RSA keypair (see [authlib-injector docs](https://github.com/yushijinhun/authlib-injector/wiki/%E7%AD%BE%E5%90%8D%E5%AF%86%E9%92%A5%E5%AF%B9))

All **required environment variables**:

Site info:

```dotenv
# (Required) your site domain, required for profile uuid generation
SITE_DOMAIN=""

# (Required) domain of your texture host. see Yggdrasil docs
TEXTURE_DOMAIN=""
```

Database:

```dotenv
# (Required) Postgres database url
DATABASE_URL=""
```

Session storage:

```dotenv
# (Required) Upstash Redis credentials, for session storage
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

Texture storage:

```dotenv
# (Required) S3-compatible storage credentials, for storing textures
S3_ENDPOINT=""
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_BUCKET_NAME=""
```

Cryptography:

```dotenv
# (Required) secret for jwt signing
APP_SECRET=""

# (Required) RSA key pair in base64, for yggdrasil texture signing
RSA_PUBKEY_B64=""
RSA_PRIVKEY_B64=""
```

> [!TIP]
> see `.env.example` for all supported environment variables.

## Deploy on Vercel

You can deploy this application by forking this repo and importing it into Vercel.

Download`.env.example`, fill in it and upload to vercel (or manually fill in the environment variables) before deploying.

## Manually Build

Preparing.

```bash
git clone https://github.com/ravachol-yang/prosopon.git
cd prosopon
pnpm install
cp .env.exmaple .env
```

Fill in the `.env`and build the app.

```bash
pnpm run build
```

Running.

```bash
pnpm run start
```

## Usage

First deployment creates a default `ADMIN` with email `prosopon@example.com` and password `prosopon`, log into the dashboard, create your first `Profile` and upload `Texture`s for it, `ADMIN`s can create `Invite`s for their friends to join.

> [!NOTE]
> This project is designed for personal community, invite verification is required\*

See [authlib-injector](https://github.com/yushijinhun/authlib-injector) docs for integration with supported launchers and usage on Minecraft servers.

## See also

[Yggdrasil Server-side Specs](https://github.com/yushijinhun/authlib-injector/wiki/Yggdrasil-%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%8A%80%E6%9C%AF%E8%A7%84%E8%8C%83)

[Use authlib-injector on Minecraft servers](https://github.com/yushijinhun/authlib-injector/wiki/%E5%9C%A8-Minecraft-%E6%9C%8D%E5%8A%A1%E7%AB%AF%E4%BD%BF%E7%94%A8-authlib-injector)
