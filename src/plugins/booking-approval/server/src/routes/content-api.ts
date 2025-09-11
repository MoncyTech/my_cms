export default [
  {
    method: 'GET',
    path: '/',
    // name of the controller file & the method.
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/config',
    handler: 'config.getConfig',
    config: { auth: false }, // set auth:true if you want
  },
];
