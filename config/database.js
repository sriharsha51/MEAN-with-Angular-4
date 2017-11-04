const crypto =  require('crypto').randomBytes(256).toString('hex');


module.exports = {
  //  uri: 'mongodb://localhost:27017/mean-angular-2',
    uri: 'mongodb://harsha93:harsha@ds119565.mlab.com:19565/angular-4-app',//production
    secret: crypto, 
    db: 'angular-4-app'//name of db.
}//generally secret is used for tokens and other things.