export declare module Schedule {
  export interface ScheduleLesson {
    id: number;
    date: string;
    status: string;
    max_users: number;
    min_users: number;
    enable_registration_time: number;
    live_link?: any;
    disable_cancellation_time: number;
    enable_late_cancellation: number;
    cancel_limit?: any;
    series_fk: number;
    series_name: string;
    time: string;
    end_time: string;
    category: string;
    color: string;
    box_category_fk: number;
    locations_box_fk: number;
    transparent: number;
    coach: string;
    coach_fk?: number;
    second_coach_name?: any;
    second_coach_fk?: any;
    registered: number;
    standby: number;
    regular_client_registered: number;
    regular_client_deleted: number;
    duplicate_registered_regular_client: number;
    day_of_week: number;
  }



  export interface Attendance {
    id: number;
    category: string;
    date: string;
    time: string;
    checkedIn: number;
  }

  export interface RegisteredPerson {
    is_aggregator?: any;
    id: number;
    schedule_fk: number;
    membership_user_fk?: any;
    checked_in: number;
    user_fk?: any;
    lead_fk: number;
    created_at: string;
    updated_at: string;
    deleted_at?: any;
    cancelled_by?: any;
    late_cancellation: number;
    image?: any;
    first_name: string;
    last_name: string;
    phone: string;
    epidemic_statement?: any;
    membership_type_name?: any;
    user_total_debt?: any;
    end?: any;
    image_public_id_cloudinary?: any;
    birthday?: any;
    active?: any;
    full_path_image_user: string;
    client_phone: string;
  }

  export interface LessonMembers {
    registered: RegisteredPerson[];
    cancelled: RegisteredPerson[];
  }
}
