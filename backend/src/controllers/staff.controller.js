const bcrypt = require('bcryptjs');
const { getPool } = require('../config/db');

/**
 * Creazione account employee (solo admin)
 * POST /api/staff
 */

async function updateAdminCredentials(req, res) {
  const { new_email, new_password } = req.body;

  if (!new_email && !new_password) {
    return res.status(400).json({ error: 'Devi specificare almeno un campo (email o password)' });
  }

  try {
    const pool = await getPool();
    const updates = [];
    const values = [];

    if (new_email) {
      updates.push('email = ?');
      values.push(new_email);
    }
    if (new_password) {
      const hash = await bcrypt.hash(new_password, 10);
      updates.push('password_hash = ?');
      values.push(hash);
    }

    values.push(req.user.sub); // ID dell’admin loggato

    await pool.query(
      `UPDATE staff SET ${updates.join(', ')} WHERE id = ? AND role = 'admin'`,
      values
    );

    res.json({ message: 'Credenziali admin aggiornate con successo' });
  } catch (err) {
    console.error('Errore updateAdminCredentials:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function createEmployee(req, res) {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }

  try {
    const pool = await getPool();

    // Verifica se email già usata
    const [exists] = await pool.query(
      'SELECT id FROM staff WHERE email = ? LIMIT 1',
      [email]
    );
    if (exists.length > 0) {
      return res.status(409).json({ error: 'Email già registrata' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Inserisci employee
    const [result] = await pool.query(
      `INSERT INTO staff (full_name, email, password_hash, role, is_active)
       VALUES (?, ?, ?, 'employee', 1)`,
      [full_name, email, passwordHash]
    );

    res.status(201).json({
      id: result.insertId,
      full_name,
      email,
      role: 'employee',
      is_active: 1,
    });
  } catch (err) {
    console.error('Errore createEmployee:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function listEmployees(req, res) {
  try {
    const pool = await getPool();

    const [rows] = await pool.query(
      `SELECT id, full_name, email, role, is_active, created_at
       FROM staff
       WHERE role = 'employee'`
    );

    res.json(rows);
  } catch (err) {
    console.error('Errore listEmployees:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function employeeRequestChangeCredentials(req, res) {
  const { new_email, new_password } = req.body;

  try {
    // L'utente deve essere un employee loggato
    if (req.user.kind !== 'staff' || req.user.role !== 'employee') {
      return res.status(403).json({ error: 'Solo i dipendenti possono fare richieste di modifica' });
    }

    if (!new_email && !new_password) {
      return res.status(400).json({ error: 'Devi specificare almeno una modifica (email o password)' });
    }

    const pool = await getPool();

    // Prepara il payload
    let payload = { staffId: req.user.sub };
    if (new_email) payload.new_email = new_email;
    if (new_password) {
      const hash = await bcrypt.hash(new_password, 10);
      payload.new_password_hash = hash;
    }

    // Inserisce notifica destinata all'admin
  const [rows] = await pool.query(
  'SELECT id FROM staff WHERE role = "admin"'
);
const adminId = rows[0].id;

await pool.query(
  `INSERT INTO notifications (type, payload, is_read, user_id_target)
   VALUES ('STAFF_CHANGE_REQUEST', ?, 0, ?)`,
  [JSON.stringify(payload), adminId]
);

    res.status(201).json({ message: 'Richiesta di modifica credenziali inviata all’admin' });
  } catch (err) {
    console.error('Errore requestChangeCredentials:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function handleChangeRequest(req, res) {
  const { decision } = req.body; // "accept" o "reject"
  const notifId = req.params.id;

  if (!['accept', 'reject'].includes(decision)) {
    return res.status(400).json({ error: 'Decisione non valida' });
  }

  try {
    const pool = await getPool();

    // Recupera notifica
    const [rows] = await pool.query(
      `SELECT id, payload, user_id_target, is_read
       FROM notifications
       WHERE id = ? AND type = "STAFF_CHANGE_REQUEST"`,
      [notifId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Richiesta non trovata' });
    }

    const notif = rows[0];

    // 🔒 Se la richiesta è già stata processata, blocca
    if (notif.is_read === 1) {
      return res.status(400).json({ error: 'Richiesta già gestita' });
    }

    // Assicurati che payload sia un oggetto
    let payload;
    if (typeof notif.payload === 'string') {
      payload = JSON.parse(notif.payload);
    } else {
      payload = notif.payload;
    }

    if (decision === 'accept') {
      // Aggiorna credenziali dello staff
      const updates = [];
      const values = [];

      if (payload.new_email) {
        updates.push('email = ?');
        values.push(payload.new_email);
      }
      if (payload.new_password_hash) {
        updates.push('password_hash = ?');
        values.push(payload.new_password_hash);
      }

      if (updates.length > 0) {
        values.push(payload.staffId);
        await pool.query(
          `UPDATE staff SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
      }

      // Notifica di risposta positiva all'impiegato
      await pool.query(
        `INSERT INTO notifications (type, payload, is_read, user_id_target)
         VALUES ('STAFF_CHANGE_RESPONSE', ?, 0, ?)`,
        [JSON.stringify({ staffId: payload.staffId, status: 'accepted' }), payload.staffId]
      );
    } else {
      // Notifica di risposta negativa all’impiegato
      await pool.query(
        `INSERT INTO notifications (type, payload, is_read, user_id_target)
         VALUES ('STAFF_CHANGE_RESPONSE', ?, 0, ?)`,
        [JSON.stringify({ staffId: payload.staffId, status: 'rejected' }), payload.staffId]
      );
    }

    // Segna la notifica originale come gestita
    await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [notifId]);

    res.json({ message: `Richiesta ${decision} dall'admin` });
  } catch (err) {
    console.error('Errore handleChangeRequest:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function deactivateEmployee(req, res) {
  const staffId = req.params.id;

  try {
    const pool = await getPool();

    const [result] = await pool.query(
      'UPDATE staff SET is_active = 0 WHERE id = ? AND role = "employee"',
      [staffId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Impiegato non trovato o già disattivato' });
    }

    res.json({ message: `Impiegato ${staffId} disattivato con successo` });
  } catch (err) {
    console.error('Errore deactivateEmployee:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function activateEmployee(req, res) {
  const { id } = req.params;

  try {
    const pool = await getPool();

    // Controlla se esiste
    const [rows] = await pool.query(
      'SELECT id, full_name, is_active FROM staff WHERE id = ? AND role = "employee"',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Impiegato non trovato' });
    }

    const employee = rows[0];

    if (employee.is_active === 1) {
      return res.status(400).json({ error: 'Impiegato già attivo' });
    }

    // Riattiva
    await pool.query(
      'UPDATE staff SET is_active = 1 WHERE id = ?',
      [id]
    );

    res.json({ message: `Impiegato ${employee.full_name} riattivato con successo` });
  } catch (err) {
    console.error('Errore activateEmployee:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}



module.exports = { createEmployee, listEmployees, employeeRequestChangeCredentials, handleChangeRequest, deactivateEmployee, activateEmployee, updateAdminCredentials };
