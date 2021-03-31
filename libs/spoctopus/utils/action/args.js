let args = [];

const update = (next = []) => {
  args = next;
};

module.exports = { args: () => args, update };
