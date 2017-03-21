const should = require("should");
const request = require("request");
const chai = require('chai');
const expect = require("chai").expect;
const baseUrl = "http://localhost:3000";
const util = require("util");

//describe and it allowing for better understanding of what the test aims to achieve
//chai expect allows the test to know what it is looking for, if it dosent match it fails
describe('returns users', function() {
    it('returns a json list of users', function(done) {
        request.get({ url: baseUrl + '/api/user/allUsers' },
            function(error, response, body) {
            		var bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200); 
                    console.log(body);
                    response.should.be.json;
                done();
            });
    });
});

describe('returns user gmarriott using username param', function() {
    it('returns a json list of user gmarriott', function(done) {
        request.get({ url: baseUrl + '/api/user/username/gmarriott' },
            function(error, response, body) {
            		var bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
                    expect(bodyObj[0].username).to.equal("gmarriott");
                    console.log(bodyObj);
                    done();
            });
    });
});


describe('attempts to post without authentication', function() {
    it('attempts to post without authentication - output', function(done) {
        request.post({
            url:     baseUrl + '/api/postapi/posts',
            form:    { title: "test title", desc: "test desc", sport: "test sport" }
            }, 
          function(error, response, body){
                 expect(response.statusCode).to.equal(200);
                 expect(body.title).to.not.equal(null);
                 expect(body.desc).to.not.equal(null);
                 expect(body.sport).to.not.equal(null);
                 console.log(body);
                 done();
              });
       });
});

describe('returns a specific post by _id', function() {
    it('returns the specific post using the _id', function(done) {
        request.get({ url: baseUrl + '/api/postapi/posts/58a62c39e7dfc13690bf7fb2' },
            function(error, response, body) {
            		var bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
                    expect(bodyObj[0].username).to.equal("gmarriott");
                    console.log(bodyObj);
                    done();
            });
    });
});

describe('Adds a new user using form data', function() {
    it('registers a new user', function(done) {
        request.post({
            url:     baseUrl + '/api/authentication/user/register',
            form:    { name: "New User", username: "mynewuser", email: "newemail.com", password:"newpassword" }
            }, 
          function(error, response, body){
                 expect(response.statusCode).to.equal(200);
                 expect(body.name).to.not.equal(null);
                 expect(body.username).to.not.equal(null);
                 expect(body.email).to.not.equal(null);
                 expect(body.password).to.not.equal(null);
                 console.log(body);
                 done();
              });
       });
});

//describe('deletes a post where the ID is equal to the params', function() {
//    it('deletes a post using the url params', function(done) {
//        request.delete({
//            url:     'http://localhost:3000/api/postapi/posts/:id',
//            }, 
//          function(error, response, body){
//                 expect(response.statusCode).to.equal(200);
//                 console.log(body);
//                 done();
//              });
//       });
//});
