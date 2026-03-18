-- Create type_operations table
CREATE TABLE IF NOT EXISTS type_operations (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  categorie VARCHAR(50) NOT NULL CHECK (categorie IN ('cotisation', 'don', 'depense', 'autres')),
  type VARCHAR(50) NOT NULL CHECK (type IN ('debit', 'credit')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telephone VARCHAR(20),
  role VARCHAR(50) NOT NULL DEFAULT 'membre' CHECK (role IN ('admin', 'tresorier', 'membre')),
  password VARCHAR(255) NOT NULL,
  email_verified_at TIMESTAMP,
  remember_token VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create membres table
CREATE TABLE IF NOT EXISTS membres (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  telephone VARCHAR(20),
  date_naissance DATE,
  adresse TEXT,
  situation_matrimoniale VARCHAR(50),
  profession VARCHAR(100),
  date_adhesion DATE NOT NULL,
  statut VARCHAR(50) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
  photo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create operations table
CREATE TABLE IF NOT EXISTS operations (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE DEFAULT gen_random_uuid(),
  membre_id INTEGER NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
  type_operation_id INTEGER NOT NULL REFERENCES type_operations(id),
  montant DECIMAL(12, 2) NOT NULL,
  date_operation DATE NOT NULL,
  mois_cotisation VARCHAR(7),
  description TEXT,
  mode_paiement VARCHAR(50) NOT NULL DEFAULT 'espece' CHECK (mode_paiement IN ('espece', 'mobile_money')),
  reference_paiement VARCHAR(100),
  statut VARCHAR(50) NOT NULL DEFAULT 'valide' CHECK (statut IN ('valide', 'annule', 'en_attente')),
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  CONSTRAINT fk_operations_membre FOREIGN KEY (membre_id) REFERENCES membres(id) ON DELETE CASCADE,
  CONSTRAINT fk_operations_type FOREIGN KEY (type_operation_id) REFERENCES type_operations(id),
  CONSTRAINT fk_operations_user FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_operations_date_membre ON operations(date_operation, membre_id);
CREATE INDEX IF NOT EXISTS idx_operations_mois ON operations(mois_cotisation);
CREATE INDEX IF NOT EXISTS idx_membres_user ON membres(user_id);
CREATE INDEX IF NOT EXISTS idx_operations_type ON operations(type_operation_id);
CREATE INDEX IF NOT EXISTS idx_operations_status ON operations(statut);

-- Insert default operation types
INSERT INTO type_operations (nom, categorie, type, description) 
VALUES 
  ('Cotisation Mensuelle', 'cotisation', 'credit', 'Cotisation mensuels des membres'),
  ('Don', 'don', 'credit', 'Donations volontaires'),
  ('Électricité', 'depense', 'debit', 'Frais d''électricité'),
  ('Fournitures', 'depense', 'debit', 'Achat de fournitures'),
  ('Transport', 'depense', 'debit', 'Frais de transport'),
  ('Autres revenus', 'autres', 'credit', 'Autres sources de revenus'),
  ('Autres dépenses', 'autres', 'debit', 'Autres dépenses')
ON CONFLICT DO NOTHING;
