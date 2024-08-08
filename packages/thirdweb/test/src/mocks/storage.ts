import { http, HttpResponse } from 'msw';
import { getThirdwebDomains } from '../../../src/utils/domains.js';

export const uploadMock = (mockHash: string) => http.post(`https://${getThirdwebDomains().storage}/ipfs/upload`, async () => {
  return HttpResponse.json({
    IpfsHash: mockHash
  })
});

export const downloadMock = (mockData: unknown) => http.get('https://*.ipfscdn.io/ipfs/:hash/:id', async () => {
  return HttpResponse.json(mockData ?? {});
});

