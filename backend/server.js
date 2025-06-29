const app = require('./app');
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Weather Event Notifier API Server running on port ${PORT}`);
});
