const express = require('express');
const http = require('http');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const FileRouter = require('./routes/fileRouter');
const FolderRouter = require('./routes/folderRouter');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;

var app = express();
const server = http.createServer(app);

const connect = mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then((db) => {
    console.log("Connected to Database!");
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(FileRouter);
app.use(FolderRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});
