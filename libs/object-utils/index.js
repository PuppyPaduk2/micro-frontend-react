const removeProps = (obj = {}, props = []) => {
  const next = { ...obj };

  props.forEach((name) => delete next[name]);

  return next;
};

module.exports = { removeProps };
