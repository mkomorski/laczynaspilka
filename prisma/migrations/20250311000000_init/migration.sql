-- CreateTable
CREATE TABLE "subscribers" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(64),
    "match_id" VARCHAR(32) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_match_id_email_key" ON "subscribers"("match_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_match_id_phone_key" ON "subscribers"("match_id", "phone");
