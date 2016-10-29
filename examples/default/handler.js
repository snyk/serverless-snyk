export const hello = (event, context, cb) => {
  const p = new Promise((resolve, reject) => {
    resolve('success');
  });
  p
    .then(r => cb(null, {
      message: 'Serverless Snyk up and running! Your function executed successfully!',
      event,
    }))
    .catch(e => cb(e));
};