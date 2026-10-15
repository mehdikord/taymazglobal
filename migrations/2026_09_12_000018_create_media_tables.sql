-- ============================================================
-- 000018: کتابخانه رسانه (media_folders, media_items)
-- ============================================================

-- UP

CREATE TABLE media_folders (
    id         BIGINT NOT NULL AUTO_INCREMENT,
    name       VARCHAR(255) NOT NULL,
    slug       VARCHAR(255) NOT NULL,
    sort_order INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX media_folders_slug_unique (slug),
    INDEX media_folders_sort_order_index (sort_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE media_items (
    id            BIGINT NOT NULL AUTO_INCREMENT,
    folder_id     BIGINT NULL,
    type          ENUM ('image','video','pdf','other') NOT NULL DEFAULT 'image',
    original_name VARCHAR(255) NOT NULL,
    filename      VARCHAR(255) NOT NULL,
    path          VARCHAR(255) NOT NULL,
    mime_type     VARCHAR(100) NOT NULL,
    size_bytes    BIGINT UNSIGNED NOT NULL DEFAULT 0,
    alt_text      VARCHAR(255) NULL,
    uploaded_by_id BIGINT NULL,
    created_at    TIMESTAMP NULL DEFAULT NULL,
    updated_at    TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX media_items_path_unique (path),
    INDEX media_items_folder_id_index (folder_id),
    INDEX media_items_type_index (type),
    INDEX media_items_uploaded_by_id_index (uploaded_by_id),
    INDEX media_items_created_at_index (created_at),
    CONSTRAINT media_items_folder_id_foreign
        FOREIGN KEY (folder_id) REFERENCES media_folders (id) ON DELETE SET NULL,
    CONSTRAINT media_items_uploaded_by_id_foreign
        FOREIGN KEY (uploaded_by_id) REFERENCES admins (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS media_items;
DROP TABLE IF EXISTS media_folders;