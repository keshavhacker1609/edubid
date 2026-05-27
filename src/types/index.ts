export type TrustTier = 'Ultra-Low Risk' | 'Low Risk' | 'Moderate Risk' | 'High Risk';

export interface TrustScore {
  score: number;
  tier: TrustTier;
  components: {
    institutionTier: number;
    courseEmployability: number;
    coApplicantStrength: number;
    documentVerification: number;
    incomeStability: number;
  };
}

export interface Student {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  pan_number: string;
  aadhar_verified: boolean;
  digilocker_verified: boolean;
  created_at: string;
}

export interface LoanRequest {
  id: string;
  student_id: string;
  student_name: string;
  degree: string;
  institution: string;
  institution_tier: 'IIT/IIM/AIIMS' | 'NIT/Top-Private' | 'State-University' | 'Other';
  course_duration_years: number;
  loan_amount: number;
  tenure_months: number;
  purpose: string;
  trust_score: TrustScore;
  current_lowest_rate: number;
  bid_count: number;
  auction_ends_at: string;
  status: 'open' | 'accepted' | 'closed' | 'disbursed';
  created_at: string;
  co_applicant?: {
    name: string;
    relation: string;
    annual_income: number;
  };
}

export interface Bid {
  id: string;
  loan_request_id: string;
  lender_id: string;
  lender_name: string;
  lender_logo?: string;
  interest_rate: number;
  tenure_months: number;
  processing_fee_percent: number;
  special_conditions?: string;
  status: 'active' | 'outbid' | 'accepted' | 'withdrawn';
  created_at: string;
}

export interface Lender {
  id: string;
  name: string;
  logo?: string;
  type: 'PSU Bank' | 'Private Bank' | 'NBFC' | 'International';
  rating: string;
  total_disbursed_crore: number;
  active_bids: number;
  created_at: string;
}

export interface AdminStats {
  total_loan_requests: number;
  total_disbursed_crore: number;
  active_auctions: number;
  avg_interest_rate: number;
  avg_savings_percent: number;
  total_students: number;
  total_lenders: number;
  total_bids: number;
}

export interface StudentOnboardingForm {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  pan_number: string;
  institution: string;
  institution_tier: LoanRequest['institution_tier'];
  degree: string;
  course_duration_years: number;
  graduation_year: number;
  loan_amount: number;
  tenure_months: number;
  purpose: string;
  co_applicant_name: string;
  co_applicant_relation: string;
  co_applicant_income: number;
}
