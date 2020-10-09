'use strict'
var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');
var userController;
var User = require('../models/user');
var userFactory = require('./testFactories/userFactory');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwtService');
var fs = require('fs');

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('../resources/messages.properties');

describe("User Controller", function() {
    var responseMock,
        requestMock, sendSpy, statusSpy;

    beforeEach(function() {
        requestMock = {
            body: {},
            params: {}
        };

        responseMock = {
            status: function () {
                return responseMock;
            },
            send: function () {},
            sendFile: function () {}
        };
        userController = require('../controllers/userController');
    });


    describe('saveUser', function () {
        var saveStub,hashStub;
        before(function(){
            hashStub = sinon.stub(bcrypt, 'hash');
            hashStub.callsFake(function(a, b ,c, callback){
                callback(null, "passwordHashed");   
            });
        });
        after(function(){
            hashStub.restore();
        });
        beforeEach(function(){
            sendSpy = sinon.spy(responseMock, 'send');
            statusSpy = sinon.spy(responseMock, 'status');
            saveStub = sinon.stub(User.prototype, 'save');
            requestMock.body = userFactory.validUser;

        });
        afterEach(function(){
           saveStub.restore();
        })

        it('Should try to hash the password if no user error', function(){
            userController.saveUser(requestMock, responseMock);
            expect(hashStub.called).to.be.true;
        });

        it('should send 500 on save error', function () {
            var error = new Error();  
             saveStub.callsFake(function (callBack) {
                callBack(error, null);
            })
 
            userController.saveUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(500);
        });
         it('should send userController.save.error on save error', function () {
            var error = new Error();  
            var errorMessage =  properties.get('userController.save.error');
             saveStub.callsFake(function (callBack) {
                callBack(error, null);
            })

            userController.saveUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });

         it('should send 404 if no user saved', function () {
             saveStub.callsFake(function (callBack) {
                callBack(null, null);
            })

            userController.saveUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(404);
        });
         it('should send userController.save.error if no user saved', function () {
            var errorMessage =  properties.get('userController.save.error');
             saveStub.callsFake(function (callBack) {
                callBack(null, null);
            })

            userController.saveUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });

          it('should send 200 if user saved', function () {
             saveStub.callsFake(function (callBack) {
                callBack(null, userFactory.validUser);
            })

            userController.saveUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });
         it('should return the user if user saved', function () {
            var errorMessage =  properties.get('userController.save.error');
             saveStub.callsFake(function (callBack) {
                callBack(null, userFactory.validUser);
            })

            userController.saveUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].user).to.be.equal(userFactory.validUser);
        });

        it('should send 200 if no name supplied', function () {
            requestMock.body.name = null;
            userController.saveUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });

        it('should send userController.datosInsuficientes message if no name supplied', function () {
            var errorMessage =  properties.get('userController.datosInsuficientes');
            requestMock.body.name = null;
            userController.saveUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });

         it('should send 200 if no surname supplied', function () {
            requestMock.body.surname = null;
            userController.saveUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });

        it('should send userController.datosInsuficientes message if no surname supplied', function () {
            var errorMessage =  properties.get('userController.datosInsuficientes');
            requestMock.body.surname = null;
            userController.saveUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });

        it('should send 200 if no email supplied', function () {
            requestMock.body.email = null;
            userController.saveUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });

        it('should send userController.datosInsuficientes message if no email supplied', function () {
            var errorMessage =  properties.get('userController.datosInsuficientes');
            requestMock.body.email = null;
            userController.saveUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });

         it('should send 200 if no password supplied', function () {
            requestMock.body.password = null;
            userController.saveUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });

        it('should send userController.datosInsuficientes message if no password supplied', function () {
            var errorMessage =  properties.get('userController.datosInsuficientes');
            requestMock.body.password = null;
            userController.saveUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });

    });

    describe('loginUser', function () {
        var saveStub, statusSpy, sendSpy, compareStub, findOneStub, createTokenStub;
        before(function(){
            compareStub = sinon.stub(bcrypt, 'compare');
            createTokenStub = sinon.stub(jwt, 'createToken');

        });
        after(function(){
            compareStub.restore();
        });
        beforeEach(function(){
            requestMock.body.email = 'valid@email.com';
            requestMock.body.password = 'thisismypassword';
            findOneStub = sinon.stub(User, 'findOne');
            sendSpy = sinon.spy(responseMock, 'send');
            statusSpy = sinon.spy(responseMock, 'status');
            saveStub = sinon.stub(User.prototype, 'save');

        });
        afterEach(function(){
           saveStub.restore();
           findOneStub.restore();
        })

        it('should send 200 if email is null', function () {
            requestMock.body.email = null;
            userController.loginUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });
        it('should response with userController.datosInsuficientes if email is null', function () {
            var errorMessage =  properties.get('userController.datosInsuficientes');
            requestMock.body.email = null;
            userController.loginUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });
        it('should send 200 if password is null', function () {
            requestMock.body.password = null;
            userController.loginUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });
        it('should response with userController.datosInsuficientes if password is null', function () {
            var errorMessage =  properties.get('userController.datosInsuficientes');
            requestMock.body.password = null;
            userController.loginUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });

        it('should response with 500 if there is an error finding the user', function () {
            var error = new Error();  
            findOneStub.callsFake(function (email, callBack) {
                callBack(error, null);
            })
            userController.loginUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(500);
        });
        it('should response with userController.login.error if there is an error finding the user', function () {
            var error = new Error();  
            var errorMessage =  properties.get('userController.login.error');
            findOneStub.callsFake(function (email, callBack) {
                callBack(error, null);
            })
            userController.loginUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });

          it("should response with 404 if the user doesn't exists", function () {
            findOneStub.callsFake(function (email,callBack) {
                callBack(null, null);
            })
            userController.loginUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(404);
        });
        it("should response with userController.login.error if the user doesn't exists", function () {
            var errorMessage =  properties.get('userController.login.error');
            findOneStub.callsFake(function (email,callBack) {
                callBack(null, null);
            })
            userController.loginUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });

           it("should response with 500 if there is an error checking the password", function () {
            findOneStub.callsFake(function (email,callBack) {
                callBack(null, userFactory.validUser);
            });
            var error = new Error();  
            compareStub.callsFake(function(a, b , callback){
                callback(error, null);   
            });
            userController.loginUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(500);
        });
        it("should response with userController.login.error if there is an error checking the password", function () {
            findOneStub.callsFake(function (email,callBack) {
                callBack(null, userFactory.validUser);
            });
            var error = new Error();  
            var errorMessage =  properties.get('userController.login.error');
            compareStub.callsFake(function(a, b , callback){
                callback(error, null);   
            });
            userController.loginUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });

        it("should response with 500 if the password doesn't match", function () {
            findOneStub.callsFake(function (email,callBack) {
                callBack(null, userFactory.validUser);
            });
            compareStub.callsFake(function(a, b , callback){
                callback(null, false);   
            });
            userController.loginUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(500);
        });
        it("should response with userController.login.error if there is an error checking the password", function () {
            findOneStub.callsFake(function (email,callBack) {
                callBack(null, userFactory.validUser);
            });
            var errorMessage =  properties.get('userController.login.error');
            compareStub.callsFake(function(a, b , callback){
                callback(null, false);   
            });
            userController.loginUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });

        it("should response with 200 if the password match", function () {
            findOneStub.callsFake(function (email,callBack) {
                callBack(null, userFactory.validUser);
            });
            compareStub.callsFake(function(a, b , callback){
                callback(null, true);   
            });
            userController.loginUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });

        it("should create the token if the password match and there is no jwt token", function () {
            var token = 'toooken';
            requestMock.body.gethash = "true";
            findOneStub.callsFake(function (email,callBack) {
                callBack(null, userFactory.validUser);
            });
            compareStub.callsFake(function(a, b , callback){
                callback(null, true);   
            });
            createTokenStub.callsFake(function(user){
                return token;   
            });
            
            userController.loginUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].token).to.be.equal(token);
        });

        it("should response with the user if there is a token already", function () {
            var token = "token";
            findOneStub.callsFake(function (email,callBack) {
                callBack(null, userFactory.validUser);
            });
            compareStub.callsFake(function(a, b , callback){
                callback(null, true);   
            });

            userController.loginUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].user).to.be.equal( userFactory.validUser);
        });

    });

    describe('updateUser', function(){
        var findByIdStub, statusSpy, sendSpy;
         before(function(){
        });
        after(function(){

        });
        beforeEach(function(){
            findByIdStub = sinon.stub(User, 'findByIdAndUpdate');
            sendSpy = sinon.spy(responseMock, 'send');
            statusSpy = sinon.spy(responseMock, 'status');
            requestMock.params.id='id';
        });
        afterEach(function(){
           findByIdStub.restore();
        });
        it('should response with 500 on update error', function(){
            findByIdStub.callsFake(function(fakeId, fakeUser, callback){
                var error = new Error();
                callback(error, null);
            });
            userController.updateUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(500);
        });
        it('should response with userController.update.error on update error', function(){
            var errorMessage = properties.get('userController.update.error');
            findByIdStub.callsFake(function(fakeId, fakeUser, callback){
                var error = new Error();
                callback(error, null);
            });
            userController.updateUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });
        it('should response with 404 on user not found', function(){
            findByIdStub.callsFake(function(fakeId, fakeUser, callback){
                callback(null, null);
            });
            userController.updateUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(404);
        });
        it('should response with userController.update.error on user not found', function(){
            var errorMessage = properties.get('userController.update.error');
            findByIdStub.callsFake(function(fakeId, fakeUser, callback){
                callback(null, null);
            });
            userController.updateUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });
        it('should response with 200 on user updated', function(){
            var user = userFactory.validUser;
            findByIdStub.callsFake(function(fakeId, fakeUser, callback){
                callback(null, user);
            });
            userController.updateUser(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });
        it('should response with the user on user updated', function(){
            var user = userFactory.validUser;
            findByIdStub.callsFake(function(fakeId, fakeUser, callback){
                callback(null, user);
            });
            userController.updateUser(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].user).to.be.equal(user);
        });
    });
    
    describe('uploadImage', function(){
        var findByIdStub, statusSpy, sendSpy;
        before(function(){
        });
        after(function(){

        });
        beforeEach(function(){
            findByIdStub = sinon.stub(User, 'findByIdAndUpdate');
            sendSpy = sinon.spy(responseMock, 'send');
            statusSpy = sinon.spy(responseMock, 'status');
            //requestMock.params.id='idUser';
            requestMock.files = {image: {path:'imagePath\\imageFile.jpg'}};
        });
        afterEach(function(){
           findByIdStub.restore();
        });
        it('should response with 200 if there is no file image', function(){
            requestMock.files = null; 
            userController.uploadImage(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });
        it('should response with userController.update.image.error if there is no file image', function(){
            var errorMessage = properties.get('userController.update.image.error');
            requestMock.files = null; 
            userController.uploadImage(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });
        it('should response with 200 if image extension is wrong', function(){
            requestMock.files.image.path="imagePath\\imageFile.txt";
            userController.uploadImage(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });
         it('should try to store image if extension is jpg', function(){
            requestMock.files.image.path="imagePath\\imageFile.jpg";
            userController.uploadImage(requestMock, responseMock);
            expect(findByIdStub.called).to.be.true;
        });
         it('should try to store image if extension is png', function(){
            requestMock.files.image.path="imagePath\\imageFile.png";
            userController.uploadImage(requestMock, responseMock);
            expect(findByIdStub.called).to.be.true;
        });
         it('should try to store image if extension is gif', function(){
            requestMock.files.image.path="imagePath\\imageFile.gif";
            userController.uploadImage(requestMock, responseMock);
            expect(findByIdStub.called).to.be.true;
        });
        it('should response with userController.update.image.extension.error if image extension is wrong', function(){
            var errorMessage = properties.get('userController.update.image.extension.error');
            requestMock.files.image.path="imagePath\\imageFile.txt";
            userController.uploadImage(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });
        it('should response with 200 on user image updated', function(){
            var user = userFactory.validUser;
            findByIdStub.callsFake(function(fakeId, fakeImage, callback){
                callback(null, user);
            });
            userController.uploadImage(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });
        it('should response with the user on user image updated', function(){
            var user = userFactory.validUser;
            findByIdStub.callsFake(function(fakeId, fakeImage, callback){
                callback(null, user);
            });
            userController.uploadImage(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].user).to.be.equal(user);
        });
    });

    describe('getImageFile', function(){
        var fsExistsStub, sendFileSpy;
        before(function(){
        });
        after(function(){

        });
        beforeEach(function(){
            requestMock.params.imageFile ='imagename';
            fsExistsStub = sinon.stub(fs, 'exists');
            sendSpy = sinon.spy(responseMock, 'send');
            statusSpy = sinon.spy(responseMock, 'status');
            sendFileSpy = sinon.spy(responseMock, 'sendFile');
        });
        afterEach(function(){
           fsExistsStub.restore();
        });
        it('should send the file image if it exists', function(){

            fsExistsStub.callsFake(function(fakePath,callback){
                callback(true);
            });
            userController.getImageFile(requestMock, responseMock);
            expect(fsExistsStub.called).to.be.true;
        });

        it("should response with 200 if image doesn't exists", function(){

            fsExistsStub.callsFake(function(fakePath,callback){
                callback(false);
            });
            userController.getImageFile(requestMock, responseMock);
            expect(statusSpy.getCall(0).args[0]).to.be.equal(200);
        });


        it("should response with userController.get.image.not.found if image doesn't exists", function(){
            var errorMessage = properties.get('userController.get.image.not.found');
            fsExistsStub.callsFake(function(fakePath,callback){
                callback(false);
            });
            userController.getImageFile(requestMock, responseMock);
            expect(sendSpy.getCall(0).args[0].message).to.be.equal(errorMessage);
        });
        
    })
});
