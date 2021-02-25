export interface CustomerResult {
    user_fk: number;
    rivhit_customer_id: string;
    image_public_id_cloudinary?: any;
    first_name: string;
    last_name: string;
    child: number;
    active: number;
    role_fk: number;
    id: number;
    image: string;
    ugc_id?: any;
    users_boxes_id: number;
    full_name: string;
    type: string;
    age?: any;
    full_path_image_user: string;
}

export interface LeadResult {
    id: number;
    email: string;
    phone: string;
    rivhit_customer_id: string;
    full_name: string;
    type: string;
}

export type SearchQueryResult = Array<LeadResult | CustomerResult>;
