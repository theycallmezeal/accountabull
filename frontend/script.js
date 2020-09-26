const Tasks = { template: `
	<div>foo</div>
` };
const Profile = { template: `
	<div>bar</div>
` };
const Friends = { template: `
	<div>bar</div>
` };

const routes = [
	{ path: '/', redirect: '/tasks'},
	{ path: '/tasks', component: Tasks },
	{ path: '/profile', component: Profile },
	{ path: '/friends', component: Friends }
];

const router = new VueRouter({
  routes: routes
});

const app = new Vue({
  router
}).$mount('#app');