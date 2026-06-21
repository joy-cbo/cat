export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth_token', {
    path: '/',
  });
  
  return { message: '已退出登录' };
});
