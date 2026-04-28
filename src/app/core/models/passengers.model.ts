export type DocumentType = 'dni' | 'passport' | 'nie';

export interface PassengerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: DocumentType;
  documentNumber: string;
  nationality: string;
  frequentFlyer: boolean;
  totalFlights: number;
}