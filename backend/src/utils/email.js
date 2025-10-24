const nodemailer = require("nodemailer");

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendNameChangeEmail(toEmail, newName) {
  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: toEmail,
      subject: "Aggiornamento nome profilo - TechStore",
      html: `
        <div style="font-family:sans-serif; padding:16px;">
          <h2>🙌 Ciao ${newName}!</h2>
          <p>Il tuo nome è stato aggiornato con successo sul tuo profilo <strong>TechStore</strong>.</p>
          <p>Se non sei stato tu a effettuare questa modifica, ti consigliamo di contattare il nostro supporto.</p>
          <br>
          <p style="font-size:12px; color:#888">Questo è un messaggio automatico, non rispondere a questa email.</p>
        </div>
      `,
    });

    console.log("📧 Email di cambio nome inviata:", info.messageId);
  } catch (err) {
    console.error("❌ Errore invio email cambio nome:", err);
  }
}


async function sendEmailConfirmation(toEmail) {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: toEmail,
      subject: "Conferma cambio email - TechStore",
      html: `
        <div style="font-family:sans-serif; padding:16px;">
          <h2>✅ Email aggiornata con successo!</h2>
          <p>Ciao, ti confermiamo che la tua email è stata aggiornata su <strong>TechStore</strong>.</p>
          <p>Se non sei stato tu, contatta subito il nostro supporto tecnico.</p>
          <br>
          <p style="font-size:12px; color:#888">Questo è un messaggio automatico, non rispondere a questa email.</p>
        </div>
      `,
    });

    console.log("📧 Email inviata con successo:", info.messageId);
  } catch (err) {
    console.error("❌ Errore invio email:", err);
  }
}

async function sendPasswordChangeEmail(toEmail) {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: toEmail,
      subject: "Conferma cambio password - TechStore",
      html: `
        <div style="font-family:sans-serif; padding:16px;">
          <h2>🔒 Password aggiornata</h2>
          <p>La tua password è stata modificata con successo.</p>
          <p>Se non sei stato tu, <strong>cambia immediatamente la password</strong> e contatta il supporto.</p>
        </div>
      `,
    });
    console.log("📧 Email conferma password inviata:", info.messageId);
  } catch (err) {
    console.error("❌ Errore invio email cambio password:", err);
  }
}


async function sendAccountDeletionEmail(toEmail) {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: toEmail,
      subject: "Account eliminato - TechStore",
      html: `
        <div style="font-family:sans-serif; padding:16px;">
          <h2>⚠️ Account eliminato definitivamente</h2>
          <p>Ciao, ti confermiamo che il tuo account <strong>TechStore</strong> è stato eliminato con successo.</p>
          <p>Tutti i tuoi dati, ordini e indirizzi sono stati rimossi in modo permanente.</p>
          <br>
          <p>Se non sei stato tu, contatta subito il nostro supporto tecnico.</p>
          <br>
          <p style="font-size:12px; color:#888">Questo è un messaggio automatico, non rispondere a questa email.</p>
        </div>
      `,
    });
    console.log("📧 Email eliminazione account inviata:", info.messageId);
  } catch (err) {
    console.error("❌ Errore invio email eliminazione account:", err);
  }
}


module.exports = { sendNameChangeEmail, sendEmailConfirmation, sendPasswordChangeEmail, sendAccountDeletionEmail };
