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
