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
	},
	methods: {
		addTask: function() {
			var tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			this.tasks.push({"name": "", "time": tomorrow, "id": nextTaskID});
			nextTaskID++;
		},
		removeTask: function(id) {
			this.tasks = this.tasks.filter(task => task.id != id);
		},
		/* https://stackoverflow.com/questions/48794066/vuejs-how-to-bind-a-datetime */
		getDate: function(datetime) {
			const offset = datetime.getTimezoneOffset()
			datetime = new Date(datetime.getTime() - (offset*60*1000))
			return datetime.toISOString().split('T')[0];
		},
		setDate: function(task, datetime) {
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
					// SEND REQUEST TO EMAIL HERE.
					this.$http.post("localhost:8080/send", {
						"recipients": this.friends,
						"failer": this.name,
						"task": this.tasks[i].name,
						"time": this.tasks[i].time,
						"phone": this.phone,
						"facebook": this.facebook,
						"twitter": this.twitter,
						"linkedin": this.linkedin,
						"email": this.email
					}).then(response => {
						console.log(response);
					});
				}
			}
			this.tasks = this.tasks.filter(task => task.time > now);
		},
		addFriend: function() {
			this.friends.push({"name": "", "email": "", "id": nextFriendID});
			nextFriendID++;
		},
		removeFriend: function(id) {
			this.friends = this.friends.filter(friend => friend.id != id);
		}
	},
	computed: {
		path() {
			return this.$route.path;
		}
	}
});
