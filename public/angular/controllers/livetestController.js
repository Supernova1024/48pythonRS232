myApp.controller('livetestController',['$http','$timeout','$scope','$stateParams','$filter','apiService','authService','$rootScope','$location','$state', function($http,$timeout,$scope,$stateParams,$filter,apiService,authService,$rootScope,$location,$state){
	var live=this;
	this.score=0;
	this.wrongAns=0;
	this.skipped=0;
	this.useroptions=[];
	live.questions = [];
	this.takenNum = 0;
	this.currentPage = 0;
	this.pageSize = 1;
	live.loading_category = true;
	//get the testtime and testid
	this.gettesttime_id=()=>{
		var data = {
			'testtime': $rootScope.num,
			'tid': $rootScope.tid,
			'userid': $rootScope.userID,
		}
		apiService.get_testtime_tid(data).then(function successCallBack(response){
			if (response.data.data) {
				var t = Date.parse(new Date()) - Date.parse(response.data.data.created);
				var seconds_delay = Math.floor(t / 1000);
				var seconds_testtime = response.data.data.testtime * 60;
				var seconds_remain = seconds_testtime - seconds_delay
				if (seconds_remain < 0) {
					$scope.testtime = 0;
				} else {
					$scope.testtime = seconds_remain;
				}
				live.loading_category = false;
			}
			
		});
	};
	this.gettesttime_id();

	//get the user detail
	this.getUserDetail=()=>{
		apiService.getUser().then(function successCallBack(response){
			live.email=response.data.email;
		});
	};
	this.getUserDetail();

	this.getreport=(tid, uid)=>{
		apiService.viewReport($rootScope.selected_tid, $rootScope.selected_uid).then(function(response) {
			// live.performenced_questions = response.data.data.performenced_questions;
			var questions = []
			for (const [key, value] of Object.entries(response.data.data.performenced_questions)) {
				var new_object = {}
				Object.keys(value.responses)
						.sort()
						.forEach(function(v, i){
							new_object[v] = value.responses[v]
						});
				value.responses = new_object
				result = value;
				var index = key.substring(1)
				correct_key = "A" + index;
				var correct_answer = response.data.data.correct_answers[0][correct_key]['correct']
				if (!response.data.data.your_answers[index] || !response.data.data.your_answers) {
					your_answer = 'skip'
				} else {
					your_answer = response.data.data.your_answers[index]['option']
				}
				result['correct_answer'] = correct_answer;
				result['your_answer'] = your_answer;

				questions.push(result)
			};
			live.performenced_questions = questions;
		});
	}

	this.getQuestions=()=>{
		apiService.viewQuestions($rootScope.question_id).then(function(response) {
			var total_duration_min = 0;
			var questions = []
			for (const [key, value] of Object.entries(response.data.data.questions)) {
				var new_object = {}
				Object.keys(value.responses)
						.sort()
						.forEach(function(v, i){
							new_object[v] = value.responses[v]
						});
				value.responses = new_object
				questions.push(value)
				total_duration_min += value['time'];
			};
			live.questions = questions.reverse()
			this.numberOfPages=Math.ceil(live.questions.length/live.pageSize); 
		});
	};

	this.getTotalTime=()=>{
		return parseInt(live.testtime);
	}

	// this.getQuestions();

	// push the user performance data to the attemptedBy array in test model
	this.pushToAttemptedUsers=(data)=>{
		var params = {
			testid:data.testId,
			userid:data.user_id,
			score:data.score,
			total_score: data.total_score
		}
		apiService.testAttempted(params).then(function(response){
			$state.go('dashboard.result', {tid: data.testId}) ;
		});
	};
	//go to a particular question
	this.gotoQues=(qno)=>{
		$("div.question-pallete").find('div').each(function(index){
			if ($(this).hasClass('green-color')) $(this).removeClass('green-color') 
		});
		live.currentPage=qno;
		$("#"+live.currentPage).addClass('viewed_color green-color')
	}
	//store the user answer into an array before submitting
	this.answers=(qno,option,qid)=>{
		live.useroptions[qno]={
			qid:qid,
			option:option
		}
	};
	///Configuration for dispalying questions one by one
	// this.currentPage = 0;
	this.pageSize = 1;
	this.numberOfPages=Math.ceil(live.questions.length/live.pageSize);  

	// show a modal 
	this.showModal=()=>{
		$('#alertModal').modal('show');
	};

	//submit the questions answers given by the user
	this.submitAnswers=()=>{
		var data = {
			'testtime': $rootScope.num,
			'tid': $rootScope.tid,
			'userid': $rootScope.userID,
		}
		apiService.get_testtime_tid(data).then(function successCallBack(response){
			$scope.testid = response.data.data['testId'];
				var performanceInfo={
				userid:$rootScope.userID,
				testid:$scope.testid,
				noOfQuestions:live.questions.length,
				timetaken:live.timetaken,
				question_id:$rootScope.question_id,
				correct_answer_id:$rootScope.answer_id,
				answers: live.useroptions
			}
			apiService.submitAnswers(performanceInfo).then(function successCallBack(response){
				live.pushToAttemptedUsers(response.data.data);
			},
			function errorCallback(response) {
				alert("some error occurred. Check the console.");
				console.log(response); 
			});
		});
	};

	//broadcast an event when the timer stops
	this.stopTimer = function (){
		console.log("broadcast")
		$scope.$broadcast('timer-stop');
	};

	this.saveNext = ()=> {
		live.currentPage = live.currentPage + 1
		$("div.question-pallete").find('div').each(function(index){
			if ($(this).hasClass('green-color')) $(this).removeClass('green-color') 
		});
		$("#"+live.currentPage).addClass('viewed_color green-color')
	}

	this.prev = ()=> {
		live.currentPage = live.currentPage - 1
		$("div.question-pallete").find('div').each(function(index){
			if ($(this).hasClass('green-color')) $(this).removeClass('green-color') 
		});
		$("#"+live.currentPage).addClass('green-color')
	}

	// listen to the timer-stop event 
	$scope.$on('timer-stopped', function (event, data){
		//checking if the test time was completed 
		//if it is true then timetaken will be equal to test time
		if(data.minutes == 0 && data.seconds==0){
			live.timetaken = $scope.testtime;
			live.timesup = true;
			live.showModal();
			
			// else store the time taken
		}else{
			live.timetaken = $scope.testtime - (data.minutes * 60 + data.seconds);
			live.submitAnswers();
		}
	});
}]);


