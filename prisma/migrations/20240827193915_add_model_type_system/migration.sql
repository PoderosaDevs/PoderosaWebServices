-- CreateTable
CREATE TABLE "UserTypeSystem" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "typeSystemId" INTEGER NOT NULL,

    CONSTRAINT "UserTypeSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeSystem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TypeSystem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTypeSystem_userId_typeSystemId_key" ON "UserTypeSystem"("userId", "typeSystemId");

-- CreateIndex
CREATE UNIQUE INDEX "TypeSystem_name_key" ON "TypeSystem"("name");

-- AddForeignKey
ALTER TABLE "UserTypeSystem" ADD CONSTRAINT "UserTypeSystem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTypeSystem" ADD CONSTRAINT "UserTypeSystem_typeSystemId_fkey" FOREIGN KEY ("typeSystemId") REFERENCES "TypeSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
