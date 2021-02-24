// Built With ♡ 'PK' (www.pavel-kaminsky.com)
// All Rights Reserved1.

import axios from 'axios';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as moment from 'moment';
import * as queryString from 'query-string';
import { IArBoxApp, IArBoxAppConfig, IArBoxAppConnection } from './IArBoxApp';
import {
  Arbox, ConvertedLead, EnedeMembership, Lead, LeadExtended, Schedule,
} from './types/arbox';
import Tasks = Arbox.Tasks;
import Birthday = Arbox.Birthday;
import ActiveMember = Arbox.ActiveMember;
import Task = Arbox.Task;
import SystemUser = Arbox.SystemUser;
import TaskType = Arbox.TaskType;
import Attendance = Schedule.Attendance;
import Transaction = Arbox.Transaction;
import MemberCustomer = Arbox.MemberCustomer;
import LeadSchedule = Arbox.LeadSchedule;

const SESSION_FILE = `${__dirname}/../session.txt`;

export class ArBoxApp implements IArBoxApp {
    private connection: IArBoxAppConnection;

    private boxId: number;

    constructor(boxId, username, password) {
      this.connection = new ArBoxAppConnetion(boxId, username, password);
      this.boxId = boxId;
    }

    private _debug: boolean;

    set debug(value: boolean) {
      this._debug = value;
      this.connection.debug = value;
    }

    private _demoMode: boolean;

    set demoMode(value: boolean) {
      this._demoMode = value;
      this.connection.demoMode = value;
    }

    async test() {

    }

    async getConnection(): Promise<IArBoxAppConnection> {
      await this.connection.forceConnection();
      return this.connection;
    }

    async getAllCustomers(): Promise<string> {
      const conn = await this.getConnection();
      const dataReq = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/box/${this.boxId}/getUsersAndLeadsJson`, 'get');
      return dataReq.data;
    }

    // מנויים פעילים
    async getAllActiveCustomers(): Promise<ActiveMember[]> {
      const conn = await this.getConnection();
      const dataReq = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/box/${this.boxId}/activeMembers/detailedReport/null`, 'get');
      return dataReq.data;
    }

    // ריכוז לקוחות פעילים
    // https://api.arboxapp.com/index.php/api/v1/box/226/getActiveUsersWithMembership
    async getActiveUsersWithMembership(): Promise<MemberCustomer[]> {
      const conn = await this.getConnection();
      const dataReq = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/box/${this.boxId}/getActiveUsersWithMembership`, 'get');
      return dataReq.data;
    }

    async getLeadAttendance(leadId: number | string): Promise<[Attendance]> {
      const conn = await this.getConnection();
      try {
        const dataReq = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/lead/${leadId}/schedules`, 'post');
        return dataReq.data;
      } catch (e) {
        return undefined;
      }
    }

    async getEndingMembership(fromDate = moment().format('YYYY-MM-DD'), toDate = moment().format('YYYY-MM-DD')): Promise<EnedeMembership[]> {
      const conn = await this.getConnection();
      const dataReq = await conn
        .serverRequest(`https://api.arboxapp.com/index.php/api/v1/user/getEndingMembership/${this.boxId}`, 'post',
          {
            fromDate,
            toDate,
            ended: true,
          });
      return dataReq.data;
    }

    async getAllCustomersExtraDataDump(): Promise<string> {
      const conn = await this.getConnection();
      const dataReq = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/user/${this.boxId}/extraData/`, 'post');
      return dataReq.data;
    }

    // https://api.arboxapp.com/index.php/api/v1/box/226/openLeads

    async getAllOpenLeads(): Promise<[Lead]> {
      const conn = await this.getConnection();
      const dataReq = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/box/${this.boxId}/openLeads/null`, 'get');
      return dataReq.data;
    }

    async getConvertedLeads(fromDate = moment().format('YYYY-MM-DD'), toDate = moment().format('YYYY-MM-DD')): Promise<[ConvertedLead]> {
      const conn = await this.getConnection();
      const dataReq = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/lead/getLeadConverted/${this.boxId}`, 'post',
        { fromDate, toDate });
      return dataReq.data;
    }

    async getTransactions(fromDate = moment().format('YYYY-MM-DD'), toDate = moment().format('YYYY-MM-DD')): Promise<[Transaction]> {
      const conn = await this.getConnection();
      const dataReq = await conn.serverRequest('https://api.arboxapp.com/index.php/api/v1/reports/global/transactions', 'post',
        { fromDate, toDate });
      return dataReq.data;
    }

    async addLead(firstName: string, lastName: string, phone: string,
      email = 'none@none.com',
      comment = `created at ${moment().format()}`,
      status = 1623,
      source = 1145,
      locationBoxFk = 282) {
      const conn = await this.getConnection();
      const dataReq = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/lead/${this.boxId}`,
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
        });
      return dataReq.data;
    }

    async getLead(leadId: number): Promise<LeadExtended> {
      const conn = await this.getConnection();

      const { data } = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/lead/getById/${leadId}`,
        'GET');

      return data;
    }

    async getLeadTasks(leadId: number): Promise<[Task]> {
      const conn = await this.getConnection();

      const { data } = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/tasks/${this.boxId}/lead/${leadId}`,
        'GET');

      return data;
    }

    async getLeadSchedule(leadId: number): Promise<[LeadSchedule]> {
      const conn = await this.getConnection();
      const { data } = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/lead/${leadId}/schedules`,
        'POST');

      return data;
    }

    async updateLeadStatus(leadId: number, comment = '', newStatus = '1629'): Promise<Lead> {
      const conn = await this.getConnection();
      const params = {
        boxId: this.boxId,
        comment,
        leadId,
        newStatus,
      };

      const { data } = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/lead/updateStatus/${leadId}`,
        'POST', params);

      return data;
    }

    async addUserTask(userId: number, description: string, taskType: TaskType, reminderDate: Date, systemUser?: SystemUser) {
      const conn = await this.getConnection();
      const { data } = await conn.serverRequest('https://api.arboxapp.com/index.php/api/v1/tasks',
        'post',
        {
          systemUser,
          boxFk: this.boxId,
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
        });
      return data;
    }

    async getAllTasks(fromDate = moment().startOf('week').format('YYYY-MM-DD'),
      toDate = moment().endOf('week').format('YYYY-MM-DD')): Promise<Tasks> {
      const conn = await this.getConnection();

      const getTaskPage = async (page = 1): Promise<Tasks> => {
        const res = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/tasks/226/betweenDates/1?page=${page}`, 'post',
          {
            fromDate,
            toDate,
            tabType: 'allTasks',
            filterByTask: null,
            filterByLocationBox: null,
          });
        return res.data;
      };

      let page = 0;
      let pageResults: Tasks | null;
      const allResults: Tasks = {
        allTasks: [],
      };

      do {
        pageResults = await getTaskPage(page++);
        allResults.allTasks = allResults.allTasks.concat(pageResults.allTasks);
      } while (pageResults.allTasks.length > 0);

      return allResults;
    }

    async getBirthdays(from = moment().startOf('week').toDate(),
      to = moment().endOf('week').toDate()): Promise<[Birthday]> {
      const conn = await this.getConnection();
      const { data } = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/user/GetTodayBirthdays/${this.boxId}`,
        'post',
        {
          fromDate: moment(from).format('YYYY-MM-DD'),
          toDate: moment(to).format('YYYY-MM-DD'),
        });
      return data;
    }

    async getLessons(fromDate: Date | string, toDate: Date | string, location = 282): Promise<Schedule.Lesson> {
      const conn = await this.getConnection();

      const queryParams = queryString.stringify({
        fromDate: moment(fromDate).format('YYYY-MM-DD'),
        toDate: moment(toDate).format('YYYY-MM-DD'),
        location,
      });

      const { data } = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/rangeSchedule/${this.boxId}?${queryParams}`, 'GET');
      return data;
    }

    async getLessonMembers(lessonId: number): Promise<Schedule.LessonMembers> {
      const conn = await this.getConnection();
      const { data } = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/schedule/${lessonId}/members`, 'GET');
      return data;
    }

    async searchByName(query: string): Promise<SearchQueryResult> {
      const conn = await this.getConnection();
      const { data } = await conn.serverRequest(`https://api.arboxapp.com/index.php/api/v1/searchForMember/${encodeURIComponent(query)}`, 'GET');
      return data;
    }
}

class ArBoxAppConnetion implements IArBoxAppConnection {
    config: IArBoxAppConfig;

    constructor(boxId, username, password) {
      this.config = {
        boxId, username, password, boxName: 'CrossFitPanda',
      };
    }

    private _debug: boolean;

    set debug(value: boolean) {
      this._debug = value;
    }

    private _demoMode: boolean;

    set demoMode(value: boolean) {
      this._demoMode = value;
    }

    async serverRequest(url: string, method: string, data?: {}) {
      if (this._debug) { console.log('[Debug] serverRequest :: ', method, url, data); }

      if (!this._demoMode) {
        const jwtSessionToken = await fs.readFileSync(SESSION_FILE);
        return axios({
          url,
          method,
          data,
          headers: {
            accessToken: jwtSessionToken,
            boxFK: this.config.boxId,
            'User-Agent': this.config.boxName,
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=UTF-8',
            Host: 'api.arboxapp.com',
            Origin: 'https://manage.arboxapp.com',
          },
        });
      }
      console.log('[Debug] serverRequest :: DEMO MODE! skipping a real server call');
      return Promise.resolve({ data: 'demo data' });
    }

    async isConnected(): Promise<boolean> {
      if (this._debug) { console.log('[Debug] isConnected :: checking if connected'); }

      const serverData = await this.serverRequest(`https://api.arboxapp.com/index.php/api/v1/notifications/byBox/${this.config.boxId}?page=1`, 'get')
        .catch(() => {
          if (this._debug) { console.log('[Debug] isConnected :: false'); }

          return null;
        });

      const res = !_.isNil(_.get(serverData, 'data'));

      if (this._debug) { console.log('[Debug] isConnected ::', res); }

      return res;
    }

    async connect(): Promise<void> {
      const serverData = await this.serverRequest(`https://api.arboxapp.com/index.php/api/v1/user/${this.config.username}/session`,
        'post',
        {
          email: this.config.username,
          password: this.config.password,
        })
        .catch((e) => {
          throw new Error(`cant login with your credentials : ${e}`);
        });

      const jwtSessionToken = serverData.data.token;

      if (this._debug) { console.log('[Debug] connect :: obtained jwtSession', jwtSessionToken); }

      await fs.writeFileSync(SESSION_FILE, jwtSessionToken);
    }

    async forceConnection(): Promise<void> {
      const isConnected = await this.isConnected();
      if (!isConnected) {
        await this.connect();
      }
    }
}
