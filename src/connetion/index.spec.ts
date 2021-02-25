import ArBoxAppConnection from '.';

describe('ArBoxAppConnection', () => {
  const arboxConnetion = new ArBoxAppConnection({
    boxId: 224,
    boxName: 'CrossFitPanda',
    username: 'dummy-username',
    password: 'dummy-password',
  });

  describe('#connect', () => {
    it('should fail to connect with wrong credentials', async () => {
      await expect(arboxConnetion.generateSessionToken()).rejects.toThrowError("cant login with your credentials : Error: Request failed with status code 400");
    });
  });

  describe('#isConnected', () => {
    it('should return false if not connected', async () => {
      expect(await arboxConnetion.isConnected()).toBeFalsy();
    });
  });
});
