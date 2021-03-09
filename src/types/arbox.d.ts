// eslint-disable-next-line no-unused-vars

export interface Role {
  id: number;
  role: string;
  description: string;
}

export interface EnedeMembership {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  membership_type: string;
  end: string;
  start: string;
  created_at: string;
  deactivate_time: string;
  allow_sms: string;
  allow_mailing_list: string;
  location: string;
  cancelled: string;
}

export interface ConvertedLead {
  first_name: string;
  last_name: string;
  location: string;
  id: number;
  membership_type: string;
  lead_source: string;
  last_modified: string;
}

export interface LocationBox {
  id: number;
  location: string;
  boxFk: number;
  address: string;
  logo: string;
  rivhitRecurringSalesGroupId?: any;
  timeZone?: any;
}

export interface OpenLead {
  first_name: string;
  last_name: string;
  created_at: string;
  email: string;
  phone: string;
  updated_at: string;
  location: string;
  gender?: any;
  allow_sms: string;
  allow_mailing_list: string;
  id: number;
  task_id: number;
  reminder_time: string;
  done: number;
  targetable_id: number;
  targetable_type: string;
  reminder: string;
  lead_source: string;
  lead_status: string;

}

export interface Lead {
  first_name: string;
  last_name: string;
  created_at: string;
  email: string;
  phone: string;
  updated_at: string;
  location: string;
  gender?: any;
  allow_sms: string;
  allow_mailing_list: string;
  id: number;
  task_id: number;
  reminder_time: string;
  done: number;
  targetable_id: number;
  targetable_type: string;
  reminder: string;
  lead_source: string;
  lead_status: string;
}

export interface LeadExtended {
  id: number;
  user_fk?: any;
  box_fk: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  lead_date?: any;
  status?: any;
  source?: any;
  gender?: any;
  allow_sms: string;
  allow_mailing_list: string;
  comment: string;
  locations_box_fk: number;
  created_at: string;
  updated_at: string;
  deleted_at?: any;
  source_fk: number;
  status_fk: number;
  lost_reasons_fk?: any;
  rivhit_customer_id?: any;
  location: string;
  lead_source: string;
  lead_status: string;
  llr_name?: any;
}

declare module Arbox {

  export interface TaskType {
    id: number;
    boxFk: number;
    type: string;
    active: number;
  }

  export interface CreatedAt {
    date: string;
    timezone_type: number;
    timezone: string;
  }

  export interface TargetObj {
    id: number;
    userFk?: number;
    boxFk: number;
    firstName: string;
    lastName: string;
    status?: any;
    source?: any;
    lastModified: string;
    leadDate: string;
    comment: string;
    statusFk: number;
    sourceFk: number;
    image: string;
    counterFailLogin?: number;
    blockUntilLogin?: any;
  }

  export interface LeadSchedule {
    id: number;
    category: string;
    date: string;
    time: string;
    checkedIn: number;
  }

  export interface Task {
    id: number;
    taskOwnerUserFk: number;
    reminderTime: string;
    targetableType: string;
    targetableId?: number;
    taskTypeFk: number;
    taskType: TaskType;
    description: string;
    locationsBoxFk: number;
    boxFk: number;
    isNotified: number;
    doneTime: string;
    done: number;
    createdAt: CreatedAt;
    targetObj: TargetObj;
  }

  export interface Tasks {
    allTasks: Task[];
  }

  export interface Birthday {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    birthday: string;
    location: string;
  }

  export interface ActiveMember {
    first_name: string;
    last_name: string;
    phone: string;
    active: number;
    cancelled: number;
    start: string;
    end: string;
    location: string;
    user_fk: number;
    email: string;
    allow_sms: string;
    allow_mailing_list: string;
    child: number;
    groups_id?: any;
    price: number;
    head?: any;
    department_id?: any;
    department_name?: any;
    membership_type: string;
    created_at: string;
    paid: number;
  }

  export interface MemberCustomer {
    id: number;
    user_fk: number;
    box_fk: number;
    locations_box_fk: number;
    first_name: string;
    last_name: string;
    child: number;
    birthday?: any;
    image_public_id_cloudinary?: any;
    employee_id?: any;
    gender: string;
    phone: string;
    rfid?: any;
    additional_phone: string;
    weight: string;
    height: string;
    country?: any;
    city?: any;
    address?: any;
    personal_id?: any;
    medical_cert: number;
    active: number;
    suspended: number;
    restricted: number;
    restricted_time?: any;
    has_waiver: number;
    date_waiver?: any;
    has_basics_workshop: number;
    has_nutrition_counseling: number;
    has_professional_meeting: number;
    has_insurance: number;
    has_changed_property: number;
    allow_sms: string;
    allow_mailing_list: string;
    rivhit_customer_id: string;
    created_at: string;
    updated_at: string;
    deleted_at?: any;
    email: string;
    location: string;
    task_id?: any;
    reminder_time?: any;
    done?: any;
    targetable_id?: any;
    targetable_type?: any;
    reminder: string;
    age?: any;
    full_path_image_user: string;
  }

  export interface SystemUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    birthday?: any;
    gender: string;
    phone: string;
    active: number;
    suspend: number;
    medicalCert: number;
    weight: number;
    height: number;
    country: string;
    city: string;
    address: string;
    locationBox: LocationBox;
    personalId?: any;
    additionalPhone?: any;
    createdAt: string;
    restricted: number;
    counterFailLogin: number;
    blockUntilLogin?: any;
    lastLogin: string;
    membership?: any;
    roles: Role[];
  }

  export interface Transaction {
    user_fk: number;
    transaction_id?: any;
    first_name: string;
    last_name: string;
    rivhit_customer_id: string;
    membership_type_type: string;
    end_membership: string;
    transaction_type: string;
    amount: number;
    payments_number: number;
    first_payment?: any;
    last_four_digits?: any;
    voucher_id?: any;
    accounting_reference: string;
    accounting_reference_link: string;
    status: string;
    create_by: string;
    transaction_date: string;

  }
}
