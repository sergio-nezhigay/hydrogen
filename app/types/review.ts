// src/types/review.ts
import type {GetProductQuery} from 'storefrontapi.generated';

export type ReviewMode = 'SENT' | 'GATHER' | 'PARAM_ERROR' | 'SEND_ERROR';

export interface LoaderData {
  mode: ReviewMode;
  formData?: {
    productId: string;
    name: string;
    email: string;
  };
  product?: GetProductQuery['product'];
}
