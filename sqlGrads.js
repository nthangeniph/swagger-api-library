const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "GradsCoodinator", // update me
      password: "P@ssw0rd", // update me
    },
    type: "default",
  },
  server: "2022-grads.database.windows.net", // update me
  options: {
    database: "Grads_Db", //update me
    encrypt: true,
  },
};

var TYPES = require("tedious").TYPES;

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through

function excuteSqlTask(operation) {
  connection.on("connect", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("connected");
      operation();
    }
  });

  connection.connect();
}

//queryDatabase();

function createNewTable() {
  request = new Request(
    "CREATE TABLE todoList (id VARCHAR(255) PRIMARY KEY, task VARCHAR(255), status INT ,priority INT,isDeleted INT )",
    function (err) {
      if (err) {
        console.log(err);
      }
      console.log("table has been created-1");
    }
  );

  // Close the connection after the final event emitted by the request, after the callback passes
  request.on("requestCompleted", function (rowCount, more) {
    console.log("table has been created");
    connection.close();
  });
  connection.execSql(request);
}
function getAllTasks() {
  let tasks = [];
  request = new Request("SELECT * FROM todoList", function (err, result, fields) {
    if (err) throw err;
    tasks = result;
  });

  // Close the connection after the final event emitted by the request, after the callback passes
  request.on("requestCompleted", function (rowCount, more) {
    console.log("tasks retrieved");
    connection.close();
  });
  connection.execSql(request);

  return tasks;
}

function getTaskById(id) {
  let tasks = {};
  request = new Request(`SELECT * FROM todoList WHERE id = ${id}`, function (err, result, fields) {
    if (err) throw err;
    tasks = result;
  });

  // Close the connection after the final event emitted by the request, after the callback passes
  request.on("requestCompleted", function (rowCount, more) {
    console.log("task retrieved");
    connection.close();
  });
  connection.execSql(request);

  return tasks;
}

function createTask(task) {
  let task = {};
  let id = NEWID();
  request = new Request(
    `INSERT INTO todoList (id,task, status,priority,isDeleted) VALUES (${id}, ${task}, 0, 1,0)`,
    function (err, result, fields) {
      if (err) throw err;
      task = result;
    }
  );

  // Close the connection after the final event emitted by the request, after the callback passes
  request.on("requestCompleted", function (rowCount, more) {
    console.log("task created");
    connection.close();
  });
  connection.execSql(request);

  return task;
}

function deleteTask(id) {
  let task = {};
  request = new Request(`DELETE FROM todoList WHERE id = ${id}`, function (err, result, fields) {
    if (err) throw err;
    task = result;
  });

  // Close the connection after the final event emitted by the request, after the callback passes
  request.on("requestCompleted", function (rowCount, more) {
    console.log("task deleted");
    connection.close();
  });
  connection.execSql(request);

  return task;
}
function updateTask(taskUp) {
  let task = {};
  const { id, task, status, priority, isDeleted } = taskUp;
  request = new Request(
    `UPDATE customers SET task =${task},status=${status},priority=${priority},isDeleted=${isDeleted} WHERE id = ${id}`,
    function (err, result, fields) {
      if (err) throw err;
      task = result;
    }
  );

  // Close the connection after the final event emitted by the request, after the callback passes
  request.on("requestCompleted", function (rowCount, more) {
    console.log("task deleted");
    connection.close();
  });
  connection.execSql(request);

  return task;
}

module.exports = {
  createTask,
  deleteTask,
  updateTask,
  getAllTasks,
  getTaskById,
  excuteSqlTask,
};
