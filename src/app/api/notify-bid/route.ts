import { NextResponse } from 'next/server';

export interface NotifyBidPayload {
  student_name: string;
  student_email: string;
  lender_name: string;
  interest_rate: number;
  loan_amount: number;
  tenure_months: number;
  emi: number;
  bid_count: number;
  auction_ends_at: string;
  loan_request_id: string;
}

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` : `₹${n.toLocaleString('en-IN')}`;

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  // Silently skip if email not configured — never blocks the UI
  if (!apiKey || apiKey.startsWith('re_your_')) {
    return NextResponse.json({ skipped: true, reason: 'Email not configured' });
  }

  let body: NotifyBidPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const {
    student_name, student_email, lender_name,
    interest_rate, loan_amount, tenure_months, emi,
    bid_count, auction_ends_at,
  } = body;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const closeDate = new Date(auction_ends_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#05070a;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#05070a;padding:40px 20px;">
<tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="padding-bottom:28px;text-align:center;">
  <span style="font-size:24px;font-weight:900;color:#fff;">Edu<span style="color:#60a5fa;">Bid</span></span>
</td></tr>
<tr><td style="background:#0f172a;border:1px solid #1e293b;border-radius:16px;padding:40px;">
  <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#60a5fa;text-transform:uppercase;letter-spacing:.08em;">● New Bid Received</p>
  <h1 style="margin:0 0 12px;font-size:26px;font-weight:900;color:#fff;">${lender_name} wants to fund you</h1>
  <p style="margin:0 0 28px;font-size:15px;color:#94a3b8;">Hi ${student_name}, you now have <strong style="color:#fff;">${bid_count} bid${bid_count !== 1 ? 's' : ''}</strong> on your loan request.</p>
  <div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.25);border-radius:12px;padding:24px;margin-bottom:24px;text-align:center;">
    <p style="margin:0 0 4px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;">New Offer Rate</p>
    <p style="margin:0;font-size:46px;font-weight:900;color:#34d399;line-height:1.1;">${interest_rate.toFixed(2)}%<span style="font-size:16px;color:#64748b;font-weight:400;"> p.a.</span></p>
    <p style="margin:8px 0 0;font-size:14px;color:#94a3b8;">Monthly EMI: <strong style="color:#fff;">${fmt(emi)}</strong></p>
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
      <td width="50%" style="padding-right:8px;">
        <div style="background:#1e293b;border-radius:10px;padding:14px;">
          <p style="margin:0 0 3px;font-size:10px;color:#64748b;text-transform:uppercase;">Loan Amount</p>
          <p style="margin:0;font-size:17px;font-weight:800;color:#fff;">${fmt(loan_amount)}</p>
        </div>
      </td>
      <td width="50%" style="padding-left:8px;">
        <div style="background:#1e293b;border-radius:10px;padding:14px;">
          <p style="margin:0 0 3px;font-size:10px;color:#64748b;text-transform:uppercase;">Tenure</p>
          <p style="margin:0;font-size:17px;font-weight:800;color:#fff;">${tenure_months} months</p>
        </div>
      </td>
    </tr>
  </table>
  <div style="background:#1e293b;border-radius:10px;padding:14px;margin-bottom:28px;">
    <p style="margin:0 0 3px;font-size:10px;color:#64748b;text-transform:uppercase;">⏱ Auction Closes</p>
    <p style="margin:0;font-size:14px;font-weight:600;color:#fbbf24;">${closeDate}</p>
  </div>
  <div style="text-align:center;">
    <a href="${appUrl}/student/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:12px;">Compare All Offers →</a>
  </div>
</td></tr>
<tr><td style="padding:20px 0;text-align:center;">
  <p style="margin:0;font-size:11px;color:#334155;">EduBid · India's Education Loan Marketplace</p>
</td></tr>
</table></td></tr></table>
</body></html>`;

  try {
    // Direct fetch to Resend REST API — no SDK, no build-time init
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EduBid <noreply@edubid.in>',
        to: [student_email],
        subject: `🎯 New offer: ${interest_rate.toFixed(2)}% p.a. from ${lender_name}`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[EduBid] Resend error:', data);
      return NextResponse.json({ error: data }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('[EduBid] Email failed:', err);
    return NextResponse.json({ error: 'Send failed' }, { status: 500 });
  }
}
