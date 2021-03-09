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

  export interface Member {
    user_fk?: any;
    lead_fk: number;
    registeredDate: string;
    cancelledDate?: any;
    cancelledBy?: any;
    image?: any;
    first_name: string;
    last_name: string;
    membershipType?: any;
  }

  export interface LessonMembers {
    registered: Member[];
    cancelled: Member[];
  }
}
