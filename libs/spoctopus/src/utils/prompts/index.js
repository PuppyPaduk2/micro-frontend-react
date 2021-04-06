const prompts = require("prompts");

const password = () => {
  let isCancel = false;
  return prompts(
    {
      type: "password",
      name: "password",
      message: "Insert password",
    },
    {
      onCancel: () => (isCancel = true),
    }
  ).then((result) => {
    if (isCancel) throw new Error("Process canceled");
    return result;
  });
};

const packageName = (choices = []) => {
  let isCancel = false;
  return prompts(
    {
      type: "autocomplete",
      name: "packageName",
      message: "Pick a package",
      choices,
    },
    {
      onCancel: () => (isCancel = true),
    }
  ).then((result) => {
    if (isCancel) throw new Error("Process canceled");
    return result;
  });
};

module.exports = { password, packageName };
