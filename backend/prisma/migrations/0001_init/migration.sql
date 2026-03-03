BEGIN TRY

BEGIN TRAN;

-- CreateSchema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'dbo') EXEC sp_executesql N'CREATE SCHEMA [dbo];';

-- CreateTable
CREATE TABLE [dbo].[Room] (
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [passwordHash] NVARCHAR(200),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Room_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Room_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Room_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[Idea] (
    [id] NVARCHAR(1000) NOT NULL,
    [roomId] NVARCHAR(1000) NOT NULL,
    [letter] NVARCHAR(1) NOT NULL,
    [description] NVARCHAR(500) NOT NULL,
    [used] BIT NOT NULL CONSTRAINT [Idea_used_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Idea_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Idea_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Idea_roomId_letter_description_key] UNIQUE NONCLUSTERED ([roomId],[letter],[description])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Idea_roomId_idx] ON [dbo].[Idea]([roomId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Idea_roomId_used_idx] ON [dbo].[Idea]([roomId], [used]);

-- AddForeignKey
ALTER TABLE [dbo].[Idea] ADD CONSTRAINT [Idea_roomId_fkey] FOREIGN KEY ([roomId]) REFERENCES [dbo].[Room]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

