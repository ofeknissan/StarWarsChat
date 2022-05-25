class Message {
    constructor(data, time, type, isLeft, seconds, date) {
      this.data = data;
      this.type = type;
      this.time = time;
      this.isLeft = isLeft;
      this.seconds = seconds;
      this.date = date;
    }
  }
export default Message;