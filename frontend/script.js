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
		"foo": 5
	},
	computed: {
		path() {
			return this.$route.path;
		}
	}
});