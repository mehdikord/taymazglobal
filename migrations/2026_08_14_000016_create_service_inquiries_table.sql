-- ============================================================
-- 000016: درخواست‌های مشاوره خدمت (service_inquiries)
-- ============================================================

-- UP

CREATE TABLE service_inquiries (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    service_id        BIGINT UNSIGNED NULL,
    name              VARCHAR(255)    NOT NULL,
    phone             VARCHAR(32)     NOT NULL,
    email             VARCHAR(255)    NULL,
    company           VARCHAR(255)    NULL,
    country           VARCHAR(255)    NULL,
    message           TEXT            NULL,
    status            ENUM ('new','in_review','contacted','closed') NOT NULL DEFAULT 'new',
    assigned_admin_id BIGINT UNSIGNED NULL,
    ip_address        VARCHAR(45)     NULL,
    user_agent        VARCHAR(255)    NULL,
    privacy_accepted  BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP NULL DEFAULT NULL,
    updated_at        TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX service_inquiries_service_id_index (service_id),
    INDEX service_inquiries_status_index (status),
    INDEX service_inquiries_assigned_admin_id_index (assigned_admin_id),
    CONSTRAINT service_inquiries_service_id_foreign
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE SET NULL,
    CONSTRAINT service_inquiries_assigned_admin_id_foreign
        FOREIGN KEY (assigned_admin_id) REFERENCES admins (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS service_inquiries;
