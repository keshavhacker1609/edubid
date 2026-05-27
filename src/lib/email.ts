import { calculateEMI } from '@/lib/trustScore';

interface SendBidNotificationParams {
  student_name: string;
  student_email: string;
  lender_name: string;
  interest_rate: number;
  loan_amount: number;
  tenure_months: number;
  bid_count: number;
  auction_ends_at: string;
  loan_request_id: string;
}

/**
 * Fire-and-forget email notification when a lender places a bid.
 * Silently fails — never throws, never blocks UI.
 */
export async function sendBidNotification(params: SendBidNotificationParams): Promise<void> {
  try {
    const emi = calculateEMI(params.loan_amount, params.interest_rate, params.tenure_months);
    await fetch('/api/notify-bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, emi }),
    });
  } catch (err) {
    console.warn('[EduBid] Email notification skipped:', err);
  }
}
