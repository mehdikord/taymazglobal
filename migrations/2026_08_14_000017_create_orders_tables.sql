-- ============================================================
-- 000017: سفارش‌ها (orders, order_logs, order_log_translations)
-- ============================================================

-- UP

CREATE TABLE orders (
    id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_number   VARCHAR(32)     NOT NULL COMMENT 'شماره سفارش',
    tracking_code  CHAR(16)        NULL COMMENT 'کد پیگیری 16 رقمی',
    user_id        BIGINT UNSIGNED NULL,
    product_id     BIGINT UNSIGNED NOT NULL,
    status         ENUM ('pending_approval','preparing','in_transit','completed','cancelled') NOT NULL DEFAULT 'pending_approval',
    destination    VARCHAR(255)    NOT NULL,
    quantity       INT UNSIGNED    NULL,
    customer_note  TEXT            NULL,
    contact_name   VARCHAR(255)    NOT NULL,
    contact_phone  VARCHAR(32)     NOT NULL,
    contact_email  VARCHAR(255)    NULL,
    terms_accepted BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMP NULL DEFAULT NULL,
    updated_at     TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX orders_order_number_unique (order_number),
    UNIQUE INDEX orders_tracking_code_unique (tracking_code),
    INDEX orders_user_id_index (user_id),
    INDEX orders_product_id_index (product_id),
    INDEX orders_status_index (status),
    CONSTRAINT orders_user_id_foreign
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT orders_product_id_foreign
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE order_logs (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id   BIGINT UNSIGNED NOT NULL,
    status     ENUM ('pending_approval','preparing','in_transit','completed','cancelled') NOT NULL,
    admin_id   BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX order_logs_order_id_index (order_id),
    INDEX order_logs_status_index (status),
    INDEX order_logs_admin_id_index (admin_id),
    CONSTRAINT order_logs_order_id_foreign
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT order_logs_admin_id_foreign
        FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE order_log_translations (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_log_id BIGINT UNSIGNED NOT NULL,
    locale       ENUM ('fa','en','tr','ru') NOT NULL,
    note         TEXT            NULL,
    created_at   TIMESTAMP NULL DEFAULT NULL,
    updated_at   TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX olt_log_locale_unique (order_log_id, locale),
    INDEX olt_locale_index (locale),
    CONSTRAINT olt_log_id_foreign
        FOREIGN KEY (order_log_id) REFERENCES order_logs (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS order_log_translations;
DROP TABLE IF EXISTS order_logs;
DROP TABLE IF EXISTS orders;
