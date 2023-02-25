import { RawProduct } from 'functions/types';
import { mockResult } from 'functions/mocks';

export const getList = async (): Promise<RawProduct[]> =>
  Promise.resolve(mockResult);
