const Tasks = { };
const Profile = { };
const Friends = { };

const routes = [
	{ path: '/', redirect: '/tasks'},
	{ path: '/tasks', component: Tasks },
	{ path: '/profile', component: Profile },
	{ path: '/friends', component: Friends },
	{ path: '*', redirect: '/tasks'}
];

var nextTaskID = 0;
var nextFriendID = 0;

// https://stackoverflow.com/a/2117523
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// w3schools cookie code
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const app = new Vue({
	el: "#app",
	router: new VueRouter({ routes: routes }),
	data: {
		tasks: [],
		friends: [],
		name: "",
		email: "",
		phone: "",
		facebook: "",
		twitter: "",
		linkedin: "",
		id: "",
	},
	methods: {
		saveData: function () {
			setCookie("data", JSON.stringify({
				"tasks": this.tasks,
				"friends": this.friends,
				"name": this.name,
				"email": this.email,
				"phone": this.phone,
				"facebook": this.facebook,
				"twitter": this.twitter,
				"linkedin": this.linkedin,
			}), 365);
		},
		addTask: function() {
			var tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			this.tasks.unshift({"name": "", "time": tomorrow, "id": nextTaskID});
			nextTaskID++;
		},
		removeTask: function(id) {
			this.tasks = this.tasks.filter(task => task.id != id);
		},
		/* https://stackoverflow.com/questions/48794066/vuejs-how-to-bind-a-datetime */
		getDate: function(datetime) {
			const offset = datetime.getTimezoneOffset()
			datetime = new Date(datetime.getTime() + (offset*60*1000))
			return datetime.toISOString().split('T')[0];
		},
		setDate: function(task, datetime) {
			const offset = datetime.getTimezoneOffset()
			datetime = new Date(datetime.getTime() + (offset*60*1000))
			var hours = task.time.getHours();
			var minutes = task.time.getMinutes();
			datetime.setHours(hours);
			datetime.setMinutes(minutes);
			task.time = datetime;
		},
		getTime: function(datetime) {
			var hours = datetime.getHours() + "";
			if (hours.length < 2) {
				hours = "0" + hours;
			}
			var minutes = datetime.getMinutes() + "";
			if (minutes.length < 2) {
				minutes = "0" + minutes;
			}
			return hours + ":" + minutes;
		},
		setTime: function(task, datetime) {
			const offset = datetime.getTimezoneOffset()
			datetime = new Date(datetime.getTime() + (offset*60*1000))
			var year = task.time.getFullYear();
			var month = task.time.getMonth();
			var day = task.time.getDate();
			datetime.setYear(year);
			datetime.setMonth(month);
			datetime.setDate(day);
			task.time = datetime;
		},
		
		removeOverdueTasks: function() {
			var now = new Date();
			for (i in this.tasks) {
				if (this.tasks[i].time < now) {
					var XHR = new XMLHttpRequest();
					XHR.open("POST", "/send")
					XHR.addEventListener("load", function(event) {
						console.log(event);
					});
					XHR.send(JSON.stringify({
						"recipients": this.friends,
						"failer": this.name,
						"task": this.tasks[i].name,
						"time": this.tasks[i].time,
						"phone": this.phone,
						"facebook": this.facebook,
						"twitter": this.twitter,
						"linkedin": this.linkedin,
						"email": this.email
					}));
				}
			}
			this.tasks = this.tasks.filter(task => task.time > now);
		},
		addFriend: function() {
			this.friends.unshift({"name": "", "email": "", "id": nextFriendID});
			nextFriendID++;
		},
		removeFriend: function(id) {
			this.friends = this.friends.filter(friend => friend.id != id);
		}
	},
	computed: {
		path: function () {
			return this.$route.path;
		},
		hasAllInfoFilledOut: function () {
			return this.name !== "" && (this.email !== "" || this.phone !== "" || this.facebook !== "" || this.twitter !== "" || this.linkedin !== "") && this.friends.length > 0
		}
	},
	mounted: function () {
		var newdata = JSON.parse(getCookie("data"));
		this.tasks = newdata.tasks;
		for (var i in this.tasks) {
			this.tasks[i].time = new Date(this.tasks[i].time)
		}
		this.friends = newdata.friends
		this.name = newdata.name
		this.email = newdata.email
		this.phone = newdata.phone
		this.facebook = newdata.facebook
		this.twitter = newdata.twitter
		this.linkedin = newdata.linkedin
		this.$nextTick(function () {
			window.setInterval(() => {
				this.removeOverdueTasks();
				this.saveData();
			},1000);
		});
    }
});
