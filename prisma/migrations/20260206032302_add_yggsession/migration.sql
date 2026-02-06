-- CreateTable
CREATE UNLOGGED TABLE "YggSession" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "profileName" TEXT NOT NULL,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YggSession_pkey" PRIMARY KEY ("id")
);
