export default function app() {

	// all your codes are belong to us
	const apiBaseUrl = 'http://tiny-za-server.herokuapp.com/collections/';
	const db = "bdChat";
	var currentUser;
	var currentChatHistory;

	function UserSession(username){
		console.log("creating user ",username)
		this.username = username;
	}

	function Message(username,body){
		this.sender = username;
		this.body = body;
		this.save = function (){
			let postData = {
				sender: this.sender,
				body: this.body,
				timestamp: Date.now()
			}
			let settings = {
				type: 'POST',
				contentType: 'application/json',
				url: apiBaseUrl+db,
				data: JSON.stringify(postData)
			}
			return $.ajax(settings).then(function(data, status, xhr) {
				console.log(data,status);
				getChatHistory();
			});
		}
	}

	function renderChatHistory(item){
		let el = '<li class="list-group-item"><p>'+item.sender+'</p>'+item.body
		if (item.sender == currentUser.username)
			el += '<button type="button" class="btn btn-default deleteBtn" id="'+item._id+'">Delete</button>';
		el += '</li>'
		$('.list-group').append(el);
	}

	function getChatHistory(){
	  var settings = {
	    type: 'GET',
	    contentType: 'application/json',
	    url: apiBaseUrl+db
	  }
	  $.ajax(settings).then(function(data,status,xhr){
			if (JSON.stringify(data) === JSON.stringify(currentChatHistory)){
				console.log("nothing new to show")
			} else {
				console.log(data,currentChatHistory)
				currentChatHistory = data;
				$('.list-group').empty();
		    data.forEach(function(item,index,array){
		      renderChatHistory(item);
		    })
			}
	  })
	}

	function deleteListItem(id){
	  var settings = {
	    type: 'DELETE',
	    url: apiBaseUrl+db+'/'+id,
	  }
	  $.ajax(settings).then(function(data,status,xhr){
			getChatHistory();
	  })
	}

	function renderLoginView(){
		$('.chatView').hide();
		$('.loginView').show();
	}

	function renderChatView(){
		$('.chatView').show();
		$('.loginView').hide();
		getChatHistory();
		setInterval(getChatHistory,2000)
	}

	function loadView(){
		if (currentUser){
			console.log("user is ",currentUser)
			renderChatView();
		}
		else{
			console.log("no user logged in! ",currentUser)
			renderLoginView();
		}
	}


	$('.list').on('click', '.deleteBtn', function(e){
	  deleteListItem(e.currentTarget.id);
	})

	$('#submitBtn').on('click',function(e){
		console.log(currentUser, currentUser.username)
	  let formVal = $('#newItemForm').val();
	  let newMsg = new Message(currentUser.username,formVal);
		newMsg.save();
	})

	$('#loginBtn').on('click',function(e){
	  let formVal = $('#userName').val();
	  currentUser = new UserSession(formVal);
		loadView();
	})

	loadView();

}
