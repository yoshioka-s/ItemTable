class Task {
  constructor(id, name, projectId) {
    this.id = id;
    this.name = name;
    this.projectId = projectId;
    this.finished = false;
    this.spent = 0;
    this.isRunning = false;
    this.startDate = null;
    // TODO: add "due date", "estimated time  "
  }

  start() {
    this.isRunning = true;
    this.startDate = new Date();
  }

  stop() {
    this.isRunning = true;
    this.spent += new Date() - this.startDate;
    this.startDate = null;
  }

  finish() {
    if (this.isRunning) {
      this.stop();
    }
    this.finished = true;
  }
}

module.exports = Task;
