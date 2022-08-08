const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const events = require('events');
const nodemailer = require('nodemailer');
const passport = require('passport');
const testRouter  = express.Router();
const userModel = mongoose.model('User');
const performanceModel = mongoose.model('Performance');
const eventModel = mongoose.model('Event');

const devtestquestionModel = mongoose.model('Devtestquestion');
const newtestquestionModel = mongoose.model('Newtestquestion');

const tpModel = mongoose.model('Testparam');
const tsModel = mongoose.model('Teststart');
const questionModel = mongoose.model('Testquestion');
const answerModel = mongoose.model('Testanswer');
const tempactquesModel = mongoose.model('Tempacttestquestion');
const tempquestionModel = mongoose.model('Temptestquestion');
const temptpModel = mongoose.model('Temptestparam');
 
//libraries and middlewares
const config = require('./../../config/config.js');
const responseGenerator = require('./../../libs/responseGenerator');
const auth = require("./../../middlewares/auth");
const random = require("randomstring");
var ObjectId = require('mongodb').ObjectID;
const spawn = require("child_process").spawn;
const fs = require('fs');
mongoose.set('useFindAndModify', false);
// *********** ALL API'S ********************//
function makeid(length) {
    var result           = [];
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

async function tempactquesModel_find(test_data, json_data) {
	tempactquesModel.find({Area: json_data.selectedArea, Subject: json_data.selectedSubject, Course: json_data.selectedCourse, Chapter_Name: json_data.selectedChapters, Topic: json_data.selectedtopics},  (err, result)=> {
		if (err) {
			let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
			res.send(response);
		} else if (!result) {
			let response = reresponseGenerator.generate(false, "No Areas Available", 200, result);
			res.send(response);
		} else {
			var categories = {}
			result.forEach(item => {
				if (item.Difficulty == 'Medium') item.Difficulty = 'Med'
				var str_key = item.QTYPE + "-" + item.Type + "-" + item.Difficulty;
				if (categories[str_key] !== undefined) {
					categories[str_key]['n'] = categories[str_key]['n'] + 1;
				} else {
					categories[str_key] = {
						'n': 1,
						'cr': 0
					}
				}
			});
			test_data['chapters'][key][topic] = categories;
			test_data['chapter'] = key;
			test_data['topic'] = topic;
		}
	})
	return test_data
}

async function test_data_chapter(test_data, json_data) {
	for (const [key, topic] of Object.entries(json_data.selectedtopics)) {
		test_data['chapters'][key] = {};
		var data={
			area: json_data.selectedArea,
			subject: json_data.selectedSubject,
			course: json_data.selectedCourse,
			chapter: key,
			topic: topic
		};
		test_data['chapters'][key][topic] = {};
		test_data = await tempactquesModel_find(test_data, json_data);
	};
	return test_data;
}

module.exports.controller = (app)=>{
	//route to get the current user
	testRouter.get('/currentUser',(req,res)=>{
		let user=req.user;
		res.send(user);
	});
	
	//route to get the all  users
	testRouter.get('/allusers/:role',(req,res)=>{
		userModel.find({'role': req.params.role},(err,users)=>{
			if (err) {
				let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
				res.send(response);
			} else if (!users) {
				let response = responseGenerator.generate(false, "No Users registered in the system:(", 200, result);
				res.send(response);
			} else {
				let response = responseGenerator.generate(false, "Users Available", 200, users);
				res.send(response);
			}

		});
	});

	//route to get the all  users
	testRouter.get('/allstudents',(req,res)=>{
		userModel.find({'role': 'student'},(err,users)=>{
			if (err) {
				let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
				res.send(response);
			} else if (!users) {
				let response = responseGenerator.generate(false, "No Users registered in the system:(", 200, result);
				res.send(response);
			} else {
				let response = responseGenerator.generate(false, "Users Available", 200, users);
				res.send(response);
			}

		});
	});

	//route to get the all  users
	testRouter.get('/allmembers',(req,res)=>{
		userModel.find({'role': 'instructor'},(err,users)=>{
			if (err) {
				let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
				res.send(response);
			} else if (!users) {
				let response = responseGenerator.generate(false, "No Users registered in the system:(", 200, result);
				res.send(response);
			} else {
				let response = responseGenerator.generate(false, "Users Available", 200, users);
				res.send(response);
			}

		});
	});

	//route to get the all  users
	testRouter.put('/edit/:uid',(req,res)=>{
		age = parseInt(new Date().getFullYear()) - parseInt(req.body.birthday.substr(0, 4));
		var user = {
			'name'		: req.body.firstname + ' ' + req.body.lastname,
			'initials'  : req.body.initials,
			'email'		: req.body.email,
			'sex'		: req.body.sex,
			'birthday'  : req.body.birthday,
			'age'		: age,
			'address'   : req.body.address,
			'city'		: req.body.city,
			'zipcode'	: req.body.zipcode,
			'role'		: req.body.role,
		}
		userModel.findOneAndUpdate({'_id': req.params.uid}, user, (err,user)=>{
			if (err) {
				let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
				res.send(response);
			} else if (!user) {
				let response = responseGenerator.generate(false, "No Users registered in the system:(", 200, user);
				res.send(response);
			} else {
				let response = responseGenerator.generate(false, "Users Available", 200, user);
				res.send(response);
			}
		});
	});

	// API to get all tests in DB
	testRouter.get('/allTests',  (req, res) =>{
		tpModel.find({
			'registered_users.id': ObjectId(req.params.tid)
		},  (err, result)=> {
			if (err) {
				let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
				res.send(response);
			} else if (!result) {
				let response = responseGenerator.generate(false, "No Tests Available", 200, result);
				res.send(response);
			} else {
				let response = responseGenerator.generate(false, "Tests Available", 200, result);
				res.send(response);
			}
		});
	});

	// API to get data for report
	testRouter.get('/report/:tid/:uid', function (req, res) {
			performanceModel.findOne({
				'testId': req.params.tid
			},  (err, Performance) =>{
				if (err) {
					let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
					res.send(response);
				} else {
					questionModel.findOne({
						'_id': Performance.question_id
					},  (err, questions) =>{
						if (err) {
							let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
							res.send(response);
						} else {
							answerModel.findOne({
								'_id': Performance.answer_id
							},  (err, correct_answers) =>{
								if (err) {
									let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
									res.send(response);
								} else {
									var result = Performance;
									const real_answers = Performance.answers;
									result['_doc']['performenced_questions'] = questions.questions;
									result['_doc']['correct_answers'] = correct_answers.answers;
									result['_doc']['your_answers'] = real_answers;
									let response = responseGenerator.generate(false, "Test Details", 200, result);
									res.send(response);
								}
							});	
						}
					});			
				}
			});
		});

	// API to get a complete details of test
	testRouter.get('/test/:tid', function (req, res) {
			tpModel.findOne({
				'_id': req.params.tid
			},  (err, result) =>{
				if (err) {
					let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
					res.send(response);
				} else {
					let response = responseGenerator.generate(false, "Test Details", 200, result);
					res.send(response);				
				}
			});
		});

	// API to get a test questions
	testRouter.get('/alltestquestions', function (req, res) {
		tpModel.find({},  (err, result) =>{
			if (err) {
				let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
				res.send(response);
			} else {
				let response = responseGenerator.generate(false, "Test Details", 200, result);
				res.send(response);
			}
		});
	});

	// API to delete test
	testRouter.get('/test/delete/:id',  (req, res)=> {
		tpModel.findOneAndRemove({
			'_id': req.params.id
		},  (err)=> {
			if (err) {
				let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
				res.send(response);
			} else {
				let response = responseGenerator.generate(false, "Test Deleted", 200, null);
				res.send(response);
			}
		});
	});

	// API to delete user
	testRouter.get('/delete/:id',  (req, res)=> {
		userModel.findOneAndRemove({
			'_id': req.params.id
		},  (err)=> {
			if (err) {
				let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
				res.send(response);
			} else {
				let response = responseGenerator.generate(false, "User Deleted", 200, null);
				res.send(response);
			}
		});
	});

	testRouter.get('/allevents',(req,res)=>{
		eventModel.find({
			
		},  (err, result)=> {
			if (err) {
				let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
				res.send(response);
			} else if (!result) {
				let response = responseGenerator.generate(false, "No Events Available", 200, result);
				res.send(response);
			} else {
				let response = responseGenerator.generate(false, "Events Available", 200, result);
				res.send(response);
			}
		});
	})

	testRouter.get('/alldiciplines/:eventnamedate',(req,res)=>{
		eventdate = req.params.eventnamedate.split(" - ")[0];
		eventname = req.params.eventnamedate.split(" - ")[1];
		var diciplines = [];
		eventModel.find({'eventdate': eventdate, 'eventname': eventname},  (err, result)=> {
			if (err) {
				let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
				res.send(response);
			} else if (!result) {
				let response = responseGenerator.generate(false, "No Events Available", 200, result);
				res.send(response);
			} else {
				result.forEach(item=> {
					diciplines.push(item.discipline)
				})
				var filtered = diciplines.filter(function (el) {
				 	return el != null;
				});
				let response = responseGenerator.generate(false, "Events Available", 200, filtered);
				res.send(response);
			}
		});
	})

	
	app.use('/user',auth.verifyToken,testRouter);	
}


