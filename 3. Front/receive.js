const { PythonShell } = require("python-shell");
let options = {
  scriptPath: "",
  args: ["value1", "value2", "value3"]
};
PythonShell.run("client.py", options, function(err, data) {
  if (err) throw err;
  console.log(data);
});