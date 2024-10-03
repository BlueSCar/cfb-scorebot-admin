import { getToken } from '#auth';

export default eventHandler(async (event) => {
  const token = await getToken({ event, raw: true });

  return token || 'no token present';
});
