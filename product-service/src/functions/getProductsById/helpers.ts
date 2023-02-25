import { RawProduct } from "@functions/types";
import { mockResult } from "@functions/mocks";

export const getById = async (id: string): Promise<RawProduct> =>
  Promise.resolve(mockResult.find((el) => el.id === Number(id)));
