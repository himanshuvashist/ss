export type UrlType = string | null;

interface PaginationUIInterface {
  next: UrlType;
  prev: UrlType;
  onPrevClick?: (prev: UrlType) => void;
  onNextClick?: (next: UrlType) => void;
}

interface ResultStringInterface {
  pagination: PaginateDataType;
  loading: boolean;
  pageString?: string;
}

type PaginateDataType = {
  next: UrlType;
  prev: UrlType;
  count: number | null;
  count: number | null;
  resultsCount: number;
  limit: number | null;
  hasOffset: boolean;
  offset: number | null;
};

type ContactDataType = {
  address_line_1: string;
  address_line_2: string;
  city: string;
  code: string;
  company_name: string;
  country: string;
  created: string; 
  currency: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  notes: string;
  payment_terms: string;
  phone: string;
  pincode: string;
  state: string;
  updated: string; 
  [key: string]: any;
};

type SearchParamsType = {
  contact?: string;
  paginate?:string;
  limit?:string;
  offset?:string;
}
