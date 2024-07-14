export default () => ({
	port: process.env.PORT,
	client_id: process.env.CLIENT_ID,
	client_secret: process.env.CLIENT_SECRET,
	redirect_url: process.env.REDIRECT_URL
});