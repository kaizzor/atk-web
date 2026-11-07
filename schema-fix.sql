-- Jalankan SETELAH insert.sql (dump asli kamu kurang tabel ini).
ALTER TABLE users ADD COLUMN foto VARCHAR(255) DEFAULT NULL;
-- (kalau muncul error 'Duplicate column name foto', abaikan, artinya kolomnya sudah ada)

CREATE TABLE IF NOT EXISTS transactions (
  tranid VARCHAR(10) NOT NULL PRIMARY KEY,
  user_id VARCHAR(10) DEFAULT NULL,
  supplier_id VARCHAR(10) DEFAULT NULL,
  transaction_type VARCHAR(5) NOT NULL,
  transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transaction_details (
  id VARCHAR(10) NOT NULL PRIMARY KEY,
  transaction_id VARCHAR(10) NOT NULL,
  product_id VARCHAR(10) NOT NULL,
  quantity INT NOT NULL,
  hargaSatuan DECIMAL(10,2) DEFAULT 0,
  note TEXT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS stocklog (
  stokid VARCHAR(36) NOT NULL PRIMARY KEY,
  product_id VARCHAR(10) NOT NULL,
  change_type VARCHAR(10) NOT NULL,
  quantity INT NOT NULL,
  transaction_id VARCHAR(10) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Akun demo (password: Demo@12345). User lama di insert.sql passwordnya plaintext, jadi nggak bisa login (backend pakai bcrypt).
INSERT IGNORE INTO users (id, username, password, email, created_at)
VALUES ('demo', 'demo', '$2b$10$vAlmYzDBghNFQ5suLdIUVe7r2APYrxu4Xse2mQKofKOKhgEq4qX6W', 'demo@example.com', NOW());
