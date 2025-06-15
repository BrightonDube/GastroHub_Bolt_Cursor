-- Messaging System
CREATE TABLE IF NOT EXISTS conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    body text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Invoice Management
CREATE TABLE IF NOT EXISTS invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    supplier_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    buyer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    status text CHECK (status IN ('draft', 'confirmed', 'sent', 'paid', 'cancelled')) DEFAULT 'draft',
    pdf_url text,
    sent_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_order_id ON conversations(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON invoices(order_id);
