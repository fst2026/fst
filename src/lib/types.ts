export type SubmissionStatus = "pending" | "accepted" | "rejected";

export type VehicleSubmission = {
  id: string;
  brand: string;
  model: string;
  productionYear: string;
  registrationNumber: string;
  modifications: string;
  photoPaths: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagram: string;
  tshirtSize: string;
  acceptedRules: boolean;
  acceptedRodo: boolean;
  status: SubmissionStatus;
  createdAt: string;
};

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type SiteSettings = {
  // Wydarzenie
  eventName: string;
  eventDate: string; // ISO date format: YYYY-MM-DD
  eventLocation: string;
  facebookEventUrl: string;
  galleryDropboxUrl: string;

  // Social media
  socialFacebook: string;
  socialInstagram: string;
  socialTiktok: string;

  // Stowarzyszenie
  associationName: string;
  associationAccountNumber: string;
  associationTaxId: string;
  associationContactEmail: string;

  // Płatności
  entryFeePln: number;
  paymentRecipientName: string;
  paymentBankAccount: string;
  paymentDeadlineText: string;

  // Mapy
  parkingMapUrl: string;

  // Formularz zgłoszeniowy
  submissionsOpen: boolean;
  submissionsClosedMessage: string;
  tshirtSizes: string; // comma-separated, e.g. "XS,S,M,L,XL,XXL"

  // Szablony e-mail (placeholders: {{firstName}}, {{entryFeePln}}, {{paymentBankAccount}}, {{paymentDeadlineText}}, {{paymentRecipientName}}, {{parkingMapUrl}})
  emailTemplateReceived: string;
  emailTemplateAccepted: string;
  emailTemplateRejected: string;
};
