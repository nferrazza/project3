
const User = require('../../models/User');
const UserSession = require('../../models/UserSession');


module.exports = (app) => {
    //Signup route
        
    
    app.post('/api/account/signup', (req, res, next) => {
        const { body } = req;
        console.log('body', body);
        const { 
            firstName,
            lastName,
            password
        } = body;

        let {
            email
        } = body;

        if (!firstName) {
            return res.send({
                success: false,
                message: 'Error: First Name Cannot Be Blank.'
            });
        }
        
        if (!lastName) {
            return res.send({
                success: false,
                message: 'Error: Last Name Cannot Be Blank.'
            });
        }

        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email Cannot Be Blank.'
            });
        }

        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password Cannot Be Blank.'
            });
        }

        console.log('here');

        email = email.toLowerCase();
        email = email.trim();
        
        //Signup Steps:
        //1. Verify email doesn't exist
        //2. Saves email
        User.find({
            email: email
        },
        (err, previousUsers) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server Error.'
                });

            } else if (previousUsers.length > 0) {
            return res.send({
                    success: false,
                    message: 'Error: User Already Exists.'
                });
            }
            
            

            //Saves new user

            const newUser = new User();

            newUser.email = email;
            newUser.firstName = firstName;
            newUser.lastName = lastName;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server Error.'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Signed Up'
                });
            });
        });
    });


    app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;
        const { 
            password
        } = body;

        let {
            email
        } = body;

        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email Cannot Be Blank.'
            });
        }

        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password Cannot Be Blank.'
            });
        }


        email = email.toLowerCase();
        email = email.trim();

        User.find({
            email: email
        }, (err, users) => {
            if (err) {
                console.log('err 2', err);
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            if (users.length != 1){
                return res.send({
                    success: false,
                    message: 'Error: Invalid User Information'
                });
            }

            const user = users[0];
            if (!user.validPassword(password)){
                return res.send({
                    success: false,
                    message: 'Error: Invalid Password'
                });
            }

            //otherwise correct user

            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) => {
                if (err) {
                    console.log(err);
                    return res.send({
                        success: false,
                        message: 'Error: Server Error'
                    });
                }

                return res.send({
                    success: true,
                    message: 'Valid Sign In',
                    token: doc._id
                });
            });
        });
    });

    
    app.get('/api/account/logout', (req, res, next) => {
        //gets token
        const { query } = req;
        const { token } = query;
        // ?token=test

        //verify token is unique and is not deleted

        UserSession.findOneAndUpdate({
            _id: token,
            isDeleted: false
        }, {
            $set:{isDeleted : true
            }
        }, null,  (err, sessions) => {
            if (err) {
                console.log(err);
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            
            return res.send({
                success: true,
                message: 'Good'
            });
            
        });
    });


    app.get('/api/account/verify', (req, res, next) => {
        //get token
        const { query } = req;
        const { token } = query;
        // ?token=test

        //verify token is unique and is not deleted

        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, sessions) => {
            if (err) {
                console.log(err);
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            if (sessions.length != 1){
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            } else{
                //DO ACION
                return res.send({
                    success: true,
                    message: 'Good'
                });
            }
        });
    });


    app.get('/api/account/balance', (req, res, next) => {
        res.render(console.log('balance', {output: req.params.balance}));


    });


    

};
    

