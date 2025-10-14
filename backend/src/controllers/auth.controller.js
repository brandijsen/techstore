const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');
const { getPool } = require('../config/db'); // 👈 prendi la funzione

async function registerCustomer(req, res) {
  const { name, email, password } = req.body;

  try {
    // 1. Validazione base
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e password sono obbligatori' });
    }

    // 2. Connessione DB
    const pool = await getPool();

    // 3. Controllo se l'email è già registrata
    const [existing] = await pool.query(
      'SELECT id FROM customers WHERE email = ? LIMIT 1',
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email già registrata' });
    }

    // 4. Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 5. Inserimento nuovo cliente
    const [result] = await pool.query(
      `INSERT INTO customers (name, email, password_hash) VALUES (?, ?, ?)`,
      [name, email, passwordHash]
    );

    // 6. Generazione token
    const token = signToken({ sub: result.insertId, kind: 'customer' });

    // 7. Risposta
    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        name,
        email,
      },
    });
  } catch (err) {
    console.error('Errore registerCustomer:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function loginCustomer(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password sono obbligatorie' });
    }

    const pool = await getPool();

    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash FROM customers WHERE email = ? LIMIT 1',
      [email]
    );

    const customer = rows[0];
    if (!customer) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const match = await bcrypt.compare(password, customer.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const token = signToken({ sub: customer.id, kind: 'customer' });

    res.json({
      token,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (err) {
    console.error('Errore loginCustomer:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function logoutCustomer(req, res) {
  try {
    // In un sistema JWT stateless, il logout è gestito lato client
    // Qui possiamo solo rispondere con un messaggio di conferma
    res.json({ message: 'Logout effettuato con successo' });
  } catch (err) {
    console.error('Errore logoutCustomer:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function deleteCustomerAccount(req, res) {
  try {
    // L'utente deve essere un customer
    if (req.user.kind !== 'customer') {
      return res.status(403).json({ error: 'Solo i clienti possono cancellare il proprio account' });
    }

    const pool = await getPool();

    // Segna il customer come eliminato
    const [result] = await pool.query(
      `UPDATE customers
       SET deleted_at = NOW()
       WHERE id = ? AND deleted_at IS NULL`,
      [req.user.sub]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Account già eliminato o inesistente' });
    }

    res.json({ message: 'Account cancellato con successo' });
  } catch (err) {
    console.error('Errore deleteCustomerAccount:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function loginStaff(req, res) {
  const { email, password } = req.body;
console.log("Login staff request body:", req.body);

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password sono obbligatorie' });
    }

    const pool = await getPool();

    // Cerca staff per email
    const [rows] = await pool.query(
      `SELECT id, full_name, email, password_hash, role, is_active
       FROM staff
       WHERE email = ? LIMIT 1`,
      [email]
    );

    const staff = rows[0];
    if (!staff) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Controllo stato attivo
    if (!staff.is_active) {
      return res.status(403).json({ error: 'Account disattivato, contatta l\'admin' });
    }

    // Verifica password
    const match = await bcrypt.compare(password, staff.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Genera token con ruolo incluso
    const token = signToken({
      sub: staff.id,
      kind: 'staff',
      role: staff.role,
    });

    res.json({
      token,
      user: {
        id: staff.id,
        full_name: staff.full_name,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (err) {
    console.error('Errore loginStaff:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function logoutStaff(req, res) {
  // lato server non c’è molto da fare con i JWT stateless
  res.json({ message: 'Logout staff eseguito con successo' });
}

module.exports = {
    registerCustomer, // <-- esportiamo anche questa

  loginCustomer, logoutCustomer, deleteCustomerAccount, loginStaff, logoutStaff
};
