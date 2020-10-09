'use strict'
var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');
var beerController = require('../controllers/beerController');
var Beer = require('../models/beer');
var beerFactory = require('./testFactories/beerFactory');

var request, response, beerStub, populateStub, errorPopulateStub,notFoundPopulateStub, sendCallback, error;
var responseStub;
var saveStub;

describe.skip('beerController tests', function(){
	
	describe('save function', function(){
		beforeEach(function(){
			saveStub = sinon.stub(Beer.prototype, 'save');
		
		});
		it('should call save function', function(){
			beerController.save(request, response);
			expect(saveStub.called).to.be.true;
		});

		it('should call save function', function(){
			beerController.save(request, response);
			expect(saveStub.called).to.be.true;
		});
	}); 


	describe('get function', function(){
		beforeEach(function(){
			sendCallback =  sinon.spy();
			populateStub = {
				populate: function(object){
					return populateStub;
				},
				exec: function(callback){
					return callback(null, beerFactory.validBeer);
				}
			};


			errorPopulateStub = {
				populate: function(object){
					return errorPopulateStub;
				},
				exec: function(callback){
					return callback(error, null);
				}
			};

			
			notFoundPopulateStub = {
				populate: function(object){
					return notFoundPopulateStub;
				},
				exec: function(callback){
					return callback(null, null);
				}
			};



			response = {
				status: function(number){
					return null;
				}
			}; 
			beerStub = sinon.stub(Beer, 'findById');
			responseStub = sinon.stub(response, 'status');
			responseStub.returns({send: sendCallback});

			beerStub.withArgs(1).returns(populateStub);
			beerStub.withArgs(2).returns(notFoundPopulateStub);
			beerStub.withArgs(undefined).returns(errorPopulateStub);	
		}),
		afterEach(function(){
			Beer.findById.restore();
			response.status.restore();
		}),

		it('should try to populate the brewery first', function (){
			var spy = sinon.spy(populateStub, 'populate');

			request = {
				params: {
					id: 1
				}
			};
		
			beerController.get(request, response);
			expect(spy.getCall(0).args[0].path).to.be.equal('brewery');
			spy.restore();

		}),

		it('should try to populate the valorations second', function (){
			var spy = sinon.spy(populateStub, 'populate');

			request = {
				params: {
					id: 1
				}
			};
		
			beerController.get(request, response);
			expect(spy.getCall(1).args[0].path).to.be.equal('valorations');
			spy.restore();

		}),
		it('should try to populate the valorations users third', function (){
			var spy = sinon.spy(populateStub, 'populate');

			request = {
				params: {
					id: 1
				}
			};
		
			beerController.get(request, response);
			expect(spy.getCall(2).args[0].populate.path).to.be.equal('user');
			spy.restore();

		}),
		it('should response with 200 when param id is found', function (){
			request = {
				params: {
					id: 1
				}
			};
		
			beerController.get(request, response);
			expect(responseStub.getCall(0).args[0]).to.be.equal(200);
		}),
		it('should response with 404 when object is not found', function (){
			request = {
				params: {
					id: 2
				}
			};
		
			beerController.get(request, response);
			expect(responseStub.getCall(0).args[0]).to.be.equal(404);
		}),
		it('should response with 500 when error is found', function (){
			request = {
				params: {
					theId: 1
				}
			};
		
			beerController.get(request, response);
			expect(responseStub.getCall(0).args[0]).to.be.equal(500);
		});
	})


})