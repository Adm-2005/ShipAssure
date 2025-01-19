import React from "react";

export interface navLink {
  name: string;
  href: string;
};

export interface CustomSignUpData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country: string;
  role: 'shipper' | 'carrier';
};

export interface CustomSignInData {
  email: string;
  password: string;
};

export interface CustomShipmentFormData {
  origin_code: string;
  destination_code: string;
  cargo_load: number;
};

export interface FormSectionProps {
  formData: CustomShipmentFormData;
  setFormData: React.Dispatch<CustomShipmentFormData>;
  setError: React.Dispatch<string>;
};