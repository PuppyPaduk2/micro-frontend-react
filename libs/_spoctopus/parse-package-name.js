const detectScope = (value) => {
  let scope = "";
  let name = "";

  if (value[0] === "@") {
    const [_scope, _name] = value.split("/");
    scope = _scope;
    name = _name;
  } else {
    name = value;
  }

  return { scope, name };
};

const detectVersion = (value) => {
  const [name, version] = value.split("@");

  return { name: name || "", version: version || "" };
};

module.exports = {
  parsePackageName: (value) => {
    const detectedScope = detectScope(value);
    const detectedVersion = detectVersion(detectedScope.name);
    const scopeSeparator = detectedScope.scope ? "/" : "";

    return {
      scope: detectedScope.scope,
      name: detectedVersion.name,
      nameFull: `${detectedScope.scope}${scopeSeparator}${detectedVersion.name}`,
      version: detectedVersion.version,
    };
  },
};
