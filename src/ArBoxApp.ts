import moment from 'moment';
import queryString from 'query-string';
import {config} from 'dotenv';
import ArBoxAppConnection from './connetion';
import {
  Arbox,
  ConvertedLead,
  EnedeMembership,
  Lead,
  LeadExtended,
  Schedule,
} from './types/arbox';
import {SearchQueryResult} from './types/query';
import {Reports} from './types/reports';

config();

export default class ArBoxApp {
  private readonly connection: ArBoxAppConnection;

  constructor(
    boxId: number,
    boxName: string,
    token: string,
    email: string,
    password: string
  ) {
    this.connection = new ArBoxAppConnection({
      boxId,
      boxName,
      token,
      email,
      password,
    });
  }

  async getAllCustomers(): Promise<string> {
    const conn = await this.ensureConnection();
    const dataReq = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/box/${this.connection.config.boxId}/getUsersAndLeadsJson`,
      'get'
    );
    return dataReq.data;
  }

  // מנויים פעילים
  async getAllActiveCustomers(): Promise<Arbox.ActiveMember[]> {
    const conn = await this.ensureConnection();
    const dataReq = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/box/${this.connection.config.boxId}/activeMembers/detailedReport/null`,
      'get'
    );
    return dataReq.data;
  }

  // https://api.arboxapp.com/index.php/api/v1/box/226/getActiveUsersWithMembership
  async getActiveUsersWithMembership(): Promise<Arbox.MemberCustomer[]> {
    const conn = await this.ensureConnection();
    const dataReq = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/box/${this.connection.config.boxId}/getActiveUsersWithMembership`,
      'get'
    );
    return dataReq.data;
  }

  // ריכוז לקוחות פעילים

  async getLeadAttendance(
    leadId: number | string
  ): Promise<[Schedule.Attendance] | undefined> {
    const conn = await this.ensureConnection();
    try {
      const dataReq = await conn.serverRequest(
        `https://api.arboxapp.com/index.php/api/v1/lead/${leadId}/schedules`,
        'post'
      );
      return dataReq.data;
    } catch (e) {
      return undefined;
    }
  }

  async getEndingMembership(
    fromDate = moment().format('YYYY-MM-DD'),
    toDate = moment().format('YYYY-MM-DD')
  ): Promise<EnedeMembership[]> {
    const conn = await this.ensureConnection();
    const dataReq = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/user/getEndingMembership/${this.connection.config.boxId}`,
      'post',
      {
        fromDate,
        toDate,
        ended: true,
      }
    );
    return dataReq.data;
  }

  async getAllCustomersExtraDataDump(): Promise<string> {
    const conn = await this.ensureConnection();
    const dataReq = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/user/${this.connection.config.boxId}/extraData/`,
      'post'
    );
    return dataReq.data;
  }

  async getAllOpenLeads(): Promise<[Lead]> {
    const conn = await this.ensureConnection();
    const dataReq = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/box/${this.connection.config.boxId}/openLeads/null`,
      'get'
    );
    return dataReq.data;
  }

  // https://api.arboxapp.com/index.php/api/v1/box/226/openLeads

  async getConvertedLeads(
    fromDate = moment().format('YYYY-MM-DD'),
    toDate = moment().format('YYYY-MM-DD')
  ): Promise<[ConvertedLead]> {
    const conn = await this.ensureConnection();
    const dataReq = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/lead/getLeadConverted/${this.connection.config.boxId}`,
      'post',
      {fromDate, toDate}
    );
    return dataReq.data;
  }

  async getTransactions(
    fromDate = moment().format('YYYY-MM-DD'),
    toDate = moment().format('YYYY-MM-DD')
  ): Promise<[Arbox.Transaction]> {
    const conn = await this.ensureConnection();
    const dataReq = await conn.serverRequest(
      'https://api.arboxapp.com/index.php/api/v1/reports/global/transactions',
      'post',
      {fromDate, toDate}
    );
    return dataReq.data;
  }

  async addLead(
    firstName: string,
    lastName: string,
    phone: string,
    email = 'none@none.com',
    comment = `created at ${moment().format()}`,
    status = 1623,
    source = 1145,
    locationBoxFk = this.connection.config.boxId
  ) {
    const conn = await this.ensureConnection();
    const dataReq = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/lead/${this.connection.config.boxId}`,
      'post',
      {
        allow_mailing_list: 'unknown',
        allow_sms: 'unknown',
        comment,
        email,
        firstName,
        lastName,
        locationBoxFk,
        phone,
        source,
        status,
      }
    );
    return dataReq.data;
  }

  async getLead(leadId: number): Promise<LeadExtended> {
    const conn = await this.ensureConnection();

    const {data} = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/lead/getById/${leadId}`,
      'GET'
    );

    return data;
  }

  async getLeadTasks(leadId: number): Promise<[Arbox.Task]> {
    const conn = await this.ensureConnection();

    const {data} = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/tasks/${this.connection.config.boxId}/lead/${leadId}`,
      'GET'
    );

    return data;
  }

  async getLeadSchedule(leadId: number): Promise<[Arbox.LeadSchedule]> {
    const conn = await this.ensureConnection();
    const {data} = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/lead/${leadId}/schedules`,
      'POST'
    );

    return data;
  }

  async updateLeadStatus(
    leadId: number,
    comment = '',
    newStatus = '1629'
  ): Promise<Lead> {
    const conn = await this.ensureConnection();
    const params = {
      boxId: this.connection.config.boxId,
      comment,
      leadId,
      newStatus,
    };

    const {data} = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/lead/updateStatus/${leadId}`,
      'POST',
      params
    );

    return data;
  }

  async addUserTask(
    userId: number,
    description: string,
    taskType: Arbox.TaskType,
    reminderDate: Date,
    systemUser?: Arbox.SystemUser
  ) {
    const conn = await this.ensureConnection();
    const {data} = await conn.serverRequest(
      'https://api.arboxapp.com/index.php/api/v1/tasks',
      'post',
      {
        systemUser,
        boxFk: this.connection.config.boxId,
        description,
        done: 0,
        doneTime: null,
        isNotified: 0,
        reminderDate: moment().format('YYYY-MM-DDTHH:MM:00.259Z'),
        reminder: {
          reminderDate: moment(reminderDate).format('YYYY-MM-DDTHH:MM:00.259Z'),
        },
        targetableId: userId,
        targetableType: 'user',
        taskType,
        reminderTime: moment(reminderDate).format('YYYY-MM-DDTHH:MM:00.259Z'),
        taskOwnerUserFk: 56841,
      }
    );
    return data;
  }

  async getAllTasks(
    fromDate = moment().startOf('week').format('YYYY-MM-DD'),
    toDate = moment().endOf('week').format('YYYY-MM-DD')
  ): Promise<Arbox.Tasks> {
    const conn = await this.ensureConnection();

    const getTaskPage = async (page = 1): Promise<Arbox.Tasks> => {
      const res = await conn.serverRequest(
        `https://api.arboxapp.com/index.php/api/v1/tasks/226/betweenDates/1?page=${page}`,
        'post',
        {
          fromDate,
          toDate,
          tabType: 'allTasks',
          filterByTask: null,
          filterByLocationBox: null,
        }
      );
      return res.data;
    };

    let page = 0;
    let pageResults: Arbox.Tasks | null;
    const allResults: Arbox.Tasks = {
      allTasks: [],
    };

    do {
      // eslint-disable-next-line no-plusplus,no-await-in-loop
      pageResults = await getTaskPage(page++);
      allResults.allTasks = allResults.allTasks.concat(pageResults.allTasks);
    } while (pageResults.allTasks.length > 0);

    return allResults;
  }

  async getBirthdays(
    from = moment().startOf('week').toDate(),
    to = moment().endOf('week').toDate()
  ): Promise<[Arbox.Birthday]> {
    const conn = await this.ensureConnection();
    const {data} = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/user/GetTodayBirthdays/${this.connection.config.boxId}`,
      'post',
      {
        fromDate: moment(from).format('YYYY-MM-DD'),
        toDate: moment(to).format('YYYY-MM-DD'),
      }
    );
    return data;
  }

  async getLessons(
    fromDate: Date | string,
    toDate: Date | string,
    location = this.connection.config.boxId
  ): Promise<Schedule.Lesson> {
    const conn = await this.ensureConnection();

    const queryParams = queryString.stringify({
      fromDate: moment(fromDate).format('YYYY-MM-DD'),
      toDate: moment(toDate).format('YYYY-MM-DD'),
      location,
    });

    const {data} = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/rangeSchedule/${this.connection.config.boxId}?${queryParams}`,
      'GET'
    );
    return data;
  }

  async getLessonMembers(lessonId: number): Promise<Schedule.LessonMembers> {
    const conn = await this.ensureConnection();
    const {data} = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/schedule/${lessonId}/members`,
      'GET'
    );
    return data;
  }

  async searchByName(query: string): Promise<SearchQueryResult> {
    const conn = await this.ensureConnection();
    const {data} = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/searchForMember/${encodeURIComponent(
        query
      )}`,
      'GET'
    );
    return data;
  }

  async getMembersProperties(): Promise<Reports.MemberProperties> {
    const conn = await this.ensureConnection();
    const {data} = await conn.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/box/226/checkboxesUserBox`,
      'POST'
    );

    return data;
  }

  private async ensureConnection() {
    await this.connection.forceConnection();
    return this.connection;
  }
}
