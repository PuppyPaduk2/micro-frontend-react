const parsePackageName = (value) => {
  if (value[0] === "@") return parseWithScope(value);
  else return parseWithoutScope(value);
};

const parseWithScope = (value) => {
  const [scope, tail] = value.split("/");
  const { short, version } = parseWithoutScope(tail);

  return { scope, short, full: `${scope}/${short}`, version };
};

const parseWithoutScope = (value) => {
  const [short, version] = value.split("@");

  return { scope: "", short, full: short, version };
};

module.exports = { parsePackageName };
