-- ============================================================
-- 000015: پیام‌های تماس (contact_messages)
-- ============================================================

-- UP

CREATE TABLE contact_messages (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name              VARCHAR(255)    NOT NULL,
    email             VARCHAR(255)    NULL,
    phone             VARCHAR(32)     NULL,
    subject           VARCHAR(255)    NOT NULL,
    message           TEXT            NOT NULL,
    type              ENUM ('contact','suggestion','complaint','other') NOT NULL DEFAULT 'contact',
    status            ENUM ('new','in_review','contacted','closed') NOT NULL DEFAULT 'new',
    assigned_admin_id BIGINT UNSIGNED NULL,
    ip_address        VARCHAR(45)     NULL,
    user_agent        VARCHAR(255)    NULL,
    privacy_accepted  BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP NULL DEFAULT NULL,
    updated_at        TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX contact_messages_status_index (status),
    INDEX contact_messages_type_index (type),
    INDEX contact_messages_assigned_admin_id_index (assigned_admin_id),
    CONSTRAINT contact_messages_assigned_admin_id_foreign
        FOREIGN KEY (assigned_admin_id) REFERENCES admins (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS contact_messages;
