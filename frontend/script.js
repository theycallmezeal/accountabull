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

const app = new Vue({
	el: "#app",
	router: new VueRouter({ routes: routes }),
	data: {
		tasks: [],
		friends: [],
		name: [],
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
			this.tasks.push({"name": "", "time": tomorrow});
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
		
		addFriend: function() {
			this.friends.push({"name": "", "email": ""});
		}
	},
	computed: {
		path() {
			return this.$route.path;
		}
	}
});