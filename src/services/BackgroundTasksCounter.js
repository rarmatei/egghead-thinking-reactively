let tasks = 0;
let callback = null;
export default {
  taskStarted: () => callback(++tasks),
  taskEnded: () => callback(--tasks),
  connect: cb => (callback = cb)
};
