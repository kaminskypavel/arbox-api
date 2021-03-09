import {config} from 'dotenv';
import ArBoxApp from './ArBoxApp';

config();

describe('ArBoxApp', () => {
  const {
    ARBOX_BOX_ID="",
    ARBOX_BOX_NAME = '',
    ARBOX_LOCATION_ID = '',
    ARBOX_SESSION_JWT = '',
    ARBOX_EMAIL="",
    ARBOX_PASSWORD="",
  } = process.env;
  const arbox = new ArBoxApp(
    Number(ARBOX_BOX_ID),
    ARBOX_BOX_NAME,
    Number(ARBOX_LOCATION_ID),
    ARBOX_SESSION_JWT,
    ARBOX_EMAIL,
    ARBOX_PASSWORD
  );

  describe('#getAllActiveCustomers', () => {
    it('should return a list of customers', async () => {
      const allCustomers = await arbox.getAllActiveCustomers();
      expect(allCustomers.length).toBeGreaterThan(0);
    });
  });
});
