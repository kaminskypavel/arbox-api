// Built With ♡ 'PK' (www.pavel-kaminsky.com)
// All Rights Reserved.

import {
  Arbox, ConvertedLead, EnedeMembership, Lead, LeadExtended, Schedule,
} from './types/arbox';
import Tasks = Arbox.Tasks;
import Birthday = Arbox.Birthday;
import Lesson = Schedule.Lesson;
import LessonMembers = Schedule.LessonMembers;
import ActiveMember = Arbox.ActiveMember;
import Task = Arbox.Task;
import TaskType = Arbox.TaskType;
import SystemUser = Arbox.SystemUser;
import Transaction = Arbox.Transaction;
import MemberCustomer = Arbox.MemberCustomer;
import LeadSchedule = Arbox.LeadSchedule;

export interface IArBoxApp {

    getConnection(): Promise<IArBoxAppConnection>;

    getAllCustomers(): Promise<string>;

    getEndingMembership(fromDate: string, toDate: string): Promise<EnedeMembership[]>;

    getAllActiveCustomers(): Promise<ActiveMember[]>;

    getActiveUsersWithMembership(): Promise<MemberCustomer[]>;

    getAllCustomersExtraDataDump(): Promise<string>;

    getAllOpenLeads(): Promise<[Lead]>;

    getConvertedLeads(fromDate?, toDate?): Promise<[ConvertedLead]>;

    getAllTasks(): Promise<Tasks>;

    getBirthdays(from?: Date, to?: Date): Promise<[Birthday]>;

    addLead(email: string, firstName: string, lastName: string, phone: string, comment?: string, status?: number, source?: number, locationBokFk?: number): Promise<void>;

    getLead(leadId: number): Promise<LeadExtended>;

    updateLeadStatus(leadId: number): Promise<Lead>;

    getLeadTasks(leadId: number): Promise<[Task]>;

    getLeadSchedule(leadId: number): Promise<[LeadSchedule]>;

    addUserTask(userId: number, description: string, taskType: TaskType, reminderDate: Date, assignedTo?: SystemUser);

    getLessons(fromDate: Date | string, toDate: Date | string, location: number): Promise<Lesson>;

    getLessonMembers(lessonId: number): Promise<LessonMembers>;

    getTransactions(fromDate?, toDate?): Promise<[Transaction]>;
}

export interface IArBoxAppConnection {

    debug: boolean;
    demoMode: boolean;
    config: IArBoxAppConfig;

    isConnected(): Promise<boolean>;

    connect(): Promise<any>;

    forceConnection(): Promise<any>;

    serverRequest(url: string, method: string, data?: {}): Promise<any>;
}

export interface IArBoxAppConfig {
    boxId?: number;
    boxName?: string;
    username?: string;
    password?: string;
}
