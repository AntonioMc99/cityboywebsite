export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { service, price, date, time, name, phone, email, location, notes } = req.body;

  if (!service || !date || !time || !name || !phone || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const d = new Date(date + 'T12:00:00');
  const dateFormatted = d.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const ownerHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#d7263d;padding:1.5rem;border-radius:12px 12px 0 0;">
        <h2 style="color:#fff;margin:0;">New Booking Request</h2>
      </div>
      <div style="background:#f9f9f9;padding:1.5rem;border-radius:0 0 12px 12px;border:1px solid #eee;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:0.6rem;color:#666;width:140px;">Service</td><td style="padding:0.6rem;font-weight:700;">${service}</td></tr>
          <tr style="background:#fff;"><td style="padding:0.6rem;color:#666;">Price</td><td style="padding:0.6rem;font-weight:700;color:#d7263d;">${price}</td></tr>
          <tr><td style="padding:0.6rem;color:#666;">Date</td><td style="padding:0.6rem;font-weight:700;">${dateFormatted}</td></tr>
          <tr style="background:#fff;"><td style="padding:0.6rem;color:#666;">Time</td><td style="padding:0.6rem;font-weight:700;">${time}</td></tr>
          <tr><td style="padding:0.6rem;color:#666;">Location</td><td style="padding:0.6rem;">${location || 'Not specified'}</td></tr>
          <tr style="background:#fff;"><td style="padding:0.6rem;color:#666;">Name</td><td style="padding:0.6rem;">${name}</td></tr>
          <tr><td style="padding:0.6rem;color:#666;">Phone</td><td style="padding:0.6rem;"><a href="tel:${phone}">${phone}</a></td></tr>
          <tr style="background:#fff;"><td style="padding:0.6rem;color:#666;">Email</td><td style="padding:0.6rem;"><a href="mailto:${email}">${email}</a></td></tr>
          ${notes ? `<tr><td style="padding:0.6rem;color:#666;vertical-align:top;">Notes</td><td style="padding:0.6rem;">${notes}</td></tr>` : ''}
        </table>
        <div style="margin-top:1.5rem;padding:1rem;background:#fff3cd;border-radius:8px;border-left:4px solid #f2c14e;">
          <strong>Reply or call ${phone} to confirm.</strong>
        </div>
      </div>
    </div>
  `;

  const customerHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#111;padding:1.5rem;border-radius:12px 12px 0 0;text-align:center;">
        <h2 style="color:#f2c14e;margin:0;">City Boy Petz</h2>
        <p style="color:#aaa;margin:0.5rem 0 0;">Booking Request Received!</p>
      </div>
      <div style="background:#f9f9f9;padding:1.5rem;border-radius:0 0 12px 12px;border:1px solid #eee;">
        <p>Hey <strong>${name}</strong>, we got your request!</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:0.6rem;color:#666;width:120px;">Service</td><td style="padding:0.6rem;font-weight:700;">${service}</td></tr>
          <tr style="background:#fff;"><td style="padding:0.6rem;color:#666;">Date</td><td style="padding:0.6rem;">${dateFormatted}</td></tr>
          <tr><td style="padding:0.6rem;color:#666;">Time</td><td style="padding:0.6rem;">${time}</td></tr>
        </table>
        <p style="margin-top:1.5rem;">We'll reach out within <strong>24 hours</strong> to confirm. Need us sooner?</p>
        <p>Call <a href="tel:6787602296">(678) 760-2296</a> or email <a href="mailto:cityboypetzllc@gmail.com">cityboypetzllc@gmail.com</a></p>
        <p style="margin-top:1.5rem;color:#888;font-size:0.9rem;">— City Boy Petz Team</p>
      </div>
    </div>
  `;

  try {
    const sendEmail = async (to, subject, html, replyTo) => {
      const body = { from: 'City Boy Petz <onboarding@resend.dev>', to, subject, html };
      if (replyTo) body.reply_to = replyTo;
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify(body)
      });
      if (!r.ok) throw new Error(await r.text());
    };

    await sendEmail(
      'cityboypetzllc@gmail.com',
      `New Booking: ${service} — ${dateFormatted} at ${time}`,
      ownerHtml,
      email
    );

    await sendEmail(
      email,
      'Your Booking Request — City Boy Petz',
      customerHtml
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
