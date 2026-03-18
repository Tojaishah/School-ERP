const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email to admin when new lead arrives
const sendAdminNotification = async (lead) => {
  const mailOptions = {
    from: `"EduStart Leads" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🆕 New Lead: ${lead.name} from ${lead.city}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A1209; padding: 24px; border-radius: 12px 12px 0 0;">
          <h2 style="color: #F4A017; margin: 0;">🏫 New Franchise Enquiry</h2>
        </div>
        <div style="background: #FFF9EE; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #eee;">
          <table style="width:100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #888; width: 140px;">Name</td>
              <td style="padding: 10px 0; font-weight: 600;">${lead.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888;">Phone</td>
              <td style="padding: 10px 0; font-weight: 600;">${lead.phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888;">City</td>
              <td style="padding: 10px 0; font-weight: 600;">${lead.city}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888;">Budget</td>
              <td style="padding: 10px 0; font-weight: 600;">₹${lead.budget}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888;">Timeline</td>
              <td style="padding: 10px 0; font-weight: 600;">${lead.timeline}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888;">Received</td>
              <td style="padding: 10px 0;">${new Date().toLocaleString('en-IN')}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #fff3cd; border-radius: 8px; font-size: 14px;">
            ⚡ Respond within 2 hours for highest conversion rate.
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Confirmation email to the lead
const sendLeadConfirmation = async (lead) => {
  const mailOptions = {
    from: `"EduStart" <${process.env.EMAIL_USER}>`,
    to: lead.email,
    subject: `✅ We received your enquiry, ${lead.name.split(' ')[0]}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A1209; padding: 24px; border-radius: 12px 12px 0 0;">
          <h2 style="color: #F4A017; margin: 0;">EduStart 🏫</h2>
        </div>
        <div style="background: #FFF9EE; padding: 24px; border-radius: 0 0 12px 12px;">
          <p>Hi <strong>${lead.name.split(' ')[0]}</strong>,</p>
          <p>Thank you for your interest in starting a preschool franchise! We've received your enquiry and our team will connect you with the best matching brands within <strong>24 hours</strong>.</p>
          <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
            <p style="margin:0;color:#888;font-size:13px;">YOUR ENQUIRY SUMMARY</p>
            <p style="margin:8px 0;"><strong>City:</strong> ${lead.city}</p>
            <p style="margin:8px 0;"><strong>Budget:</strong> ₹${lead.budget}</p>
            <p style="margin:8px 0;"><strong>Timeline:</strong> ${lead.timeline}</p>
          </div>
          <p>If you have any questions in the meantime, simply reply to this email.</p>
          <p style="margin-top: 24px;">Warm regards,<br><strong>Team EduStart</strong></p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendAdminNotification, sendLeadConfirmation };
