export const link = (path = ''): string =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const repository = 'https://github.com/edkhv/TraderAI.su';
