const pool = require('../config/db');

const createUser = async (username, email, hashedPassword, verificationCode) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (username, email, password, is_verified, must_change_password, verification_code)
       VALUES ($1, $2, $3, false, true, $4) RETURNING *`,
      [username, email, hashedPassword, verificationCode]
    );

    const userId = userResult.rows[0].id;

    await client.query(
      'INSERT INTO user_profiles (user_id) VALUES ($1)',
      [userId]
    );

    await client.query('COMMIT');
    return userResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};


const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const updateUserProfile = async (id, username, email) => {
  const result = await pool.query(
    'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email',
    [username, email, id]
  );
  return result.rows[0];
};

const updateUserPassword = async (id, hashedPassword) => {
  const result = await pool.query(
    'UPDATE users SET password = $1 WHERE id = $2',
    [hashedPassword, id]
  );
  return result.rows[0];
};

const disableMustChangePassword = async (id) =>{
  const result = await pool.query(
    'UPDATE users SET must_change_password = false WHERE id = $1',
    [id]
  );
  return result.rows[0];
}


const deleteUserById = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

const verifyUser = async (email) => {
  const result = await pool.query(
    'UPDATE users SET is_verified = true, verification_code = null WHERE email = $1 RETURNING *',
    [email]
  );
  return result.rows[0];
};

const updateVerificationCode = async (email, newCode) => {
  const result = await pool.query(
    'UPDATE users SET verification_code = $1 WHERE email = $2 RETURNING *',
    [newCode, email]
  );
  return result.rows[0];
};

async function setVerificationCode(userId, code) {
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
  const result = await pool.query(
    'UPDATE users SET verification_code = $1, verification_code_expires = $2 WHERE id = $3',
      [code, expires, userId]
  );
  return result.rows[0];
}

async function clearVerificationCode(userId) {
  const result = await pool.query(
    'UPDATE users SET verification_code = NULL, verification_code_expires = NULL WHERE id = $1',
    [userId]
  )
  return result.rows[0];
}

async function clearVerificationCode(userId) {
  const result = await pool.query(
    'UPDATE users SET verification_code = NULL, verification_code_expires = NULL WHERE id = $1',
    [userId]
  );
  return result.rows[0];
}



module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserProfile,
  updateUserPassword,
  deleteUserById,
  verifyUser,
  updateVerificationCode,
  disableMustChangePassword,
  setVerificationCode,
  clearVerificationCode
};