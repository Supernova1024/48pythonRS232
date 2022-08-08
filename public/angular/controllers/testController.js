myApp.controller('testController',['$http','$q','$window','$stateParams','$filter','apiService','authService','$rootScope','$location','$state','$interval',function($http,$q,$window,$stateParams,$filter,apiService,authService,$rootScope,$location,$state, $interval){
	
	var test = this;
	this.tests=[];
	test.eventnamedate = '';
	test.disable_discipline = true;
	test.disable_del_discipline = true;
	test.events = [];
	test.areas=[];
	test.subjects=[];
	test.courses=[];
	test.courses=[];
	test.chapters=[];
	test.topics=[];
	test.openChapter = false;
	test.new_db_exist = false;
	test.step = [1,0,0,0]
	test.selectedtopics = [];
	test.newquestion = '';
	test.newcorrect = '';
	test.newalt_1 = '';
	test.newalt_2 = '';
	test.newalt_3 = '';
	test.newalt_4 = '';
	test.Objective = '';
	test.Accessibility = '';
	test.Units = '';
	test.Blooms = '';
	test.Table1 = '';
	test.Equation1 = '';
	test.Time = '';
	test.newquesName = '';
	test.preview_div = false;
	test.preview_div_err = false;
	test.preview_div_succ = false;
	test.prenewquestion = '';
	test.prenewcorrect = '';
	test.prenewalt_1 = '';
	test.prenewalt_2 = '';
	test.prenewalt_3 = '';
	test.prenewalt_4 = '';
	test.save_or_next = '';
	test.cha_topics = []
	test.view_test = [];
	test.new_Area = 0;
	test.new_Subject = 0;
	test.new_Course = 0;
	test.new_Chapter = 0;
	test.new_Topic = 0;
	test.temptpid = ''
	test.tempquestions = [];
	test.selectedstudents = [];
	test.total_credit = new Array([]);
	test.total_ques = new Array([]);
	test.test_questions = {};
	test.credit_questions= [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6, 6.25, 6.5, 6.75, 7, 7.25, 7.5, 7.75, 8, 8.25, 8.5, 8.75, 9, 9.25, 9.5, 9.75, 10];
	test.testName = '';
	test.expired = new Date(Date.parse(new Date()) + 30 * 24 * 60 * 60 * 1000); // Default duration is a week - 7 days
	test.initial = '';
	test.datetimetaken = new Date();
	test.blank_initial = false;
	test.loading_category = false;

	// to reset the form after submission
	this.resetForm=()=>{
		test.testid='',
		test.question='',
		test.optionA='',
		test.optionB='',
		test.optionC='',
		test.optionD='',
		test.answer=''
	};

	this.range = function(min, max, step){
		var input = [];
		step = step || 1;
		if (step == 0.25) {
			input = [0.1];
			for (var i = min; i <= max; i += step) input.push(i);
		} else {
			for (var i = min; i <= max; i += step) input.push({text: i + '/' + max,value: i});
		}
		return input;
	};
	//function to get the users who attempted the test
	this.enrolledUsers=()=>{
		test.loading = true;
		apiService.getallusertestdetails(tid).then( function successCallback(response){
			test.testattemptedBy = response.data.data;	
			test.loading = false;
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	};

	this.saveevent = ()=> {
		console.log("new_event", test.eventdate);
		// var eventdate = test.eventdate.getFullYear() + '-' + test.eventdate.getMonth() + '-' + test.eventdate.getDay()
		var dd = String(test.eventdate.getDate()).padStart(2, '0');
		var mm = String(test.eventdate.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = test.eventdate.getFullYear();
		var eventdate = yyyy + '-' + mm + '-' + dd;

		event = {
			eventname	: test.eventname,
			eventdate	: eventdate,
		}
		apiService.addEvent(event).then(function successCallBack(response){
			// console.log("response.data", response.data)
			$rootScope.test = response.data;
			$("#eventModal").modal('hide');
			apiService.getEvents().then(function successCallback(response){
				var events=response.data.data;
				events.forEach(function(event){
					test.events.push(event.eventdate + " - " + event.eventname);
				});
				test.events = [...new Set(test.events)]
				$location.path('/dashboard/events');
			})
			
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	};


	this.eventnamedatef=(data)=>{
		test.disable_discipline = false;
		test.eventnamedate = data;
		apiService.getDiciplines(data).then(function successCallback(response){
			test.diciplines_event = response.data.data;
		})
	}

	this.dicipline_active=(discipline)=>{
		test.disable_del_discipline = false;
		test.discipline = discipline;
		console.log("--------", test.discipline)
	}

	//function to get events
	this.getevents=()=>{
		apiService.getEvents().then(function successCallback(response){
			var events=response.data.data;
			events.forEach(function(event){
				test.events.push(event.eventdate + " - " + event.eventname);
			});
			test.events = [...new Set(test.events)]
		})
	}

	this.savediscipline = ()=> {
		console.log("new_discipline", test.discipline);
		eventdate = test.eventnamedate.split(" - ")[0]
		eventname = test.eventnamedate.split(" - ")[1]
		discipline = {
			discipline	: test.discipline,
			eventdate	: eventdate,
			eventname	: eventname
		}
		apiService.addDiscipline(discipline).then(function successCallBack(response){
			console.log("response.data", response.data)
			$rootScope.test = response.data;
			$("#disciplineModal").modal('hide');
			apiService.getDiciplines(test.eventnamedate).then(function successCallback(response){
				test.diciplines_event = response.data.data;
			})
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	};

	this.delevent=()=>{
		data = {
			eventnamedate : test.eventnamedate
		}
		apiService.delEvent(data).then(function successCallback(response){
			$rootScope.test = response.data;
			$("#eventdeleteModal").modal('hide');
			apiService.getEvents().then(function successCallback(response){
				var events=response.data.data;
				events.forEach(function(event){
					test.events.push(event.eventdate + " - " + event.eventname);
				});
				test.events = [...new Set(test.events)]
				$location.path('/dashboard/events');
			})
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	}

	this.delDiscipline=()=>{
		var data = {
			discipline 		: test.discipline,
			eventnamedate   : test.eventnamedate
		}
		apiService.delDiscipline(data).then(function successCallback(response){
			apiService.getDiciplines(test.eventnamedate).then(function successCallback(response){
				test.diciplines_event = response.data.data;
			})
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	}

	
}]);