import { catalogBatchProcess } from './handler';
import { addProduct } from '../handlers';

jest.mock('../handlers', () => ({
  addProduct: jest.fn(),
}));

const mockSNSPublish = jest.fn().mockReturnValue({ promise: jest.fn() });
jest.mock('aws-sdk', () => ({
  SNS: jest.fn().mockImplementation(function () {
    this.publish = mockSNSPublish;
  }),
}));

describe('catalogBatchProcess', () => {
  const baseEvent = {
    Records: [
      {
        messageId: undefined,
        receiptHandle: undefined,
        body: JSON.stringify({
          title: 'Test 1',
          price: '299',
          description: 'Test 1 description',
          image: 'https://api.lorem.space/image/shoes?w=640&h=480&r=1286',
          count: '17',
        }),
        attributes: undefined,
        messageAttributes: undefined,
        md5OfBody: undefined,
        eventSource: undefined,
        eventSourceARN: undefined,
        awsRegion: undefined,
      },
      {
        messageId: undefined,
        receiptHandle: undefined,
        body: JSON.stringify({
          title: 'Test 2',
          price: '99',
          description: 'Test 2 description',
          image: 'https://api.lorem.space/image/shoes?w=640&h=480&r=1235',
          count: '4',
        }),
        attributes: undefined,
        messageAttributes: undefined,
        md5OfBody: undefined,
        eventSource: undefined,
        eventSourceARN: undefined,
        awsRegion: undefined,
      },
    ],
  };

  it('should create products and publish message', async () => {
    (addProduct as jest.Mock).mockReturnValue(Promise.resolve());
    await catalogBatchProcess(baseEvent);
    expect(addProduct).toHaveBeenCalledTimes(2);
    expect((addProduct as jest.Mock).mock.calls[0][0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: 'Test 1 description',
          image: 'https://api.lorem.space/image/shoes?w=640&h=480&r=1286',
          price: 299,
          title: 'Test 1',
        }),
        expect.objectContaining({ count: 17 }),
      ])
    );
    expect((addProduct as jest.Mock).mock.calls[1][0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: 'Test 2 description',
          image: 'https://api.lorem.space/image/shoes?w=640&h=480&r=1235',
          price: 99,
          title: 'Test 2',
        }),
        expect.objectContaining({ count: 4 }),
      ])
    );

    expect(mockSNSPublish).toHaveBeenCalledTimes(1);
    expect(JSON.parse(mockSNSPublish.mock.calls[0][0].Message)).toEqual([
      {
        count: '17',
        description: 'Test 1 description',
        image: 'https://api.lorem.space/image/shoes?w=640&h=480&r=1286',
        price: '299',
        title: 'Test 1',
      },
      {
        count: '4',
        description: 'Test 2 description',
        image: 'https://api.lorem.space/image/shoes?w=640&h=480&r=1235',
        price: '99',
        title: 'Test 2',
      },
    ]);
  });

  it('should not publish message if products not created', async () => {
    (addProduct as jest.Mock).mockReset();
    mockSNSPublish.mockReset();
    (addProduct as jest.Mock).mockRejectedValue(
      Promise.reject('TransactionCanceledException: Transaction cancelled')
    );
    await catalogBatchProcess(baseEvent);

    expect(addProduct).toHaveBeenCalledTimes(2);
    expect(mockSNSPublish).toHaveBeenCalledTimes(0);
  });
});
